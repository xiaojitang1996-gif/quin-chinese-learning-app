import { type CSSProperties, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BookMarked,
  Brain,
  Check,
  ChevronRight,
  Eye,
  Languages,
  PenLine,
  RefreshCcw
} from "lucide-react";
import { BottomNav } from "./components/BottomNav";
import { CharacterWriter } from "./components/CharacterWriter";
import { Button, Card, Stat } from "./components/ui";
import { HSK_LEVELS, getSentencesByLevel, getWordsByLevel, words } from "./data/hsk";
import { createTranslator } from "./i18n/translations";
import { clampLevel, clearProgress, loadProgress, saveProgress } from "./lib/storage";
import type { AppLanguage, HskLevel, Page, StudyMode, StudyProgress, WordItem } from "./types";

const modeConfig: Record<StudyMode, { icon: typeof BookMarked; titleKey: "vocabularyReview" | "characterWriting" | "characterRecognition" | "sentencePractice" }> = {
  vocabulary: { icon: BookMarked, titleKey: "vocabularyReview" },
  writing: { icon: PenLine, titleKey: "characterWriting" },
  recognition: { icon: Eye, titleKey: "characterRecognition" },
  sentences: { icon: Brain, titleKey: "sentencePractice" }
};

function uniq<T>(items: T[]) {
  return Array.from(new Set(items));
}

function percent(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export default function App() {
  const [progress, setProgressState] = useState<StudyProgress>(() => loadProgress());
  const [page, setPage] = useState<Page>({ name: "home" });
  const t = useMemo(() => createTranslator(progress.language), [progress.language]);

  function setProgress(next: StudyProgress | ((current: StudyProgress) => StudyProgress)) {
    setProgressState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      saveProgress(value);
      return value;
    });
  }

  function selectLevel(level: HskLevel) {
    setProgress((current) => ({ ...current, selectedLevel: level }));
  }

  const learnedCount = uniq([...progress.masteredWordIds, ...progress.reviewWordIds]).length;

  return (
    <main className="app-frame">
      <div className="app-bg" />
      <div className="phone-shell">
        <header className="top-bar">
          {page.name !== "home" ? (
            <button className="icon-button" type="button" onClick={() => setPage({ name: "home" })} aria-label="Back home">
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="brand-dot">文</div>
          )}
          <div>
            <p>{progress.selectedLevel}</p>
            <h1><span>QUIN</span> 中文助手</h1>
          </div>
          <button className="language-chip" type="button" onClick={() => setProgress({ ...progress, language: progress.language === "vi" ? "zh" : "vi" })}>
            <Languages size={16} />
            {progress.language === "vi" ? "VI" : "中"}
          </button>
        </header>

        <section className="content">
          {page.name === "home" && (
            <HomePage
              t={t}
              learnedCount={learnedCount}
              progress={progress}
              setPage={setPage}
              selectLevel={selectLevel}
            />
          )}
          {page.name === "hsk" && (
            <HskPage
              level={page.level ?? progress.selectedLevel}
              t={t}
              progress={progress}
              setPage={setPage}
              selectLevel={selectLevel}
            />
          )}
          {page.name === "practice" && (
            <PracticePage
              mode={page.mode}
              level={page.level}
              progress={progress}
              setProgress={setProgress}
              t={t}
              goNextMode={(mode) => setPage({ name: "practice", mode, level: page.level })}
            />
          )}
          {page.name === "review" && (
            <ReviewPage t={t} progress={progress} setPage={setPage} />
          )}
          {page.name === "settings" && (
            <SettingsPage
              t={t}
              progress={progress}
              setProgress={setProgress}
              selectLevel={selectLevel}
            />
          )}
        </section>

        <BottomNav current={page} setPage={setPage} t={t} />
      </div>
    </main>
  );
}

