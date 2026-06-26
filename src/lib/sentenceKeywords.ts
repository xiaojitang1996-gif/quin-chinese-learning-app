import type { HskLevel, WordItem } from "../types";

const levelRank: Record<HskLevel, number> = {
  HSK1: 1,
  HSK2: 2,
  HSK3: 3,
  HSK4: 4,
  HSK5: 5,
  HSK6: 6
};

type Candidate = {
  hanzi: string;
  start: number;
  end: number;
  level: HskLevel;
};

function isChineseWord(text: string) {
  return /^[\u3400-\u9fff]+$/.test(text);
}

function findAllIndexes(text: string, search: string) {
  const indexes: number[] = [];
  let start = text.indexOf(search);
  while (start >= 0) {
    indexes.push(start);
    start = text.indexOf(search, start + 1);
  }
  return indexes;
}

function overlaps(a: Candidate, b: Candidate) {
  return a.start < b.end && b.start < a.end;
}

export function getSentenceKeywords(sentence: string, sentenceLevel: HskLevel, words: WordItem[]) {
  const candidates = words
    .filter((word) => word.hanzi.length <= 6 && isChineseWord(word.hanzi) && sentence.includes(word.hanzi))
    .flatMap((word) =>
      findAllIndexes(sentence, word.hanzi).map((start) => ({
        hanzi: word.hanzi,
        start,
        end: start + word.hanzi.length,
        level: word.level
      }))
    )
    .sort((a, b) => {
      const lengthGap = b.hanzi.length - a.hanzi.length;
      if (lengthGap) return lengthGap;
      const levelGap = Math.abs(levelRank[a.level] - levelRank[sentenceLevel]) - Math.abs(levelRank[b.level] - levelRank[sentenceLevel]);
      if (levelGap) return levelGap;
      return a.start - b.start;
    });

  const selected: Candidate[] = [];
  for (const candidate of candidates) {
    if (selected.some((item) => item.hanzi === candidate.hanzi || overlaps(item, candidate))) continue;
    selected.push(candidate);
  }

  const ordered = selected.sort((a, b) => a.start - b.start);
  const phrases = ordered.filter((item) => item.hanzi.length > 1);

  return phrases.slice(0, 8).map((item) => item.hanzi);
}
