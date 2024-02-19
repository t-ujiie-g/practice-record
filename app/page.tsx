'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { createRecord } from '@/app/api/apis';

interface PracticeDetailInput {
  content: string;
  tags: string[];
}

export default function CreateRecord() {
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [practiceDetails, setPracticeDetails] = useState<PracticeDetailInput[]>([{ content: '', tags: [''] }]);

  const handlePracticeDetailChange = (index: number, field: keyof PracticeDetailInput, value: string) => {
    const newDetails = [...practiceDetails];
    if (field === 'tags') {
      newDetails[index][field] = value.split(',').map(tag => tag.trim());
    } else {
      newDetails[index][field] = value;
    }
    setPracticeDetails(newDetails);
  };

  const addPracticeDetail = () => {
    setPracticeDetails([...practiceDetails, { content: '', tags: [''] }]);
  };
  // 詳細項目を削除する関数
  const removePracticeDetail = (index: number) => {
    setPracticeDetails(currentDetails => currentDetails.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData = {
      description: description,
      date: new Date(targetDate),
      startTime: startTime,
      endTime: endTime,
      practiceDetails: practiceDetails,
    };
    try {
      await createRecord(submitData);
      setDescription('');
      setTargetDate(() => new Date().toISOString().split('T')[0]);
      setStartTime('');
      setEndTime('');
      setPracticeDetails([{ content: '', tags: [''] }]);
      alert('稽古記録が作成されました');
    } catch (error) {
      console.error('稽古記録の作成に失敗しました。', error);
    }
  };

  // タグの追加
  const addTag = (index: number, tag: string) => {
    const newDetails = [...practiceDetails];
    if (!newDetails[index].tags.includes(tag)) {
      newDetails[index].tags.push(tag);
      setPracticeDetails(newDetails);
    }
  };

  // タグの削除
  const removeTag = (detailIndex: number, tagIndex: number) => {
    const newDetails = [...practiceDetails];
    newDetails[detailIndex].tags.splice(tagIndex, 1);
    setPracticeDetails(newDetails);
  };

  return (
    <div className="max-w-md mx-auto my-10">
      <form onSubmit={handleSubmit}>
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
      <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            備考:
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </label>
        </div>
        <hr className="my-4" /> {/* ここで区切り線を追加 */}
        <div className="space-y-4">
        {practiceDetails.map((detail, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg shadow relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                技名:
                <input type="text" value={detail.content} onChange={(e) => handlePracticeDetailChange(index, 'content', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </label>
              {/* <label className="block text-gray-700 text-sm font-bold mb-2">
                タグ (カンマ区切り):
                <input type="text" value={detail.tags.join(', ')} onChange={(e) => handlePracticeDetailChange(index, 'tags', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </label> */}
              <div>
                {detail.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="inline-flex items-center bg-gray-200 rounded-full p-2 text-sm text-gray-700 mr-2">
                    {tag}
                    <button type="button" onClick={() => removeTag(index, tagIndex)} className="">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      e.preventDefault();
                      addTag(index, e.currentTarget.value);
                      e.currentTarget.value = ''; // 入力フィールドをクリア
                    }
                  }}
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="タグを追加..."
                />
              </div>
              <button
                type="button"
                onClick={() => removePracticeDetail(index)}
                className={`absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline ${practiceDetails.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={practiceDetails.length === 1}
              >
                <XMarkIcon className='h-5 w-5' />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mb-4">
          <button type="button" onClick={addPracticeDetail} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline flex items-center">
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">登録</button>
      </form>
    </div>
  );
}