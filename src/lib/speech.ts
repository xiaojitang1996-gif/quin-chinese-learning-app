function voiceText(voice: SpeechSynthesisVoice) {
  return `${voice.lang} ${voice.name}`.toLowerCase();
}

function isCantoneseVoice(voice: SpeechSynthesisVoice) {
  const value = voiceText(voice);
  return (
    value.includes("zh-hk") ||
    value.includes("zh-mo") ||
    value.includes("yue") ||
    value.includes("cantonese") ||
    value.includes("hong kong") ||
    value.includes("sin-ji") ||
    value.includes("sinji")
  );
}

function mandarinScore(voice: SpeechSynthesisVoice) {
  if (isCantoneseVoice(voice)) return -1;

  const value = voiceText(voice);
  let score = 0;
  if (value.includes("zh-cn")) score += 100;
  if (value.includes("cmn-cn")) score += 100;
  if (value.includes("zh-hans")) score += 80;
  if (value.includes("mandarin")) score += 70;
  if (value.includes("putonghua")) score += 70;
  if (value.includes("普通话") || value.includes("普通話")) score += 70;
  if (value.includes("china") || value.includes("mainland")) score += 40;
  if (value.includes("tingting")) score += 35;
  if (value.includes("zh-tw")) score += 10;
  if (value.includes("zh")) score += 5;
  return score;
}

export function selectMandarinVoice(voices: SpeechSynthesisVoice[]) {
  return voices
    .map((voice) => ({ voice, score: mandarinScore(voice) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)[0]?.voice;
}

export function speakChinese(text: string) {
  const cleanText = text.trim();
  if (!cleanText || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  const voice = selectMandarinVoice(window.speechSynthesis.getVoices());

  if (voice) utterance.voice = voice;
  utterance.lang = "zh-CN";
  utterance.rate = cleanText.length > 1 ? 0.82 : 0.72;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}
