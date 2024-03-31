'use client';

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { techniqueColors } from '@/app/const';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TechniqueCount {
  [tag: string]: number;
}

interface PracticeType {
  [practiceTypeName: string]: TechniqueCount[];
}

type AnalysisData = PracticeType[];

interface ChartData {
  labels: string[]; // tagNameを格納
  datasets: {
    label: string; // techniqueの名前
    data: number[];
    backgroundColor: string;
  }[];
}

interface AnalysisChartProps {
  startDate?: string;
  endDate?: string;
  description?: string;
  contents?: string[];
  tagNames?: string[];
}

interface TechniqueData {
  [tagName: string]: {
    [techniqueName: string]: number;
  };
}

const TagAnalysisChart: React.FC<AnalysisChartProps> = ({ startDate, endDate, description, contents, tagNames }) => {
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [options, setOptions] = useState({ scales: { x: { stacked: true }, y: { stacked: true } }, plugins: { legend: { display: true } } });

  useEffect(() => {
    // ウィンドウの幅に基づいて凡例の表示/非表示を切り替える
    const updateOptions = () => {
      const isMobile = window.innerWidth < 768; // 768pxをスマホ表示とする基準としています
      setOptions({
        scales: { x: { stacked: true }, y: { stacked: true } },
        plugins: { legend: { display: !isMobile } } // スマホの場合は凡例を非表示にする
      });
    };

    updateOptions(); // 初期表示時にオプションを設定
    window.addEventListener('resize', updateOptions); // ウィンドウサイズが変更された時にオプションを更新

    return () => window.removeEventListener('resize', updateOptions); // コンポーネントのクリーンアップ時にイベントリスナーを削除
  }, []);

  const fetchAnalysisData = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''; // 環境変数からAPIのURLを取得
    let url = `${apiUrl}/analysis_tag?`;

    const queryParams = [];
    if (startDate) queryParams.push(`start_date=${encodeURIComponent(startDate)}`);
    if (endDate) queryParams.push(`end_date=${encodeURIComponent(endDate)}`);
    if (description) queryParams.push(`description=${encodeURIComponent(description)}`);
    // if (content) queryParams.push(`contents=${encodeURIComponent(content)}`);
    if (contents && contents.length > 0 && !contents.every(content => content === '')) {
      contents.forEach(content => {
        queryParams.push(`contents=${encodeURIComponent(content)}`);
      });
    }

    if (tagNames && tagNames.length > 0) {
      tagNames.forEach(tagName => {
        queryParams.push(`tag_names=${encodeURIComponent(tagName)}`);
      });
    }

    const queryString = queryParams.join('&');
    const response = await fetch(`${url}${queryString}`);
    const data: AnalysisData = await response.json();

    const techniqueData: TechniqueData = {}; // 型定義を使用
    data.forEach(practiceTypeObj => {
      Object.entries(practiceTypeObj).forEach(([practiceTypeName, techniques]) => {
        techniques.forEach(technique => {
          const [tagName, count] = Object.entries(technique)[0];
          if (!techniqueData[tagName]) techniqueData[tagName] = {};
          // ここでpracticeTypeNameを使用してカウントを集計
          techniqueData[tagName][practiceTypeName] = (techniqueData[tagName][practiceTypeName] || 0) + count;
        });
      });
    });

  // 各タグの合計回数を計算
  const tagTotals: { [tagName: string]: number } = {};
  Object.keys(techniqueData).forEach(tagName => {
    tagTotals[tagName] = Object.values(techniqueData[tagName]).reduce((sum, count) => sum + count, 0);
  });

  // 合計回数に基づいてタグを並べ替え
  const sortedTags = Object.keys(tagTotals).sort((a, b) => tagTotals[b] - tagTotals[a]);

  // 並べ替えたタグの順序でlabelsとdatasetsのデータを構築
  const labels = sortedTags;

  const datasets = Object.entries(techniqueColors).map(([techniqueName, color]) => {
    const data = labels.map(tagName => techniqueData[tagName][techniqueName] || 0);
    return {
      label: techniqueName,
      data,
      backgroundColor: color,
    };
  });

  setChartData({ labels, datasets });
};

  useEffect(() => {
    fetchAnalysisData();
  }, [startDate, endDate, contents, tagNames]);

  return <Bar data={chartData} options={options} />;
};

export default TagAnalysisChart;
