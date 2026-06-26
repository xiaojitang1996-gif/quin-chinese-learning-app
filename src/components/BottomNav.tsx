import { BookOpen, Home, Layers, PenLine, Settings } from "lucide-react";
import type { Page } from "../types";
import type { TranslationKey } from "../i18n/translations";

const items: Array<{
  page: Page;
  key: TranslationKey;
  icon: typeof Home;
  match: (page: Page) => boolean;
}> = [
  { page: { name: "home" }, key: "home", icon: Home, match: (page) => page.name === "home" },
  { page: { name: "hsk" }, key: "hsk", icon: Layers, match: (page) => page.name === "hsk" },
  {
    page: { name: "practice", mode: "writing", level: "HSK1" },
    key: "writing",
    icon: PenLine,
    match: (page) => page.name === "practice" && page.mode === "writing"
  },
  { page: { name: "review" }, key: "review", icon: BookOpen, match: (page) => page.name === "review" },
  { page: { name: "settings" }, key: "settings", icon: Settings, match: (page) => page.name === "settings" }
];

type Props = {
  current: Page;
  setPage: (page: Page) => void;
  t: (key: TranslationKey) => string;
};

export function BottomNav({ current, setPage, t }: Props) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.match(current);
        return (
          <button
            key={item.key}
            className={active ? "nav-item active" : "nav-item"}
            onClick={() => setPage(item.page)}
            type="button"
          >
            <Icon size={20} strokeWidth={2.2} />
            <span>{t(item.key)}</span>
          </button>
        );
      })}
    </nav>
  );
}
