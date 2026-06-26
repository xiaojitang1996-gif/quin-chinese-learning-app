declare module "hanzi-writer" {
  type WriterOptions = {
    width?: number;
    height?: number;
    padding?: number;
    showOutline?: boolean;
    showCharacter?: boolean;
    strokeAnimationSpeed?: number;
    delayBetweenStrokes?: number;
    radicalColor?: string;
    outlineColor?: string;
    drawingColor?: string;
    strokeColor?: string;
    highlightColor?: string;
  };

  type QuizOptions = {
    onComplete?: (summary: { totalMistakes: number }) => void;
    onCorrectStroke?: () => void;
    showHintAfterMisses?: number;
    highlightOnComplete?: boolean;
  };

  export default class HanziWriter {
    static create(element: string | HTMLElement, character: string, options?: WriterOptions): HanziWriter;
    animateCharacter(): Promise<void>;
    quiz(options?: QuizOptions): void;
    hideCharacter(): void;
    showOutline(): void;
    setCharacter(character: string): Promise<void>;
    cancelQuiz(): void;
  }
}
