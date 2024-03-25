'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

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
  }

const TermAnalysisChart: React.FC<TermAnalysisChartProps> = ({ startDate, endDate, description, contents, tagNames }) => {
  const [analysisDetails, setAnalysisDetails] = useState<AnalysisDetail[]>([]);
  const [trainingCounts, setTrainingCounts] = useState<TrainingCountData[]>([]);

  useEffect(() => {
    const fetchAnalysisDetails = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''; // 環境変数からAPIのURLを取得
      let url = `${apiUrl}/analysis_detail?`;
  
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
      const data: AnalysisDetail[] = await response.json();

      // 日付ごとに回数を集計
      const countsByDate = data.reduce((acc, { date }) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as { [date: string]: number });

    // 日付ごとに回数を集計した後、集計結果を配列に変換
    const countsArray = Object.entries(countsByDate).map(([date, count]) => ({ date, count }));

    // 日付でソート
    const sortedCountsArray = countsArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // ソートされた配列を状態に設定
    setTrainingCounts(sortedCountsArray);
    };

    fetchAnalysisDetails();
  }, [startDate, endDate, contents, tagNames]);

  const data = {
    labels: trainingCounts.map(item => item.date),
    datasets: [
      {
        label: '稽古回数',
        data: trainingCounts.map(item => item.count),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
      <Bar data={data} />
  );
};

export default TermAnalysisChart;