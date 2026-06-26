export function speakChinese(text: string) {
  const cleanText = text.trim();
  if (!cleanText || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  const voice = window.speechSynthesis
    .getVoices()
    .find((item) => item.lang.toLowerCase().startsWith("zh"));

  if (voice) utterance.voice = voice;
  utterance.lang = "zh-CN";
  utterance.rate = cleanText.length > 1 ? 0.82 : 0.72;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

