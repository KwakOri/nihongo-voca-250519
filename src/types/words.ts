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
  word_logs: DBWordLog[];
  word_memory_logs: DBWordMemoryLog[];
}

export interface DBQuiz {
  id: number;
  type: string;
  selects: string;
  word_id: number;
  created_at: Date;
}

export interface DBWordLog {
  id: string; // UUID
  user_id: string; // UUID (로그인 유저 ID)
  word_id: number; // 단어 ID
  quiz_type: number; // 퀴즈 유형 (예: 1~4)
  is_correct: boolean; // 정답 여부
  attempted_at: string; // ISO timestamp (예: "2025-05-26T09:00:00.000Z")
}

export interface DBWordMemoryLog {
  id: string; // UUID
  user_id: string; // UUID (로그인 유저 ID)
  word_id: number; // 단어 ID
  is_checked: boolean; // 암기 여부
}
