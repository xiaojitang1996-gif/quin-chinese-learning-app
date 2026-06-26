import { Volume2 } from "lucide-react";
import { speakChinese } from "../lib/speech";

const chinesePattern = /[\u3400-\u9fff]/;

export function SpeakButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      className="speak-button"
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        speakChinese(text);
      }}
    >
      <Volume2 size={17} />
      <span>{label}</span>
    </button>
  );
}

export function SpeakableText({ text }: { text: string }) {
  return (
    <span className="speakable-text" aria-label={text}>
      {Array.from(text).map((char, index) => {
        if (!chinesePattern.test(char)) {
          return <span key={`${char}-${index}`}>{char}</span>;
        }

        return (
          <button
            className="speakable-char"
            key={`${char}-${index}`}
            type="button"
            aria-label={char}
            onClick={(event) => {
              event.stopPropagation();
              speakChinese(char);
            }}
          >
            {char}
          </button>
        );
      })}
    </span>
  );
}

