'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { startOfWeek, format, addDays } from 'date-fns';

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

const TermAnalysisChart: React.FC<TermAnalysisChartProps> = ({ startDate, endDate, description, contents, tagNames, tagFilterType }) => {
  const [analysisDetails, setAnalysisDetails] = useState<AnalysisDetail[]>([]);
  const [trainingCounts, setTrainingCounts] = useState<TrainingCountData[]>([]);
  const [aggregateType, setAggregateType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

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

      let aggregatedData: { [key: string]: number } = {};
    
      switch (aggregateType) {
        case 'daily':
          aggregatedData = analysisDetails.reduce((acc, { date }) => {
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number });
          break;
        case 'weekly':
          aggregatedData = analysisDetails.reduce((acc, { date }) => {
            const weekStart = format(startOfWeek(new Date(date), { weekStartsOn: 1 }), 'yyyy-MM-dd');
            acc[weekStart] = (acc[weekStart] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number });
          break;
        case 'monthly':
          aggregatedData = analysisDetails.reduce((acc, { date }) => {
            const month = format(new Date(date), 'yyyy-MM');
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number });
          break;
        default:
          break;
      }
    
      // 集計結果を配列に変換し、日付でソート
      const sortedCountsArray = Object.entries(aggregatedData)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setTrainingCounts(sortedCountsArray);
    };

    aggregateData();
  }, [analysisDetails, aggregateType]);

  const data = {
    labels: trainingCounts.map(item => item.date),
    datasets: [
      {
        label: '技数',
        data: trainingCounts.map(item => item.count),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

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
      <Bar data={data} />
    </>
  );
}

export default TermAnalysisChart;
