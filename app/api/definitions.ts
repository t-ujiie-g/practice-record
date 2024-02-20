export interface PracticeDetail {
    content: string;
    tags: string[];
  }

export interface PracticeRecord {
    description: string;
    date: Date;
    startTime: string;
    startMinute: string;
    endTime: string;
    endMinute: string;
    practiceDetails: PracticeDetail[];
  }