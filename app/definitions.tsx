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
    tags: { // 修正: practiceTags から tags へ
      id: number; // tag の id
      name: string; // tag の name
    }[];
  }[];
};

export type RecordDetail = {
  practiceDetails: ({
    tags: { // 修正: practiceTags から tags へ
      id: number; // tag の id
      name: string; // tag の name
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