function HomePage({
  t,
  learnedCount,
  progress,
  setPage,
  selectLevel
}: {
  t: ReturnType<typeof createTranslator>;
  learnedCount: number;
  progress: StudyProgress;
  setPage: (page: Page) => void;
  selectLevel: (level: HskLevel) => void;
}) {
  const quickActions: Array<{ mode: StudyMode; key: keyof typeof modeConfig }> = [
    { mode: "vocabulary", key: "vocabulary" },
    { mode: "writing", key: "writing" },
    { mode: "recognition", key: "recognition" },
    { mode: "sentences", key: "sentences" }
  ];

  const completion = Math.min(100, percent(learnedCount + progress.masteredWordIds.length, Math.max(6, words.length)));

  return (
    <div className="stack">
      <Card className="hero-card">
        <div className="hero-heading">
          <p className="soft-label">{t("todayProgress")}</p>
          <h2>{t("appSubtitle")}</h2>
        </div>
        <div className="hero-progress-layout">
          <div className="progress-ring" style={{ "--progress": `${completion}%` } as CSSProperties}>
            <div>
              <strong>{completion}%</strong>
              <span>{t("mastered")}</span>
            </div>
          </div>
          <div className="metric-list">
            <Stat label={t("learned")} value={learnedCount} />
            <Stat label={t("mastered")} value={progress.masteredWordIds.length} />
            <Stat label={t("needsReview")} value={progress.reviewWordIds.length} />
          </div>
        </div>
      </Card>

      <section>
        <SectionTitle title={t("quickStart")} subtitle={t("miniLibrary")} />
        <div className="quick-grid">
          {quickActions.map(({ mode }) => {
            const Icon = modeConfig[mode].icon;
            return (
              <button
                className="action-card"
                key={mode}
                type="button"
                onClick={() => setPage({ name: "practice", mode, level: progress.selectedLevel })}
              >
                <Icon size={22} />
                <span>{t(modeConfig[mode].titleKey)}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle title={t("hskPath")} subtitle={t("chooseLevel")} />
        <div className="level-rail">
          {HSK_LEVELS.map((level) => (
            <button
              className={progress.selectedLevel === level ? "level-card active" : "level-card"}
              key={level}
              type="button"
              onClick={() => {
                selectLevel(level);
                setPage({ name: "hsk", level });
              }}
            >
              <span>{level}</span>
              <small>{getWordsByLevel(level).length} {t("wordsUnit")}</small>
              <strong>{progress.levelProgress[level]}%</strong>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function HskPage({
  level,
  t,
  progress,
  setPage,
  selectLevel
}: {
  level: HskLevel;
  t: ReturnType<typeof createTranslator>;
  progress: StudyProgress;
  setPage: (page: Page) => void;
  selectLevel: (level: HskLevel) => void;
}) {
  return (
    <div className="stack">
      <section className="segmented-levels" aria-label={t("chooseLevel")}>
        {HSK_LEVELS.map((item) => (
          <button
            key={item}
            type="button"
            className={item === level ? "active" : ""}
            onClick={() => {
              selectLevel(item);
              setPage({ name: "hsk", level: item });
            }}
          >
            {item.replace("HSK", "")}
          </button>
        ))}
      </section>

      <Card className="level-hero">
        <p>{t("hskPath")}</p>
        <h2>{level}</h2>
        <p className="level-counts">{getWordsByLevel(level).length} {t("wordsUnit")} · {getSentencesByLevel(level).length} {t("sentencesUnit")}</p>
        <div className="progress-track">
          <span style={{ width: `${progress.levelProgress[level]}%` }} />
        </div>
        <small>{progress.levelProgress[level]}% {t("progress")}</small>
      </Card>

      <div className="mode-list">
        {(Object.keys(modeConfig) as StudyMode[]).map((mode) => {
          const Icon = modeConfig[mode].icon;
          return (
            <button className="mode-row" key={mode} type="button" onClick={() => setPage({ name: "practice", mode, level })}>
              <span className="mode-icon"><Icon size={22} /></span>
              <span>{t(modeConfig[mode].titleKey)}</span>
              <ChevronRight size={20} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PracticePage({
  mode,
  level,
  progress,
  setProgress,
  t,
  goNextMode
}: {
  mode: StudyMode;
  level: HskLevel;
  progress: StudyProgress;
  setProgress: (next: StudyProgress | ((current: StudyProgress) => StudyProgress)) => void;
  t: ReturnType<typeof createTranslator>;
  goNextMode: (mode: StudyMode) => void;
}) {
  const title = t(modeConfig[mode].titleKey);
  return (
    <div className="stack">
      <PracticeTabs active={mode} t={t} onChange={goNextMode} />
      <SectionTitle title={title} subtitle={level} />
      {mode === "vocabulary" && <VocabularyPractice level={level} progress={progress} setProgress={setProgress} t={t} />}
      {mode === "writing" && <WritingPractice level={level} progress={progress} setProgress={setProgress} t={t} />}
      {mode === "recognition" && <RecognitionPractice level={level} progress={progress} setProgress={setProgress} t={t} />}
      {mode === "sentences" && <SentencePractice level={level} t={t} />}
    </div>
  );
}

function PracticeTabs({
  active,
  t,
  onChange
}: {
  active: StudyMode;
  t: ReturnType<typeof createTranslator>;
  onChange: (mode: StudyMode) => void;
}) {
  return (
    <div className="practice-tabs">
      {(Object.keys(modeConfig) as StudyMode[]).map((mode) => (
        <button key={mode} className={active === mode ? "active" : ""} type="button" onClick={() => onChange(mode)}>
          {t(mode === "vocabulary" ? "vocabulary" : mode)}
        </button>
      ))}
    </div>
  );
}

function VocabularyPractice({
  level,
  progress,
  setProgress,
  t
}: {
  level: HskLevel;
  progress: StudyProgress;
  setProgress: (next: StudyProgress | ((current: StudyProgress) => StudyProgress)) => void;
  t: ReturnType<typeof createTranslator>;
}) {
  const items = getWordsByLevel(level);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const item = items[index] ?? items[0];
  const learned = items.filter((word) => progress.masteredWordIds.includes(word.id) || progress.reviewWordIds.includes(word.id)).length;

  function mark(id: string, status: "mastered" | "review") {
    setProgress((current) => ({
      ...current,
      masteredWordIds: status === "mastered" ? uniq([...current.masteredWordIds, id]) : current.masteredWordIds.filter((itemId) => itemId !== id),
      reviewWordIds: status === "review" ? uniq([...current.reviewWordIds, id]) : current.reviewWordIds.filter((itemId) => itemId !== id),
      levelProgress: {
        ...current.levelProgress,
        [level]: percent(
          items.filter((word) =>
            word.id === id ||
            current.masteredWordIds.includes(word.id) ||
            current.reviewWordIds.includes(word.id)
          ).length,
          items.length
        )
      }
    }));
  }

  return (
    <Card className="study-card vocab-card">
      <div className="card-status">
        <span>{index + 1}/{items.length}</span>
        <span>{t("progress")} {percent(learned, items.length)}%</span>
      </div>
      <div className="hanzi-display">{item.hanzi}</div>
      <p className="pinyin">{item.pinyin}</p>
      {showAnswer && (
        <div className="answer-block">
          <p><strong>{t("meaning")}:</strong> {item.vietnamese}</p>
          <p><strong>{t("example")}:</strong> {item.example}</p>
          <p>{item.examplePinyin}</p>
          <p>{item.exampleVietnamese}</p>
        </div>
      )}
      <div className="button-row">
        <Button type="button" onClick={() => setShowAnswer((value) => !value)}>
          {showAnswer ? t("hideAnswer") : t("showAnswer")}
        </Button>
        <Button type="button" variant="success" onClick={() => mark(item.id, "mastered")}>
          <Check size={16} /> {t("markMastered")}
        </Button>
      </div>
      <div className="button-row">
        <Button type="button" onClick={() => setIndex((value) => Math.max(0, value - 1))}>{t("previous")}</Button>
        <Button type="button" onClick={() => mark(item.id, "review")}><RefreshCcw size={16} /> {t("markReview")}</Button>
        <Button type="button" variant="primary" onClick={() => {
          setShowAnswer(false);
          setIndex((value) => (value + 1) % items.length);
        }}>{t("next")}</Button>
      </div>
    </Card>
  );
}

function WritingPractice({
  level,
  progress,
  setProgress,
  t
}: {
  level: HskLevel;
  progress: StudyProgress;
  setProgress: (next: StudyProgress | ((current: StudyProgress) => StudyProgress)) => void;
  t: ReturnType<typeof createTranslator>;
}) {
  const items = getWordsByLevel(level);
  const [index, setIndex] = useState(0);
  const item = items[index] ?? items[0];
  const character = item.hanzi[0];

  function recordComplete() {
    setProgress((current) => {
      const stat = current.writingStats[character] ?? { practiced: 0, completed: 0 };
      return {
        ...current,
        writingStats: {
          ...current.writingStats,
          [character]: { practiced: stat.practiced + 1, completed: stat.completed + 1 }
        }
      };
    });
  }

  return (
    <Card className="study-card writing-card">
      <div className="word-strip">
        <div>
          <strong>{item.hanzi}</strong>
          <span>{item.pinyin}</span>
        </div>
        <p>{item.vietnamese}</p>
      </div>
      <CharacterWriter character={character} onComplete={recordComplete} t={t} />
      <Button type="button" variant="primary" className="wide-button" onClick={() => setIndex((value) => (value + 1) % items.length)}>
        {t("nextChar")}
      </Button>
    </Card>
  );
}

function RecognitionPractice({
  level,
  progress,
  setProgress,
  t
}: {
  level: HskLevel;
  progress: StudyProgress;
  setProgress: (next: StudyProgress | ((current: StudyProgress) => StudyProgress)) => void;
  t: ReturnType<typeof createTranslator>;
}) {
  const items = getWordsByLevel(level);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const item = items[index] ?? items[0];
  const choices = useMemo(() => {
    const pool = items.filter((word) => word.id !== item.id).slice(0, 8);
    return [item, ...pool.slice(0, 3)].sort((a, b) => a.hanzi.localeCompare(b.hanzi, "zh-Hans-CN"));
  }, [item, items]);
  const stat = progress.recognitionStats[level] ?? { correct: 0, total: 0 };
  const isCorrect = picked === item.id;

  function choose(choice: WordItem) {
    if (picked) return;
    setPicked(choice.id);
    setProgress((current) => {
      const currentStat = current.recognitionStats[level] ?? { correct: 0, total: 0 };
      return {
        ...current,
        recognitionStats: {
          ...current.recognitionStats,
          [level]: {
            correct: currentStat.correct + (choice.id === item.id ? 1 : 0),
            total: currentStat.total + 1
          }
        }
      };
    });
  }

  return (
    <Card className="study-card recognition-card">
      <div className="card-status">
        <span>{t("accuracy")} {percent(stat.correct, stat.total)}%</span>
        <span>{stat.correct}/{stat.total}</span>
      </div>
      <p className="soft-label">{t("chooseAnswer")}</p>
      <div className="hanzi-display">{item.hanzi}</div>
      <div className="choice-list">
        {choices.map((choice) => {
          const selected = picked === choice.id;
          const reveal = picked && choice.id === item.id;
          return (
            <button
              key={choice.id}
              type="button"
              className={`choice ${selected ? "selected" : ""} ${reveal ? "correct" : ""}`}
              onClick={() => choose(choice)}
            >
              <strong>{choice.pinyin}</strong>
              <span>{choice.vietnamese}</span>
            </button>
          );
        })}
      </div>
      {picked && (
        <div className={isCorrect ? "feedback good" : "feedback bad"}>
          {isCorrect ? t("correct") : `${t("wrong")} · ${t("correctAnswer")}: ${item.pinyin} / ${item.vietnamese}`}
        </div>
      )}
      <Button type="button" variant="primary" className="wide-button" onClick={() => {
        setPicked(null);
        setIndex((value) => (value + 1) % items.length);
      }}>{t("next")}</Button>
    </Card>
  );
}

function SentencePractice({ level, t }: { level: HskLevel; t: ReturnType<typeof createTranslator> }) {
  const items = getSentencesByLevel(level);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = items[index] ?? items[0];

  return (
    <Card className="study-card sentence-card" onClick={() => setRevealed(true)}>
      <div className="card-status">
        <span>{index + 1}/{items.length}</span>
        <span>{revealed ? t("hideAnswer") : t("tapToReveal")}</span>
      </div>
      <h2>{item.chinese}</h2>
      {revealed && (
        <div className="answer-block">
          <p className="pinyin">{item.pinyin}</p>
          <p>{item.vietnamese}</p>
          <div className="keyword-list">
            {item.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
          </div>
        </div>
      )}
      <div className="button-row">
        <Button type="button" onClick={(event) => {
          event.stopPropagation();
          setRevealed((value) => !value);
        }}>{revealed ? t("hideAnswer") : t("showAnswer")}</Button>
        <Button type="button" variant="primary" onClick={(event) => {
          event.stopPropagation();
          setRevealed(false);
          setIndex((value) => (value + 1) % items.length);
        }}>{t("next")}</Button>
      </div>
    </Card>
  );
}

function ReviewPage({ t, progress, setPage }: { t: ReturnType<typeof createTranslator>; progress: StudyProgress; setPage: (page: Page) => void }) {
  const reviewWords = words.filter((word) => progress.reviewWordIds.includes(word.id));
  return (
    <div className="stack">
      <SectionTitle title={t("review")} subtitle={t("needsReview")} />
      {reviewWords.length ? (
        reviewWords.map((word) => (
          <Card key={word.id} className="review-row" onClick={() => setPage({ name: "practice", mode: "vocabulary", level: word.level })}>
            <strong>{word.hanzi}</strong>
            <span>{word.pinyin}</span>
            <p>{word.vietnamese}</p>
          </Card>
        ))
      ) : (
        <Card className="empty-state">
          <BadgeCheck size={34} />
          <p>{t("miniLibrary")}</p>
        </Card>
      )}
    </div>
  );
}

function SettingsPage({
  t,
  progress,
  setProgress,
  selectLevel
}: {
  t: ReturnType<typeof createTranslator>;
  progress: StudyProgress;
  setProgress: (next: StudyProgress | ((current: StudyProgress) => StudyProgress)) => void;
  selectLevel: (level: HskLevel) => void;
}) {
  const [message, setMessage] = useState("");

  function changeLanguage(language: AppLanguage) {
    setProgress((current) => ({ ...current, language }));
  }

  return (
    <div className="stack settings-page">
      <SectionTitle title={t("settings")} subtitle={t("pwaTip")} />
      <Card>
        <p className="soft-label">{t("language")}</p>
        <div className="two-toggle">
          <button className={progress.language === "vi" ? "active" : ""} type="button" onClick={() => changeLanguage("vi")}>{t("vietnamese")}</button>
          <button className={progress.language === "zh" ? "active" : ""} type="button" onClick={() => changeLanguage("zh")}>{t("chinese")}</button>
        </div>
      </Card>
      <Card className="author-card">
        <p className="soft-label">{t("author")}</p>
        <strong>作者：汤笑磊</strong>
        <span>Tác giả: 汤笑磊</span>
      </Card>
      <Card>
        <p className="soft-label">{t("chooseLevel")}</p>
        <div className="level-grid compact">
          {HSK_LEVELS.map((level) => (
            <button
              className={progress.selectedLevel === level ? "level-card active" : "level-card"}
              key={level}
              type="button"
              onClick={() => selectLevel(clampLevel(level))}
            >
              <span>{level}</span>
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <p className="soft-label">{t("aboutApp")}</p>
        <p>{t("aboutText")}</p>
      </Card>
      <Button
        type="button"
        className="danger-button"
        onClick={() => {
          setProgress(clearProgress(progress.language));
          setMessage(t("resetDone"));
        }}
      >
        {t("clearRecords")}
      </Button>
      {message && <div className="feedback good">{message}</div>}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
