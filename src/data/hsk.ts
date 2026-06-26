import type { HskLevel, SentenceItem, WordItem } from "../types";

export const HSK_LEVELS: HskLevel[] = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"];

export const words: WordItem[] = [
  {
    id: "hsk1-ni",
    level: "HSK1",
    hanzi: "你",
    pinyin: "nǐ",
    vietnamese: "bạn / anh / em",
    example: "你好。",
    examplePinyin: "Nǐ hǎo.",
    exampleVietnamese: "Xin chào."
  },
  {
    id: "hsk1-hao",
    level: "HSK1",
    hanzi: "好",
    pinyin: "hǎo",
    vietnamese: "tốt / khỏe",
    example: "我很好。",
    examplePinyin: "Wǒ hěn hǎo.",
    exampleVietnamese: "Tôi rất khỏe."
  },
  {
    id: "hsk1-wo",
    level: "HSK1",
    hanzi: "我",
    pinyin: "wǒ",
    vietnamese: "tôi / mình",
    example: "我是学生。",
    examplePinyin: "Wǒ shì xuésheng.",
    exampleVietnamese: "Tôi là học sinh."
  },
  {
    id: "hsk1-ai",
    level: "HSK1",
    hanzi: "爱",
    pinyin: "ài",
    vietnamese: "yêu / thích",
    example: "我爱中文。",
    examplePinyin: "Wǒ ài Zhōngwén.",
    exampleVietnamese: "Tôi yêu tiếng Trung."
  },
  {
    id: "hsk1-xue",
    level: "HSK1",
    hanzi: "学",
    pinyin: "xué",
    vietnamese: "học",
    example: "她学汉语。",
    examplePinyin: "Tā xué Hànyǔ.",
    exampleVietnamese: "Cô ấy học tiếng Hán."
  },
  {
    id: "hsk2-mang",
    level: "HSK2",
    hanzi: "忙",
    pinyin: "máng",
    vietnamese: "bận",
    example: "今天我很忙。",
    examplePinyin: "Jīntiān wǒ hěn máng.",
    exampleVietnamese: "Hôm nay tôi rất bận."
  },
  {
    id: "hsk2-kuai",
    level: "HSK2",
    hanzi: "快",
    pinyin: "kuài",
    vietnamese: "nhanh / sắp",
    example: "他跑得很快。",
    examplePinyin: "Tā pǎo de hěn kuài.",
    exampleVietnamese: "Anh ấy chạy rất nhanh."
  },
  {
    id: "hsk2-yuan",
    level: "HSK2",
    hanzi: "远",
    pinyin: "yuǎn",
    vietnamese: "xa",
    example: "学校不远。",
    examplePinyin: "Xuéxiào bù yuǎn.",
    exampleVietnamese: "Trường học không xa."
  },
  {
    id: "hsk3-zhunbei",
    level: "HSK3",
    hanzi: "准备",
    pinyin: "zhǔnbèi",
    vietnamese: "chuẩn bị",
    example: "我准备考试。",
    examplePinyin: "Wǒ zhǔnbèi kǎoshì.",
    exampleVietnamese: "Tôi chuẩn bị thi."
  },
  {
    id: "hsk3-jiankang",
    level: "HSK3",
    hanzi: "健康",
    pinyin: "jiànkāng",
    vietnamese: "sức khỏe / khỏe mạnh",
    example: "运动对健康很好。",
    examplePinyin: "Yùndòng duì jiànkāng hěn hǎo.",
    exampleVietnamese: "Vận động rất tốt cho sức khỏe."
  },
  {
    id: "hsk4-jingyan",
    level: "HSK4",
    hanzi: "经验",
    pinyin: "jīngyàn",
    vietnamese: "kinh nghiệm",
    example: "她有很多工作经验。",
    examplePinyin: "Tā yǒu hěn duō gōngzuò jīngyàn.",
    exampleVietnamese: "Cô ấy có nhiều kinh nghiệm làm việc."
  },
  {
    id: "hsk4-wuran",
    level: "HSK4",
    hanzi: "污染",
    pinyin: "wūrǎn",
    vietnamese: "ô nhiễm",
    example: "空气污染越来越严重。",
    examplePinyin: "Kōngqì wūrǎn yuè lái yuè yánzhòng.",
    exampleVietnamese: "Ô nhiễm không khí ngày càng nghiêm trọng."
  },
  {
    id: "hsk5-zeren",
    level: "HSK5",
    hanzi: "责任",
    pinyin: "zérèn",
    vietnamese: "trách nhiệm",
    example: "这是我们的责任。",
    examplePinyin: "Zhè shì wǒmen de zérèn.",
    exampleVietnamese: "Đây là trách nhiệm của chúng ta."
  },
  {
    id: "hsk5-xiaolv",
    level: "HSK5",
    hanzi: "效率",
    pinyin: "xiàolǜ",
    vietnamese: "hiệu suất",
    example: "这个方法提高了效率。",
    examplePinyin: "Zhège fāngfǎ tígāo le xiàolǜ.",
    exampleVietnamese: "Phương pháp này đã nâng cao hiệu suất."
  },
  {
    id: "hsk6-chouxiang",
    level: "HSK6",
    hanzi: "抽象",
    pinyin: "chōuxiàng",
    vietnamese: "trừu tượng",
    example: "这个概念比较抽象。",
    examplePinyin: "Zhège gàiniàn bǐjiào chōuxiàng.",
    exampleVietnamese: "Khái niệm này khá trừu tượng."
  },
  {
    id: "hsk6-tixi",
    level: "HSK6",
    hanzi: "体系",
    pinyin: "tǐxì",
    vietnamese: "hệ thống / thể hệ",
    example: "我们需要建立完整的学习体系。",
    examplePinyin: "Wǒmen xūyào jiànlì wánzhěng de xuéxí tǐxì.",
    exampleVietnamese: "Chúng ta cần xây dựng một hệ thống học tập hoàn chỉnh."
  }
];

