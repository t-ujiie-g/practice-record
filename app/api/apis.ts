'use server';

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_noStore as noStore} from 'next/cache';
import { record } from '@/app/api/definitions'
import { Erica_One } from 'next/font/google';

const prisma = new PrismaClient();

// タグを登録するAPI
export async function createTag(name: string) {
  noStore();

  try {
    const newTag = await prisma.tag.create({
      data: {
        name,
      },
    });
    console.log('create tag success');
  } catch (error) {
    console.log(error);
  }
}

// 練習記録を登録するAPI
export async function createRecord(recordData: record) {

  try {
    const newRecord = await prisma.record.create({
      data: recordData,
    });
    console.log('create record success');
  } catch (error) {
    console.log(error);
  }
}