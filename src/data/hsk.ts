import type { HskLevel } from "../types";
import { generatedWords } from "./generated-hsk";
import { tatoebaSentences } from "./tatoeba-sentences";

export const HSK_LEVELS: HskLevel[] = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"];

export const words = generatedWords;

export const sentences = tatoebaSentences;

export function getWordsByLevel(level: HskLevel) {
  return words.filter((word) => word.level === level);
}

export function getSentencesByLevel(level: HskLevel) {
  return sentences.filter((sentence) => sentence.level === level);
}
