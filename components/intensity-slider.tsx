"use client";

import { Slider } from "@/components/ui/slider";
import type { IntensityStyle } from "@/lib/argument-types";

const TIER_LABEL: Record<IntensityStyle, { emoji: string; text: string }> = {
  low: { emoji: "🧊", text: "理性反论" },
  mid: { emoji: "😏", text: "幽默挖苦" },
  high: { emoji: "🔥", text: "犀利金句" },
};

function tierFor(intensity: number): IntensityStyle {
  if (intensity <= 3) return "low";
  if (intensity <= 6) return "mid";
  return "high";
}

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
  const tier = TIER_LABEL[tierFor(value)];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">语气强度</span>
        <span className="text-2xl font-bold tabular-nums bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          {value}
        </span>
      </div>
      <Slider
        value={[value]}
        min={1}
        max={10}
        step={1}
        disabled={disabled}
        onValueChange={(next) => {
          const nextValue = Array.isArray(next) ? next[0] : next;
          if (typeof nextValue === "number") onChange(nextValue);
        }}
        className="w-full"
      />
      <div className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-50 to-pink-50 px-3 py-2 text-sm font-medium transition-all">
        <span className="text-base" aria-hidden>
          {tier.emoji}
        </span>
        <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          {tier.text}
        </span>
      </div>
    </div>
  );
}
