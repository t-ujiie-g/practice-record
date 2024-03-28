'use client';

import React, { useEffect, useState } from 'react';

interface AnalysisDetail {
  id: number;
  content: string;
  description: string;
  date: string;
  tags: string[];
}

interface AnalysisDetailTableProps {
    startDate?: string;
    endDate?: string;
    description?: string;
    contents?: string[];
    tagNames?: string[];
  }

type SortableColumn = 'id' | 'content' | 'description' | 'date';

const AnalysisDetailTable: React.FC<AnalysisDetailTableProps> = ({ startDate, endDate, description, contents, tagNames }) => {
  const [analysisDetails, setAnalysisDetails] = useState<AnalysisDetail[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [tagFilterType, setTagFilterType] = useState<'and' | 'or'>('and');

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

      if (tagFilterType) queryParams.push(`condition=${encodeURIComponent(tagFilterType)}`);
  
      const queryString = queryParams.join('&');
      const response = await fetch(`${url}${queryString}`);
      const data: AnalysisDetail[] = await response.json();

      setAnalysisDetails(data);
    };

    fetchAnalysisDetails();
  }, [startDate, endDate, contents, tagNames, tagFilterType]);

  const sortData = (column: SortableColumn) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);

    setAnalysisDetails(prevDetails => {
      const sorted = [...prevDetails].sort((a, b) => {
        if (a[column] < b[column]) return newDirection === 'asc' ? -1 : 1;
        if (a[column] > b[column]) return newDirection === 'asc' ? 1 : -1;
        return 0;
      });
      return sorted;
    });
  };

  const handleTagFilterTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagFilterType(event.target.value as 'and' | 'or');
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <div className="flex items-center space-x-4 mb-4">
        <label className="text-sm font-medium text-gray-700">タグフィルター:</label>
        <div className="flex items-center">
          <input
            type="radio"
            name="tagFilterType"
            value="and"
            checked={tagFilterType === 'and'}
            onChange={handleTagFilterTypeChange}
            className="mr-2"
          />
          <label htmlFor="tagFilterTypeAnd" className="mr-4">AND</label>
          <input
            type="radio"
            name="tagFilterType"
            value="or"
            checked={tagFilterType === 'or'}
            onChange={handleTagFilterTypeChange}
            className="mr-2"
          />
          <label htmlFor="tagFilterTypeOr">OR</label>
        </div>
      </div>
      <div style={{ maxHeight: '20rem', overflowY: 'auto' }}>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6 cursor-pointer" onClick={() => sortData('content')}>技名</th>
              <th scope="col" className="py-3 px-6 cursor-pointer" onClick={() => sortData('description')}>説明</th>
              <th scope="col" className="py-3 px-6 cursor-pointer" onClick={() => sortData('date')}>日付</th>
              <th scope="col" className="py-3 px-6">タグ</th>
            </tr>
          </thead>
          <tbody>
            {analysisDetails.map((detail) => (
              <tr key={detail.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6">{detail.content}</td>
                <td className="py-4 px-6">{detail.description}</td>
                <td className="py-4 px-6">{detail.date}</td>
                <td className="py-4 px-6">
                  {detail.tags ? detail.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center bg-gray-200 rounded-full p-2 text-sm text-gray-700 m-1">
                      {tag}
                    </span>
                  )) : 'タグなし'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisDetailTable;