"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";

interface ResultCardProps {
  text: string;
  index: number;
}

const BADGE_COLOR: Record<number, string> = {
  1: "from-sky-500 to-blue-500",
  2: "from-indigo-500 to-purple-500",
  3: "from-pink-500 to-rose-500",
};

export function ResultCard({ text, index }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (cause) {
      window.alert(`复制失败: ${(cause as Error).message}`);
    }
  }

  return (
    <Card
      className="border-0 bg-white/80 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
    >
      <CardContent className="flex items-start gap-3 p-4">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${BADGE_COLOR[index] ?? BADGE_COLOR[3]}`}
          aria-hidden
        >
          {index + 1}
        </span>
        <p className="flex-1 text-base leading-relaxed text-foreground">
          {text}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          aria-label={copied ? "已复制" : "复制这条回复"}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <Check className="size-4 text-green-600" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
