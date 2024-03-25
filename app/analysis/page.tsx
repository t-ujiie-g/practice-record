'use client';

import React, { useState, KeyboardEvent } from 'react';
import TagAnalysisChart from '@/components/tagAnalysisChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CONTENTS_LIST } from '@/app/const';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'; // XMarkIconのインポートが必要です
import { ja } from 'date-fns/locale';
import { startOfMonth } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import AnalysisDetailTable from '@/components/detailAnalysisTable';
import TermAnalysisChart from '@/components/termAnalysisChart';

const AnalysisPage: React.FC = () => {
  const firstDayOfCurrentMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd');

    const [startDate, setStartDate] = useState<string>(firstDayOfCurrentMonth);
    const [endDate, setEndDate] = useState<string>('');
    const [contents, setContents] = useState<string[]>(['']); // 技名を複数管理するため配列に変更
    const [tags, setTags] = useState<string[]>([]); // タグの状態を文字列の配列で管理
    const [description, setDescription] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState<'detail' | 'chart' | 'term'>('detail');
  
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

  const handleStartDateChange = (date: Date) => {
    // 日本のタイムゾーンを考慮してDateオブジェクトを変換
    const zonedDate = utcToZonedTime(date, 'Asia/Tokyo');
    // 'yyyy-MM-dd'形式の文字列に変換
    const dateString = format(zonedDate, 'yyyy-MM-dd', { timeZone: 'Asia/Tokyo' });
    setStartDate(dateString);
  };
  
  const handleEndDateChange = (date: Date) => {
    // 日本のタイムゾーンを考慮してDateオブジェクトを変換
    const zonedDate = utcToZonedTime(date, 'Asia/Tokyo');
    // 'yyyy-MM-dd'形式の文字列に変換
    const dateString = format(zonedDate, 'yyyy-MM-dd', { timeZone: 'Asia/Tokyo' });
    setEndDate(dateString);
  };

  // descriptionの入力変更をハンドルする関数
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

    // 技名の入力欄を追加する関数
    const addContentInput = () => {
      setContents(prevContent => [...prevContent, '']);
  };

  // 特定の技名の入力欄を削除する関数
  const removeContentInput = (index: number) => {
      setContents(prevContent => prevContent.filter((_, i) => i !== index));
  };

  // 技名の変更をハンドルする関数
  const handleContentChange = (index: number, value: string) => {
      setContents(prevContent => prevContent.map((content, i) => i === index ? value : content));
  };

  // タブの切り替えをハンドルする関数
  const handleTabChange = (tab: 'detail' | 'chart' | 'term') => {
    setSelectedTab(tab);
};

  return (
    <div className="pt-5">
      <h1 className="text-xl font-bold mb-4">稽古記録分析</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">開始日</label>
          <DatePicker
            id="startDate"
            className="form-input px-4 py-2 border rounded"
            selected={startDate ? new Date(startDate) : null} // 文字列をDateオブジェクトに変換
            onChange={(date: Date) => handleStartDateChange(date)}
            locale={ja}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">終了日</label>
          <DatePicker
            id="endDate"
            className="form-input px-4 py-2 border rounded"
            selected={endDate ? new Date(endDate) : null} // 文字列をDateオブジェクトに変換
            onChange={(date: Date) => handleEndDateChange(date)}
            locale={ja}
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">備考</label>
        <input
            id="description"
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            className="form-input px-4 py-2 border rounded w-full"
            placeholder="備考を入力..."
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">技名</label>
        {contents.map((contentItem, index) => (
                <div key={index} className="mb-4 flex items-center">
                    <select
                        value={contentItem}
                        onChange={(e) => handleContentChange(index, e.target.value)}
                        className="form-select px-4 py-2 border rounded w-full"
                    >
                        <option value="">選択してください</option>
                        {CONTENTS_LIST.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                    {index === 0 ? (
                        <button type="button" onClick={addContentInput} className="ml-2">
                            <PlusIcon className="h-5 w-5 text-blue-700" />
                        </button>
                    ) : (
                        <button type="button" onClick={() => removeContentInput(index)} className="ml-2">
                            <XMarkIcon className="h-5 w-5 text-red-500" />
                        </button>
                    )}
                </div>
            ))}
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
      <div className="mb-4">
                <button
                    className={`px-4 py-2 ${selectedTab === 'detail' ? 'bg-blue-500 text-white' : 'bg-transparent'}`}
                    onClick={() => handleTabChange('detail')}
                >
                    稽古検索
                </button>
                <button
                    className={`px-4 py-2 ${selectedTab === 'term' ? 'bg-blue-500 text-white' : 'bg-transparent'}`}
                    onClick={() => handleTabChange('term')}
                >
                    期間分析
                </button>
                <button
                    className={`px-4 py-2 ${selectedTab === 'chart' ? 'bg-blue-500 text-white' : 'bg-transparent'}`}
                    onClick={() => handleTabChange('chart')}
                >
                    タグ分析
                </button>
            </div>
            {/* 条件に基づいてコンポーネントを切り替え */}
            {selectedTab === 'detail' ? (
                <AnalysisDetailTable
                    startDate={startDate}
                    endDate={endDate}
                    description={description}
                    contents={contents}
                    tagNames={tags.filter(tag => tag.trim() !== '')}
                />
            ) : selectedTab === 'term' ? (
                <TermAnalysisChart
                    startDate={startDate}
                    endDate={endDate}
                    description={description}
                    contents={contents}
                    tagNames={tags.filter(tag => tag.trim() !== '')}
                />
            ) : (
                <TagAnalysisChart
                    startDate={startDate}
                    endDate={endDate}
                    description={description}
                    contents={contents}
                    tagNames={tags.filter(tag => tag.trim() !== '')}
                />
            )}
    </div>
  );
};

export default AnalysisPage;
