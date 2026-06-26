import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadTsExports(file) {
  assert(existsSync(file), `${file} does not exist`);
  const source = readFileSync(file, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true
    }
  }).outputText;
  const sandbox = { exports: {}, module: { exports: {} }, require };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(output, sandbox, { filename: file });
  return sandbox.module.exports;
}

const examples = loadTsExports("src/lib/examples.ts");
const shuffle = loadTsExports("src/lib/sessionShuffle.ts");
const sentenceKeywords = loadTsExports("src/lib/sentenceKeywords.ts");

const realSentence = {
  id: "s1",
  level: "HSK1",
  chinese: "我明天去北京。",
  pinyin: "wǒ míng tiān qù běi jīng 。",
  vietnamese: "Ngày mai tôi đi Bắc Kinh.",
  keywords: ["北京"]
};

const matched = examples.getVocabularyExample(
  { hanzi: "北京", pinyin: "Běi jīng", vietnamese: "Bắc Kinh" },
  [realSentence]
);
assert(matched.example === realSentence.chinese, "Vocabulary example should use a real sentence when available");
assert(matched.exampleVietnamese === realSentence.vietnamese, "Matched real sentence should keep Vietnamese translation");

const fallback = examples.getVocabularyExample(
  { hanzi: "杯子", pinyin: "bēi zi", vietnamese: "cái cốc / ly" },
  []
);
assert(!fallback.example.includes("我学习"), "Fallback example must not use dead template 我学习X");
assert(!fallback.example.includes("这个词是"), "Fallback example must not use dictionary-label template");
assert(fallback.example.includes("杯子"), "Fallback example should contain the target word");

const original = ["a", "b", "c", "d", "e", "f"];
const shuffledA = shuffle.shuffleItems(original, "seed-a");
const shuffledB = shuffle.shuffleItems(original, "seed-a");
const shuffledC = shuffle.shuffleItems(original, "seed-b");
assert(JSON.stringify(shuffledA) === JSON.stringify(shuffledB), "Shuffle should be stable for the same seed");
assert(JSON.stringify(shuffledA) !== JSON.stringify(original), "Shuffle should change order for a normal list");
assert(JSON.stringify(shuffledA) !== JSON.stringify(shuffledC), "Different seeds should produce different order");
assert(JSON.stringify(original) === JSON.stringify(["a", "b", "c", "d", "e", "f"]), "Shuffle must not mutate source array");

const keywords = sentenceKeywords.getSentenceKeywords("她很擅长英语教学。", "HSK1", [
  { hanzi: "她", level: "HSK1" },
  { hanzi: "很", level: "HSK1" },
  { hanzi: "擅长", level: "HSK4" },
  { hanzi: "英语", level: "HSK2" },
  { hanzi: "教学", level: "HSK5" },
  { hanzi: "英", level: "HSK1" },
  { hanzi: "语", level: "HSK1" },
  { hanzi: "教", level: "HSK2" }
]);
assert(keywords.includes("擅长"), "Sentence keywords should include complete words");
assert(keywords.includes("英语"), "Sentence keywords should include normal vocabulary words");
assert(!keywords.includes("英") && !keywords.includes("语"), "Sentence keywords should not split a known word into single characters");

const contentKeywords = sentenceKeywords.getSentenceKeywords("他的理论很难懂。", "HSK1", [
  { hanzi: "他", level: "HSK1" },
  { hanzi: "的", level: "HSK1" },
  { hanzi: "理论", level: "HSK4" },
  { hanzi: "很", level: "HSK1" },
  { hanzi: "难", level: "HSK1" },
  { hanzi: "懂", level: "HSK2" }
]);
assert(contentKeywords.includes("理论"), "Sentence keywords should keep complete content words");
assert(!contentKeywords.includes("的") && !contentKeywords.includes("很"), "Sentence keywords should not highlight common function characters");

console.log("Learning experience checks passed");
