'use client';

import React, { useState, KeyboardEvent } from 'react';
import AnalysisChart from '@/components/analysisChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CONTENTS_LIST } from '@/app/const';
import { XMarkIcon } from '@heroicons/react/24/solid'; // XMarkIconのインポートが必要です

const AnalysisPage: React.FC = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [content, setContent] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]); // タグの状態を文字列の配列で管理
  
    const handleContentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setContent(e.target.value);
    };
  
  // タグの追加
  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags(prevTags => [...prevTags, tag]);
    }
  };

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.currentTarget.value) {
      e.preventDefault();
      addTag(e.currentTarget.value); // addTag関数を使用してタグを追加
      e.currentTarget.value = ''; // 入力フィールドをクリア
    }
  };

  // タグの削除
  const removeTag = (index: number) => {
    setTags(prevTags => prevTags.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">稽古記録分析</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">開始日</label>
          <DatePicker
            id="startDate"
            className="form-input px-4 py-2 border rounded"
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">終了日</label>
          <DatePicker
            id="endDate"
            className="form-input px-4 py-2 border rounded"
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">内容</label>
        <select
          id="content"
          value={content}
          onChange={handleContentChange} // 変更: handleContentChangeを更新
          className="form-select px-4 py-2 border rounded w-full"
        >
          <option value="">選択してください</option>
          {CONTENTS_LIST.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        {tags.map((tag, index) => (
          <span key={index} className="inline-flex items-center bg-gray-200 rounded-full p-2 text-sm text-gray-700 m-1">
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="">
              <XMarkIcon className="h-4 w-4" />
            </button>
          </span>
        ))}
        <input
          type="text"
          onKeyDown={handleTagInputKeyDown}
          className="shadow appearance-none border rounded py-2 px-3 m-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="タグを追加..."
        />
      </div>
      <AnalysisChart
        startDate={startDate ? startDate.toISOString().split('T')[0] : undefined}
        endDate={endDate ? endDate.toISOString().split('T')[0] : undefined}
        content={content}
        tagNames={tags.filter(tag => tag.trim() !== '')}
      />
    </div>
  );
};

export default AnalysisPage;
