import type { AppLanguage, HskLevel, StudyProgress } from "../types";
import { HSK_LEVELS } from "../data/hsk";

const STORAGE_KEY = "quin-chinese-progress-v1";

export const defaultProgress: StudyProgress = {
  language: "vi",
  selectedLevel: "HSK1",
  masteredWordIds: [],
  reviewWordIds: [],
  levelProgress: {
    HSK1: 0,
    HSK2: 0,
    HSK3: 0,
    HSK4: 0,
    HSK5: 0,
    HSK6: 0
  },
  recognitionStats: {},
  writingStats: {}
};

function normalizeProgress(value: Partial<StudyProgress>): StudyProgress {
  return {
    ...defaultProgress,
    ...value,
    levelProgress: { ...defaultProgress.levelProgress, ...value.levelProgress },
    recognitionStats: value.recognitionStats ?? {},
    writingStats: value.writingStats ?? {}
  };
}

export function loadProgress(): StudyProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeProgress(JSON.parse(raw) as Partial<StudyProgress>) : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: StudyProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function clearProgress(keepLanguage: AppLanguage): StudyProgress {
  const fresh = { ...defaultProgress, language: keepLanguage };
  saveProgress(fresh);
  return fresh;
}

export function clampLevel(level: string): HskLevel {
  return HSK_LEVELS.includes(level as HskLevel) ? (level as HskLevel) : "HSK1";
}
