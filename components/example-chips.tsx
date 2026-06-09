"use client";

const EXAMPLES: ReadonlyArray<string> = [
  "你怎么这么懒",
  "你一点都不体贴",
  "你怎么又迟到了",
  "你看看别人家的",
  "你这人真自私",
];

interface ExampleChipsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function ExampleChips({ onSelect, disabled }: ExampleChipsProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        没想好？试试这些：
      </span>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((text) => (
          <button
            key={text}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(text)}
            className="rounded-full border border-indigo-200/60 bg-gradient-to-r from-indigo-50 to-pink-50 px-3 py-1.5 text-xs text-indigo-700 transition-all hover:from-indigo-100 hover:to-pink-100 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
