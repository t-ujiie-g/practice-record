'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { startOfWeek, format, addDays } from 'date-fns';
import { techniqueColors } from '@/app/const';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TrainingCountData {
    date: string; // 'yyyy-MM-dd' 形式
    count: number;
  }

interface AnalysisDetail {
    id: number;
    content: string;
    description: string;
    date: string;
    tags: string[];
  }

interface TermAnalysisChartProps {
    startDate?: string;
    endDate?: string;
    description?: string;
    contents?: string[];
    tagNames?: string[];
    tagFilterType?: string;
  }

  interface ChartData {
    labels: string[]; // tagNameを格納
    datasets: {
      label: string; // techniqueの名前
      data: number[];
      backgroundColor: string;
    }[];
  }

const TermAnalysisChart: React.FC<TermAnalysisChartProps> = ({ startDate, endDate, description, contents, tagNames, tagFilterType }) => {
  const [analysisDetails, setAnalysisDetails] = useState<AnalysisDetail[]>([]);
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [options, setOptions] = useState({ scales: { x: { stacked: true }, y: { stacked: true } }, plugins: { legend: { display: true } } });
  const [aggregateType, setAggregateType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

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

  useEffect(() => {
    const fetchAnalysisDetails = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''; // 環境変数からAPIのURLを取得
      let url = `${apiUrl}/analysis_detail?`;
  
      const queryParams = [];
      if (startDate) queryParams.push(`start_date=${encodeURIComponent(startDate)}`);
      if (endDate) queryParams.push(`end_date=${encodeURIComponent(endDate)}`);
      if (description) queryParams.push(`description=${encodeURIComponent(description)}`);
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

      if (tagFilterType) queryParams.push(`condition=${encodeURIComponent(tagFilterType)}`);
  
      const queryString = queryParams.join('&');
      const response = await fetch(`${url}${queryString}`);
      const data: AnalysisDetail[] = await response.json();

      setAnalysisDetails(data);
    };

    fetchAnalysisDetails();
  }, [startDate, endDate, contents, tagNames, tagFilterType]);

  useEffect(() => {
    const aggregateData = () => {
      let aggregatedData: { [key: string]: { [content: string]: number } } = {};
  
      analysisDetails.forEach(({ date, content }) => {
        let formattedDate = '';
        const dateObj = new Date(date);
      
        switch (aggregateType) {
          case 'daily':
            formattedDate = format(dateObj, 'yyyy-MM-dd');
            break;
          case 'weekly':
            // 週の最初の日（例: 日曜日）をフォーマットします
            formattedDate = format(startOfWeek(dateObj, { weekStartsOn: 1 }), 'yyyy-MM-dd');
            break;
          case 'monthly':
            // 月のフォーマット（年と月のみ）
            formattedDate = format(dateObj, 'yyyy-MM');
            break;
          default:
            formattedDate = format(dateObj, 'yyyy-MM-dd');
        }
      
        if (!aggregatedData[formattedDate]) {
          aggregatedData[formattedDate] = {};
        }
        if (!aggregatedData[formattedDate][content]) {
          aggregatedData[formattedDate][content] = 0;
        }
        aggregatedData[formattedDate][content] += 1;
      });
  
      const contents = [...new Set(analysisDetails.map(detail => detail.content))];
      const sortedDates = Object.keys(aggregatedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
      const datasets = contents.map(content => {
        const color = techniqueColors[content] || '#000000'; // techniqueColorsは別途定義またはインポートする
        return {
          label: content,
          data: sortedDates.map(date => aggregatedData[date][content] || 0),
          backgroundColor: color,
        };
      });
  
      setChartData({
        labels: sortedDates,
        datasets,
      });
    };
  
    aggregateData();
  }, [analysisDetails, aggregateType]);

  const handleAggregateTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAggregateType(event.target.value as 'daily' | 'weekly' | 'monthly');
  };

  return (
    <>
      <div className="flex items-center space-x-4 mb-4">
        <label htmlFor="aggregateType" className="text-sm font-medium text-gray-700">集計方法:</label>
        <select
          id="aggregateType"
          value={aggregateType}
          onChange={handleAggregateTypeChange}
          className="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-blue-50"
        >
          <option value="daily">日別</option>
          <option value="weekly">週別</option>
          <option value="monthly">月別</option>
        </select>
      </div>
      <Bar data={chartData} options={options} />
    </>
  );
}

export default TermAnalysisChart;
