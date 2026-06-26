import { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import type { TranslationKey } from "../i18n/translations";
import { Button } from "./ui";

type Props = {
  character: string;
  onComplete: () => void;
  t: (key: TranslationKey) => string;
};

export function CharacterWriter({ character, onComplete, t }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const onCompleteRef = useRef(onComplete);
  const [strokeCount, setStrokeCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!hostRef.current) return;
    hostRef.current.innerHTML = "";
    const writer = HanziWriter.create(hostRef.current, character[0], {
      width: 260,
      height: 260,
      padding: 14,
      showOutline: true,
      showCharacter: false,
      outlineColor: "#ddc8c3",
      strokeColor: "#2f2423",
      highlightColor: "#e56f61",
      drawingColor: "#2f2423",
      strokeAnimationSpeed: 1.1,
      delayBetweenStrokes: 260
    });
    writerRef.current = writer;
    setStrokeCount(0);
    setDone(false);
    writer.quiz({
      showHintAfterMisses: 1,
      highlightOnComplete: true,
      onCorrectStroke: () => setStrokeCount((count) => count + 1),
      onComplete: () => {
        setDone(true);
        onCompleteRef.current();
      }
    });
    return () => writer.cancelQuiz();
  }, [character]);

  function restartQuiz() {
    const writer = writerRef.current;
    if (!writer) return;
    writer.cancelQuiz();
    writer.hideCharacter();
    writer.showOutline();
    setStrokeCount(0);
    setDone(false);
    writer.quiz({
      showHintAfterMisses: 1,
      highlightOnComplete: true,
      onCorrectStroke: () => setStrokeCount((count) => count + 1),
      onComplete: () => {
        setDone(true);
        onCompleteRef.current();
      }
    });
  }

  async function animate() {
    const writer = writerRef.current;
    if (!writer) return;
    writer.cancelQuiz();
    await writer.animateCharacter();
    restartQuiz();
  }

  return (
    <div className="writer-shell">
      <div className="writer-stage" ref={hostRef} aria-label={`${character} writing canvas`} />
      <div className="writer-meta">
        <span>{t("practiceHint")}</span>
        <strong>{done ? t("correct") : `${strokeCount}`}</strong>
      </div>
      <div className="button-row">
        <Button type="button" onClick={restartQuiz}>{t("rewrite")}</Button>
        <Button type="button" variant="primary" onClick={animate}>{t("animateStroke")}</Button>
      </div>
    </div>
  );
}
