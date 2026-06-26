import type { SentenceItem, WordItem } from "../types";

type VocabularyExample = Pick<WordItem, "example" | "examplePinyin" | "exampleVietnamese">;

const curatedExamples: Record<string, VocabularyExample> = {
  "爱": {
    example: "我爱我的家。",
    examplePinyin: "wǒ ài wǒ de jiā.",
    exampleVietnamese: "Tôi yêu gia đình của tôi."
  },
  "八": {
    example: "现在是八点。",
    examplePinyin: "xiàn zài shì bā diǎn.",
    exampleVietnamese: "Bây giờ là tám giờ."
  },
  "爸爸": {
    example: "我爸爸在家。",
    examplePinyin: "wǒ bà ba zài jiā.",
    exampleVietnamese: "Bố tôi đang ở nhà."
  },
  "杯子": {
    example: "这个杯子是我的。",
    examplePinyin: "zhè ge bēi zi shì wǒ de.",
    exampleVietnamese: "Cái cốc này là của tôi."
  },
  "北京": {
    example: "我明天去北京。",
    examplePinyin: "wǒ míng tiān qù běi jīng.",
    exampleVietnamese: "Ngày mai tôi đi Bắc Kinh."
  },
  "本": {
    example: "这本书很好看。",
    examplePinyin: "zhè běn shū hěn hǎo kàn.",
    exampleVietnamese: "Quyển sách này rất hay."
  },
  "不客气": {
    example: "不用客气，这是我应该做的。",
    examplePinyin: "bú yòng kè qi, zhè shì wǒ yīng gāi zuò de.",
    exampleVietnamese: "Không cần khách sáo, đây là việc tôi nên làm."
  },
  "不": {
    example: "我今天不去学校。",
    examplePinyin: "wǒ jīn tiān bú qù xué xiào.",
    exampleVietnamese: "Hôm nay tôi không đi học."
  },
  "菜": {
    example: "这个菜很好吃。",
    examplePinyin: "zhè ge cài hěn hǎo chī.",
    exampleVietnamese: "Món này rất ngon."
  },
  "茶": {
    example: "我想喝一杯茶。",
    examplePinyin: "wǒ xiǎng hē yì bēi chá.",
    exampleVietnamese: "Tôi muốn uống một tách trà."
  },
  "吃": {
    example: "我们一起吃饭吧。",
    examplePinyin: "wǒ men yì qǐ chī fàn ba.",
    exampleVietnamese: "Chúng ta cùng ăn cơm nhé."
  },
  "出租车": {
    example: "我坐出租车去机场。",
    examplePinyin: "wǒ zuò chū zū chē qù jī chǎng.",
    exampleVietnamese: "Tôi đi taxi đến sân bay."
  },
  "打电话": {
    example: "我晚上给你打电话。",
    examplePinyin: "wǒ wǎn shang gěi nǐ dǎ diàn huà.",
    exampleVietnamese: "Tối tôi gọi điện cho bạn."
  },
  "大": {
    example: "这个房间很大。",
    examplePinyin: "zhè ge fáng jiān hěn dà.",
    exampleVietnamese: "Căn phòng này rất lớn."
  },
  "电脑": {
    example: "我的电脑在桌子上。",
    examplePinyin: "wǒ de diàn nǎo zài zhuō zi shàng.",
    exampleVietnamese: "Máy tính của tôi ở trên bàn."
  },
  "电视": {
    example: "我晚上看电视。",
    examplePinyin: "wǒ wǎn shang kàn diàn shì.",
    exampleVietnamese: "Buổi tối tôi xem tivi."
  },
  "电影": {
    example: "这部电影很好看。",
    examplePinyin: "zhè bù diàn yǐng hěn hǎo kàn.",
    exampleVietnamese: "Bộ phim này rất hay."
  },
  "汉语": {
    example: "她正在学习汉语。",
    examplePinyin: "tā zhèng zài xué xí hàn yǔ.",
    exampleVietnamese: "Cô ấy đang học tiếng Trung."
  },
  "你": {
    example: "你今天忙吗？",
    examplePinyin: "nǐ jīn tiān máng ma?",
    exampleVietnamese: "Hôm nay bạn có bận không?"
  },
  "我": {
    example: "我现在在家。",
    examplePinyin: "wǒ xiàn zài zài jiā.",
    exampleVietnamese: "Bây giờ tôi đang ở nhà."
  },
  "谢谢": {
    example: "谢谢你的帮助。",
    examplePinyin: "xiè xie nǐ de bāng zhù.",
    exampleVietnamese: "Cảm ơn sự giúp đỡ của bạn."
  },
  "再见": {
    example: "我们明天见，再见！",
    examplePinyin: "wǒ men míng tiān jiàn, zài jiàn!",
    exampleVietnamese: "Ngày mai gặp lại, tạm biệt!"
  }
};

function isGoodMatch(word: WordItem, sentence: SentenceItem) {
  if (!sentence.chinese.includes(word.hanzi)) return false;
  const length = sentence.chinese.match(/[\u3400-\u9fff]/g)?.length ?? sentence.chinese.length;
  return length >= Math.max(3, word.hanzi.length) && length <= 32;
}

function scoreSentence(word: WordItem, sentence: SentenceItem) {
  const sameLevel = sentence.level === word.level ? 100 : 0;
  const keywordHit = sentence.keywords.some((keyword) => keyword.includes(word.hanzi) || word.hanzi.includes(keyword)) ? 30 : 0;
  const length = sentence.chinese.match(/[\u3400-\u9fff]/g)?.length ?? sentence.chinese.length;
  return sameLevel + keywordHit + Math.max(0, 30 - length);
}

function fallbackExample(word: WordItem): VocabularyExample {
  const meaning = word.vietnamese.replace(/^EN:\s*/, "");
  if (word.hanzi.length === 1) {
    return {
      example: `这个字在日常中文里很常见：${word.hanzi}。`,
      examplePinyin: `zhè ge zì zài rì cháng zhōng wén lǐ hěn cháng jiàn: ${word.pinyin}.`,
      exampleVietnamese: `Chữ này rất thường gặp trong tiếng Trung hằng ngày: ${meaning}.`
    };
  }

  return {
    example: `我在句子里看到了“${word.hanzi}”。`,
    examplePinyin: `wǒ zài jù zi lǐ kàn dào le "${word.pinyin}".`,
    exampleVietnamese: `Tôi đã thấy "${meaning}" trong câu.`
  };
}

export function getVocabularyExample(word: WordItem, sentences: SentenceItem[]): VocabularyExample {
  const matched = sentences
    .filter((sentence) => isGoodMatch(word, sentence))
    .sort((a, b) => scoreSentence(word, b) - scoreSentence(word, a))[0];

  if (matched) {
    return {
      example: matched.chinese,
      examplePinyin: matched.pinyin,
      exampleVietnamese: matched.vietnamese
    };
  }

  return curatedExamples[word.hanzi] ?? fallbackExample(word);
}

