'use client';

import { useState } from 'react';
import { createRecord, createTag } from '@/app/api/apis';
import { record } from './api/definitions';

export default function CreateTag() {
  const [name, setName] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleTagSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createTag(name);
      // 成功した場合の処理
      setName('');
      alert('タグが作成されました');
    } catch (error) {
      // エラーハンドリング
      console.error('タグの作成に失敗しました。', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData: record = {
      title: title,
      description: description,
      date: new Date(targetDate),
      startTime: startTime,
      endTime: endTime,
    }
    try {
      await createRecord(submitData);
      // 成功した場合の処理
      setTitle('');
      setDescription('');
      setTargetDate(() => new Date().toISOString().split('T')[0]);
      setStartTime('');
      setEndTime('');
      alert('稽古記録が作成されました');
    } catch (error) {
      // エラーハンドリング
      console.error('稽古記録の作成に失敗しました。', error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10">
      <form onSubmit={handleTagSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            タグ名:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </label>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">登録</button>
      </form>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            タイトル:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            説明:
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            日付:
            <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            開始時間:
            <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            終了時間:
            <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </label>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">登録</button>
      </form>
    </div>
  );
}