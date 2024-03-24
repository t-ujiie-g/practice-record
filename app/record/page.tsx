'use client';

import React, { useState, useEffect } from 'react';
import { Record } from '@/app/definitions';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import RecordDetailComponent from './recordDetailComponent';
import { HiChevronLeft, HiChevronRight, HiChevronUp, HiChevronDown } from 'react-icons/hi'; // Heroiconsのインポート
import DatePicker from 'react-datepicker';
import { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { ja } from 'date-fns/locale'; 

registerLocale('ja', ja); // 日本語のロケールを登録

const RecordsPage = () => {
  const supabase = createClientComponentClient<Database>()

  const [records, setRecords] = useState<Record[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [isListVisible, setIsListVisible] = useState(true); // 一覧表示の状態管理

  useEffect(() => {
    const selectedYear = startDate.getFullYear();
    const selectedMonth = startDate.getMonth() + 1; // JavaScriptの月は0から始まるため、+1して調整
    const fetchRecords = async () => {
      try {
        // 現在ログインしているユーザーの情報を取得
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          console.error('ユーザーがログインしていません。');
          return; // または適切なエラーハンドリング
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''; // 環境変数からAPIのURLを取得
        const response = await fetch(`${apiUrl}/records/${selectedYear}/${selectedMonth}/?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('記録の取得に失敗しました。');
        }
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error('記録の取得に失敗しました。', error);
      }
    };
  
    fetchRecords();
    // 月を変更した際に詳細表示をリセット
    setSelectedRecordId(null);
  }, [startDate]); // startDateが変更されたら再取得

  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row items-start">
        {/* 一覧画面 */}
        {isListVisible && (
          <div className="w-full lg:w-1/4 lg:mr-4">
          <h1 className="text-xl font-bold my-4">稽古記録一覧</h1>
          <div className="flex justify-between items-center my-4">
            <div className="flex items-center">
              <button
                onClick={() => {
                  setStartDate(new Date(startDate.setFullYear(startDate.getFullYear(), startDate.getMonth() - 1)));
                  setSelectedRecordId(null); // ここで詳細表示をリセット
                }}
                className="text-gray-800 hover:text-gray-600 transition-colors duration-200 ease-in-out"
              >
                <HiChevronLeft className="h-6 w-6" />
              </button>
              <DatePicker
                locale={ja}
                selected={startDate}
                onChange={(date: Date) => {
                  setStartDate(date);
                  setSelectedRecordId(null); // ここで詳細表示をリセット
                }}
                dateFormat="yyyy/MM"
                showMonthYearPicker
                className="mx-2 border-none cursor-pointer text-center shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out rounded-md"
                wrapperClassName="cursor-pointer"
              />
              <button
                onClick={() => {
                  setStartDate(new Date(startDate.setFullYear(startDate.getFullYear(), startDate.getMonth() + 1)));
                  setSelectedRecordId(null); // ここで詳細表示をリセット
                }}
                className="text-gray-800 hover:text-gray-600 transition-colors duration-200 ease-in-out"
              >
                <HiChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        <ul>
          {records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((record) => (
            <li key={record.id} className="mb-4">
              <button
                onClick={() => setSelectedRecordId(record.id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-[300px]"
              >
                {new Date(record.date).toLocaleDateString()} - {record.description}
              </button>
            </li>
          ))}
        </ul>
        </div>
        )}
      {/* 詳細画面 */}
      {/* 一覧画面の表示制御 */}
      <button
        className="lg:hidden mb-4 flex items-center justify-center"
        onClick={() => setIsListVisible(!isListVisible)}
      >
        {isListVisible ? (
          <>
            <HiChevronUp className="h-10 w-10" />
            <span>一覧を閉じる</span>
          </>
        ) : (
          <>
            <HiChevronDown className="h-10 w-10" />
            <span>一覧を表示</span>
          </>
        )}
      </button>
      {selectedRecordId && (
        <div className={`w-full ${isListVisible ? 'lg:w-3/4' : 'lg:w-full'}`}>
          <RecordDetailComponent recordId={selectedRecordId} />
        </div>
      )}
      </div>
    </div>
  );
};

export default RecordsPage;