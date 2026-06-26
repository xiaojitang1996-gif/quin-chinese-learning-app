export type AppLanguage = "vi" | "zh";

export type HskLevel = "HSK1" | "HSK2" | "HSK3" | "HSK4" | "HSK5" | "HSK6";

export type StudyMode = "vocabulary" | "writing" | "recognition" | "sentences";

export type Page =
  | { name: "home" }
  | { name: "hsk"; level?: HskLevel }
  | { name: "practice"; mode: StudyMode; level: HskLevel }
  | { name: "review" }
  | { name: "settings" };

export type WordItem = {
  id: string;
  level: HskLevel;
  hanzi: string;
  pinyin: string;
  vietnamese: string;
  example: string;
  examplePinyin: string;
  exampleVietnamese: string;
};

export type SentenceItem = {
  id: string;
  level: HskLevel;
  chinese: string;
  pinyin: string;
  vietnamese: string;
  keywords: string[];
};

export type StudyProgress = {
  language: AppLanguage;
  selectedLevel: HskLevel;
  masteredWordIds: string[];
  reviewWordIds: string[];
  levelProgress: Record<HskLevel, number>;
  recognitionStats: Record<string, { correct: number; total: number }>;
  writingStats: Record<string, { practiced: number; completed: number }>;
};
