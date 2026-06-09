"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExampleChips } from "@/components/example-chips";
import { IntensitySlider } from "@/components/intensity-slider";
import { ResultCard } from "@/components/result-card";
import { ShareButton } from "@/components/share-button";
import type { ApiErrorBody, ArgumentResponse } from "@/lib/argument-types";
import { Loader2, Sparkles } from "lucide-react";

const MAX_INPUT_LENGTH = 500;

export function ArgumentForm() {
  const [message, setMessage] = useState("");
  const [intensity, setIntensity] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<string[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  async function submit() {
    const trimmed = message.trim();
    if (!trimmed) {
      setInputError("请输入对方说的话");
      return;
    }
    if (trimmed.length > MAX_INPUT_LENGTH) {
      setInputError(`输入过长（最多 ${MAX_INPUT_LENGTH} 字）`);
      return;
    }
    setInputError(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/argue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, intensity }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | ApiErrorBody
          | null;
        throw new Error(body?.error ?? `请求失败（${res.status}）`);
      }
      const data = (await res.json()) as ArgumentResponse;
      setResponses(data.responses);
    } catch (cause) {
      setErrorMessage((cause as Error).message);
      setResponses(null);
    } finally {
      setIsLoading(false);
    }
  }

  function handleMessageChange(next: string) {
    setMessage(next);
    if (inputError) setInputError(null);
  }

  function pickExample(text: string) {
    setMessage(text);
    setInputError(null);
  }

  const showResults = responses !== null && responses.length > 0;

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3">
      <div className="flex shrink-0 items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            吵架必赢
          </span>
        </h1>
        <ShareButton />
      </div>

      <p className="shrink-0 text-xs text-muted-foreground sm:text-sm">
        吵架吵不过？我能替你一句封喉！输入对方说的话，拖一拖强度滑块，让吵架高手替你回怼。
      </p>

      {!showResults && (
        <div className="shrink-0 -mx-1">
          <ExampleChips onSelect={pickExample} disabled={isLoading} />
        </div>
      )}

      <div className="flex shrink-0 flex-col gap-1">
        <Textarea
          placeholder="对方说：「……」"
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          disabled={isLoading}
          maxLength={MAX_INPUT_LENGTH}
          rows={2}
          aria-invalid={inputError !== null}
          className="resize-none border-border/60 bg-white/80 text-sm shadow-sm backdrop-blur-sm focus-visible:ring-indigo-200 sm:text-base"
        />
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="text-destructive">{inputError ?? ""}</span>
          <span className="text-muted-foreground tabular-nums">
            {message.length} / {MAX_INPUT_LENGTH}
          </span>
        </div>
      </div>

      <div className="shrink-0 rounded-xl border border-border/40 bg-white/60 p-3 shadow-sm backdrop-blur-sm sm:p-4">
        <IntensitySlider
          value={intensity}
          onChange={setIntensity}
          disabled={isLoading}
        />
      </div>

      <Button
        type="button"
        onClick={submit}
        disabled={isLoading}
        size="lg"
        className="h-10 w-full shrink-0 bg-gradient-to-r from-indigo-500 to-pink-500 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-600 hover:to-pink-600 hover:shadow-lg disabled:opacity-70 sm:h-12 sm:text-base"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            吵架高手正在憋大招…
          </>
        ) : (
          <>
            <Sparkles className="size-5" />
            {showResults ? "再来一次" : "开始吵架"}
          </>
        )}
      </Button>

      {errorMessage && (
        <div
          role="alert"
          className="flex shrink-0 items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <span>{errorMessage}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={submit}
            disabled={isLoading}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            重试
          </Button>
        </div>
      )}

      {showResults && (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1 sm:gap-3">
          <h2 className="sticky top-0 -mt-1 bg-gradient-to-b from-white/95 to-white/0 pb-1 text-sm font-semibold text-foreground backdrop-blur-sm">
            给你三条回复（按强度排序）
          </h2>
          {responses.map((text, index) => (
            <ResultCard key={`${index}-${text.slice(0, 10)}`} text={text} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
