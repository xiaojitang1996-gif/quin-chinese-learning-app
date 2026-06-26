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

console.log("Learning experience checks passed");
