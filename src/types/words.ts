export interface DBWord {
  id: number;
  word: string;
  meaning: string;
  level: number;
  pronunciation: string;
  part: string;
  day: number;
  tokens: string;
}

export interface DBWordWithQuiz extends DBWord {
  quiz: DBQuiz[];
}

export interface DBQuiz {
  id: number;
  type: string;
  selects: string;
  word_id: number;
  created_at: Date;
}
