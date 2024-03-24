'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { RecordDetail } from '@/app/definitions';

const RecordDetailComponent = ({ recordId }: { recordId: number }) => {
  const supabase = createClientComponentClient<Database>()

  const [recordDetail, setRecordDetail] = useState<RecordDetail | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRecordDetail = async () => {
      try {
        // 現在ログインしているユーザーの情報を取得
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          console.error('ユーザーがログインしていません。');
          return; // または適切なエラーハンドリング
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''; // 環境変数からAPIのURLを取得
        const response = await fetch(`${apiUrl}/records/${recordId}/?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('記録の詳細の取得に失敗しました。');
        }
        const data = await response.json();
        setRecordDetail(data);
      } catch (error) {
        console.error('記録の詳細の取得に失敗しました。', error);
      }
    };
  
    fetchRecordDetail();
  }, [recordId]); // recordIdが変更されたら再取得

  const handleDelete = async () => {
    if (window.confirm('この記録を削除してもよろしいですか？')) {
      try {
        // 現在ログインしているユーザーの情報を取得
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          console.error('ユーザーがログインしていません。');
          return; // または適切なエラーハンドリング
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''; // 環境変数からAPIのURLを取得、または直接指定
        const response = await fetch(`${apiUrl}/records/${recordId}/?userId=${user.id}`, {
          method: 'DELETE', // HTTPメソッドをDELETEに設定
        });
  
        if (!response.ok) {
          throw new Error('記録の削除に失敗しました。');
        }
  
        await response.json(); // 応答をJSONとして解析（もし応答に重要なメッセージが含まれている場合）
        alert('記録が削除されました。');
        window.location.href = '/record'; // 削除後のリダイレクト先
      } catch (error) {
        console.error('記録の削除に失敗しました。', error);
        alert('記録の削除に失敗しました。');
      }
    }
  };

  const handleEdit = () => {
    router.push(`/record/edit/${recordId}`); // 編集ページへのルーティング
  };

  if (!recordDetail) return <div>Loading...</div>;
  // 日付データをDateオブジェクトに変換
  const formattedDate = new Date(recordDetail.date).toLocaleDateString();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold my-4 text-gray-800">稽古記録詳細</h1>
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
        <p className="text-md mb-1">日付: {formattedDate}</p>
        <p className="text-md mb-1">開始時間: {recordDetail.startTime}{recordDetail.startMinute}</p>
        <p className="text-md mb-4">終了時間: {recordDetail.endTime}{recordDetail.endMinute}</p>
        <div>
          <h3 className="text-lg font-semibold mb-2">稽古詳細:</h3>
          {recordDetail.practiceDetails && recordDetail.practiceDetails.map((detail, index) => (
            <div key={index} className="mb-4">
              <p className="text-md font-medium">技名: {detail.content}</p>
              <p className="text-md font-medium">タグ:</p>
              <ul className="list-disc pl-5">
                {detail.tags && detail.tags.map((tag, tagIndex) => (
                  <li key={tagIndex} className="text-md">{tag.name}</li> // ここでタグの名前を表示
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