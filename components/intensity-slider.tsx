"use client";

import { Slider } from "@/components/ui/slider";

const LEVEL_LABEL: Record<number, string> = {
  1: "别急，先讲理",
  2: "开始有点阴阳了",
  3: "笑死，反手一刀",
  4: "不装了，直接怼",
  5: "别眨眼，封喉暴击",
};

interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function IntensitySlider({
  value,
  onChange,
  disabled,
}: IntensitySliderProps) {
  const label = LEVEL_LABEL[value] ?? LEVEL_LABEL[3];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">语气强度</span>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text font-medium text-transparent">
            {label}
          </span>
          <span className="font-bold tabular-nums text-indigo-600">·{value}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        min={1}
        max={5}
        step={1}
        disabled={disabled}
        onValueChange={(next) => {
          const nextValue = Array.isArray(next) ? next[0] : next;
          if (typeof nextValue === "number") onChange(nextValue);
        }}
        className="w-full"
      />
    </div>
  );
}
