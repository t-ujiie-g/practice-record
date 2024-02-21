'use server';

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_noStore as noStore} from 'next/cache';
import { PracticeRecord } from '@/app/api/definitions'
import { Erica_One } from 'next/font/google';

const prisma = new PrismaClient();

// 練習記録を登録するAPI
export async function createRecord(recordData: PracticeRecord) {
  try {
    const newRecord = await prisma.record.create({
      data: {
        // 他の Record フィールド
        description: recordData.description,
        date: recordData.date,
        startTime: recordData.startTime,
        startMinute: recordData.startMinute,
        endTime: recordData.endTime,
        endMinute: recordData.endMinute,
        practiceDetails: {
          create: recordData.practiceDetails.map(detail => ({
            content: detail.content,
            practiceTags: {
              create: detail.tags.map(tagName => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: { name: tagName },
                  },
                },
              })),
            },
          })),
        },
      },
    });
    console.log('create record success');
  } catch (error) {
    console.log(error);
  }
}

// 練習記録を全て取得するAPI
export async function getAllRecords() {
  try {
    const records = await prisma.record.findMany({
      include: {
        practiceDetails: {
          include: {
            practiceTags: true,
          },
        },
      },
    });
    console.log('get all records success');
    return records;
  } catch (error) {
    console.error('Error fetching records:', error);
    throw error;
  }
}

// 特定の月の練習記録を取得するAPI
export async function getRecordsByMonth(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  try {
    const records = await prisma.record.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        practiceDetails: {
          include: {
            practiceTags: true,
          },
        },
      },
    });
    return records;
  } catch (error) {
    console.error('Error fetching records by month:', error);
    throw error;
  }
}

// 特定のIDの練習記録を取得するAPI
export async function getRecordById(id: number) {
  try {
    const record = await prisma.record.findUnique({
      where: {
        id: id,
      },
      include: {
        practiceDetails: {
          include: {
            practiceTags: {
              include: {
                tag: true, // `tag` プロパティを含めるように変更
              },
            },
          },
        },
      },
    });
    if (!record) {
      throw new Error('Record not found');
    }
    console.log('get record by id success');
    return record;
  } catch (error) {
    console.error('Error fetching record by id:', error);
    throw error;
  }
}