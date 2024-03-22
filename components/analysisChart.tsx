'use client';

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TechniqueCount {
  [tag: string]: number;
}

interface PracticeType {
  [practiceTypeName: string]: TechniqueCount[];
}

type AnalysisData = PracticeType[];

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

interface AnalysisChartProps {
  startDate?: string;
  endDate?: string;
  content?: string;
  tagNames?: string[];
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({ startDate, endDate, content, tagNames }) => {
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });

  const fetchAnalysisData = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''; // 環境変数からAPIのURLを取得
    let url = `${apiUrl}/analysis?`;

    const queryParams = [];
    if (startDate) queryParams.push(`start_date=${encodeURIComponent(startDate)}`);
    if (endDate) queryParams.push(`end_date=${encodeURIComponent(endDate)}`);
    if (content) queryParams.push(`content=${encodeURIComponent(content)}`);
    if (tagNames && tagNames.length > 0) {
      tagNames.forEach(tagName => {
        queryParams.push(`tag_names=${encodeURIComponent(tagName)}`);
      });
    }

    const queryString = queryParams.join('&');
    const response = await fetch(`${url}${queryString}`);
    const data: AnalysisData = await response.json();
    const labels: string[] = [];
    const counts: number[] = [];

  // APIからのレスポンスを処理
  data.forEach((practiceTypeObj) => {
    // 稽古の種類の名前を取得します（例: "呼吸投げ"）。
    const practiceTypeName = Object.keys(practiceTypeObj)[0];
    // 稽古の種類をラベルとして追加します。
    labels.push(practiceTypeName);
  
    // 稽古の種類に対応する技の配列を取得します。
    const techniques = practiceTypeObj[practiceTypeName];
    // 各技の回数を合計します。
    let total = techniques.reduce((acc, technique) => {
      const techniqueCount: number = Object.values(technique)[0] as number;
      return acc + techniqueCount;
    }, 0);
  
    // 合計回数をcounts配列に追加します。
    counts.push(total);
  });
  
  setChartData({
    labels,
    datasets: [{
      label: '稽古回数',
      data: counts,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  });

  setChartData({
    labels,
    datasets: [{
      label: '稽古回数',
      data: counts,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  });
};

  useEffect(() => {
    fetchAnalysisData();
  }, [startDate, endDate, content, tagNames]);

  return <Bar data={chartData} />;
};

export default AnalysisChart;
