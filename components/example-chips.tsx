"use client";

const EXAMPLES: ReadonlyArray<string> = [
  "你算哪根葱啊",
  "你嘴怎么这么欠",
  "你先照照镜子吧",
  "哪来的优越感",
];

interface ExampleChipsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function ExampleChips({ onSelect, disabled }: ExampleChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        试试：
      </span>
      {EXAMPLES.map((text) => (
        <button
          key={text}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(text)}
          className="shrink-0 rounded-full border border-indigo-200/60 bg-gradient-to-r from-indigo-50 to-pink-50 px-2.5 py-1 text-xs whitespace-nowrap text-indigo-700 transition-all hover:from-indigo-100 hover:to-pink-100 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