export const sentences: SentenceItem[] = [
  {
    id: "s-hsk1-hello",
    level: "HSK1",
    chinese: "你好，我叫 QUIN。",
    pinyin: "Nǐ hǎo, wǒ jiào QUIN.",
    vietnamese: "Xin chào, tôi tên là QUIN.",
    keywords: ["你", "好", "我"]
  },
  {
    id: "s-hsk1-study",
    level: "HSK1",
    chinese: "我喜欢学汉语。",
    pinyin: "Wǒ xǐhuan xué Hànyǔ.",
    vietnamese: "Tôi thích học tiếng Hán.",
    keywords: ["我", "学", "汉语"]
  },
  {
    id: "s-hsk2-time",
    level: "HSK2",
    chinese: "今天下午你忙吗？",
    pinyin: "Jīntiān xiàwǔ nǐ máng ma?",
    vietnamese: "Chiều nay bạn có bận không?",
    keywords: ["今天", "下午", "忙"]
  },
  {
    id: "s-hsk3-exam",
    level: "HSK3",
    chinese: "她正在准备汉语考试。",
    pinyin: "Tā zhèngzài zhǔnbèi Hànyǔ kǎoshì.",
    vietnamese: "Cô ấy đang chuẩn bị cho kỳ thi tiếng Hán.",
    keywords: ["准备", "考试"]
  },
  {
    id: "s-hsk4-life",
    level: "HSK4",
    chinese: "学习语言需要坚持和经验。",
    pinyin: "Xuéxí yǔyán xūyào jiānchí hé jīngyàn.",
    vietnamese: "Học ngôn ngữ cần sự kiên trì và kinh nghiệm.",
    keywords: ["语言", "坚持", "经验"]
  },
  {
    id: "s-hsk5-work",
    level: "HSK5",
    chinese: "提高效率也是一种责任。",
    pinyin: "Tígāo xiàolǜ yě shì yì zhǒng zérèn.",
    vietnamese: "Nâng cao hiệu suất cũng là một loại trách nhiệm.",
    keywords: ["效率", "责任"]
  },
  {
    id: "s-hsk6-system",
    level: "HSK6",
    chinese: "完整的体系可以帮助你理解抽象概念。",
    pinyin: "Wánzhěng de tǐxì kěyǐ bāngzhù nǐ lǐjiě chōuxiàng gàiniàn.",
    vietnamese: "Một hệ thống hoàn chỉnh có thể giúp bạn hiểu các khái niệm trừu tượng.",
    keywords: ["体系", "抽象", "概念"]
  }
];

export function getWordsByLevel(level: HskLevel) {
  return words.filter((word) => word.level === level);
}

export function getSentencesByLevel(level: HskLevel) {
  return sentences.filter((sentence) => sentence.level === level);
}
