'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getRecordById, deleteRecordById } from '@/app/api/apis';
import { RecordDetail } from '@/app/definitions';

const RecordDetailComponent = ({ recordId }: { recordId: number }) => {
  const [recordDetail, setRecordDetail] = useState<RecordDetail | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRecordDetail = async () => {
      try {
        const data = await getRecordById(recordId);
        setRecordDetail(data);
      } catch (error) {
        console.error('記録の詳細の取得に失敗しました。', error);
      }
    };

    fetchRecordDetail();
  }, [recordId]);

  const handleDelete = async () => {
    if (window.confirm('この記録を削除してもよろしいですか？')) {
      try {
        await deleteRecordById(recordId);
        alert('記録が削除されました。');
        window.location.href = '/record'; // 削除後のリダイレクト先
      } catch (error) {
        console.error('記録の削除に失敗しました。', error);
      }
    }
  };

  const handleEdit = () => {
    router.push(`/record/edit/${recordId}`); // 編集ページへのルーティング
  };

  if (!recordDetail) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold my-4 text-gray-800">稽古記録詳細</h1>
      <div className="flex justify-end space-x-2">
        <button onClick={handleEdit} className="p-2 text-blue-500 hover:text-blue-700">
          <PencilIcon className="h-6 w-6" />
        </button>
        <button onClick={handleDelete} className="p-2 text-red-500 hover:text-red-700">
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">備考: {recordDetail.description}</h2>
        <p className="text-md mb-1">日付: {recordDetail.date.toLocaleDateString()}</p>
        <p className="text-md mb-1">開始時間: {recordDetail.startTime}:{recordDetail.startMinute}</p>
        <p className="text-md mb-4">終了時間: {recordDetail.endTime}:{recordDetail.endMinute}</p>
        <div>
          <h3 className="text-lg font-semibold mb-2">稽古詳細:</h3>
          {recordDetail.practiceDetails.map((detail, index) => (
            <div key={index} className="mb-4">
              <p className="text-md font-medium">技名: {detail.content}</p>
              <p className="text-md font-medium">タグ:</p>
              <ul className="list-disc pl-5">
                {detail.practiceTags.map((tag, tagIndex) => (
                  <li key={tagIndex} className="text-md">{tag.tag.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecordDetailComponent;