import type { HskLevel } from "../types";
import { generatedSentences, generatedWords } from "./generated-hsk";

export const HSK_LEVELS: HskLevel[] = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"];

export const words = generatedWords;

export const sentences = generatedSentences;

export function getWordsByLevel(level: HskLevel) {
  return words.filter((word) => word.level === level);
}

export function getSentencesByLevel(level: HskLevel) {
  return sentences.filter((sentence) => sentence.level === level);
}
