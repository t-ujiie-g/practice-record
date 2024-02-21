export type Record = {
  id: number;
  description: string | null;
  date: Date;
  startTime: string | null;
  startMinute: string | null;
  endTime: string | null;
  endMinute: string | null;
  practiceDetails: {
    id: number;
    recordId: number;
    content: string;
    practiceTags: {
      practiceDetailId: number;
      tagId: number;
      tag: { // この部分を追加
        id: number;
        name: string;
      }
    }[];
  }[];
};

export type RecordDetail = {
  practiceDetails: ({
    practiceTags: {
      practiceDetailId: number;
      tagId: number;
      tag: { // この部分を追加
        id: number;
        name: string;
      }
    }[];
  } & {
    id: number;
    recordId: number;
    content: string;
  })[];
} & {
  id: number;
  description: string | null;
  date: Date;
  startTime: string | null;
  startMinute: string | null;
  endTime: string | null;
  endMinute: string | null;
};