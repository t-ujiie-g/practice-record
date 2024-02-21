'use client';

import React, { useState, useEffect } from 'react';
import { getAllRecords } from '@/app/api/apis';
import { Record } from '@/app/definitions';
import RecordDetailComponent from './recordDetailComponent'; // 詳細ページのコンポーネントをインポート

const RecordsPage = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getAllRecords();
        setRecords(data);
      } catch (error) {
        console.error('記録の取得に失敗しました。', error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="container mx-auto flex justify-center">
      <div className="w-full max-w-4xl flex">
        <div className="w-1/2 p-4">
          <h1 className="text-2xl font-bold my-4">稽古記録一覧</h1>
          <ul>
            {records.map((record) => (
              <li key={record.id} className="mb-4">
                <button
                  onClick={() => setSelectedRecordId(record.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                >
                  {new Date(record.date).toLocaleDateString()} - {record.description}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 p-4">
          {selectedRecordId && <RecordDetailComponent recordId={selectedRecordId} />}
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;