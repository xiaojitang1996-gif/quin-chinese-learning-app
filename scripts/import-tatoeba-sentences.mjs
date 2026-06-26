import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { execFileSync } from "node:child_process";
import OpenCC from "opencc-js";
import { pinyin } from "pinyin-pro";

const cacheDir = ".cache/tatoeba";
const cmnUrl = "https://downloads.tatoeba.org/exports/per_language/cmn/cmn_sentences.tsv.bz2";
const vieUrl = "https://downloads.tatoeba.org/exports/per_language/vie/vie_sentences.tsv.bz2";
const linksUrl = "https://downloads.tatoeba.org/exports/links.tar.bz2";
const toSimplified = OpenCC.Converter({ from: "tw", to: "cn" });

mkdirSync(cacheDir, { recursive: true });

async function download(url, file) {
  if (existsSync(file)) return;
  const response = await fetch(url);
  if (!response.ok || !response.body) throw new Error(`Failed to download ${url}`);
  await pipeline(response.body, createWriteStream(file));
}

function bunzip(file) {
  const output = file.replace(/\.bz2$/, "");
  if (existsSync(output)) return output;
  execFileSync("bunzip2", ["-k", file], { stdio: "inherit" });
  return output;
}

function parseSentenceFile(file) {
  const map = new Map();
  const text = readFileSync(file, "utf8");
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    const [id, lang, sentence] = line.split("\t");
    if (id && sentence) map.set(id, sentence.trim());
  }
  return map;
}

function stripTarToLinks(tarPath) {
  const out = `${cacheDir}/links.csv`;
  if (existsSync(out)) return out;
  execFileSync("tar", ["-xjf", tarPath, "-C", cacheDir], { stdio: "inherit" });
  return out;
}

function normalizeChinese(sentence) {
  return toSimplified(sentence)
    .replace(/什幺/g, "什么")
    .replace(/甚幺/g, "什么")
    .replace(/怎幺/g, "怎么")
    .replace(/这幺/g, "这么")
    .replace(/那幺/g, "那么")
    .replace(/多幺/g, "多么")
    .replace(/[「」]/g, "\"")
    .replace(/[『』]/g, "'")
    .replace(/\s+/g, "")
    .trim();
}

function chineseLength(sentence) {
  return sentence.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
}

function isUsefulChinese(sentence) {
  const length = chineseLength(sentence);
  return /[\u4e00-\u9fff]/.test(sentence) && !/[A-Za-z0-9幺]/.test(sentence) && length >= 4 && length <= 36;
}

function levelForLength(length) {
  if (length <= 7) return "HSK1";
  if (length <= 10) return "HSK2";
  if (length <= 14) return "HSK3";
  if (length <= 18) return "HSK4";
  if (length <= 24) return "HSK5";
  return "HSK6";
}

function keywords(sentence) {
  const matches = sentence.match(/[\u4e00-\u9fff]{1,3}/g) ?? [];
  return Array.from(new Set(matches)).slice(0, 4);
}

await download(cmnUrl, `${cacheDir}/cmn_sentences.tsv.bz2`);
await download(vieUrl, `${cacheDir}/vie_sentences.tsv.bz2`);
await download(linksUrl, `${cacheDir}/links.tar.bz2`);

const cmnFile = bunzip(`${cacheDir}/cmn_sentences.tsv.bz2`);
const vieFile = bunzip(`${cacheDir}/vie_sentences.tsv.bz2`);
const linksFile = stripTarToLinks(`${cacheDir}/links.tar.bz2`);

const cmn = parseSentenceFile(cmnFile);
const vie = parseSentenceFile(vieFile);
const byLevel = new Map([["HSK1", []], ["HSK2", []], ["HSK3", []], ["HSK4", []], ["HSK5", []], ["HSK6", []]]);

const linksText = readFileSync(linksFile, "utf8");
for (const line of linksText.split("\n")) {
  const [a, b] = line.split("\t");
  if (!a || !b) continue;

  const rawChinese = cmn.get(a) ?? cmn.get(b);
  const vietnamese = vie.get(a) ?? vie.get(b);
  if (!rawChinese || !vietnamese) continue;

  const chinese = normalizeChinese(rawChinese);
  if (!isUsefulChinese(chinese)) continue;

  const level = levelForLength(chineseLength(chinese));
  const bucket = byLevel.get(level);
  if (!bucket || bucket.length >= 120) continue;
  if (bucket.some((item) => item.chinese === chinese)) continue;

  bucket.push({
    id: `tatoeba-${level.toLowerCase()}-${a}-${b}`,
    level,
    chinese,
    pinyin: pinyin(chinese, { toneType: "symbol", type: "array" }).join(" "),
    vietnamese,
    keywords: keywords(chinese),
    source: "Tatoeba"
  });

  if ([...byLevel.values()].every((items) => items.length >= 120)) break;
}

const all = [...byLevel.values()].flat();
const output = `import type { SentenceItem } from "../types";

// Real Chinese-Vietnamese sentence pairs selected from Tatoeba exports.
// Tatoeba sentences are licensed under CC BY 2.0: https://tatoeba.org/
const tatoebaSentenceJson = ${JSON.stringify(JSON.stringify(all))};

export const tatoebaSentences = JSON.parse(tatoebaSentenceJson) as SentenceItem[];
`;

writeFileSync("src/data/tatoeba-sentences.ts", output);
console.log(`Generated ${all.length} Tatoeba Chinese-Vietnamese sentence pairs.`);
for (const [level, items] of byLevel) console.log(`${level}: ${items.length}`);
