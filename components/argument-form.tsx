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
  const [intensity, setIntensity] = useState(5);
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
    <div className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            吵架包赢
          </span>
        </h1>
        <ShareButton />
      </div>

      <p className="text-sm text-muted-foreground">
        输入对方说的话，拖一拖强度滑块，让吵架高手替你回怼。
      </p>

      <ExampleChips onSelect={pickExample} disabled={isLoading} />

      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="对方说：「……」"
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          disabled={isLoading}
          maxLength={MAX_INPUT_LENGTH}
          rows={3}
          aria-invalid={inputError !== null}
          className="resize-none border-border/60 bg-white/80 text-base shadow-sm backdrop-blur-sm focus-visible:ring-indigo-200"
        />
        <div className="flex items-center justify-between text-xs">
          <span className="text-destructive">{inputError ?? ""}</span>
          <span className="text-muted-foreground tabular-nums">
            {message.length} / {MAX_INPUT_LENGTH}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
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
        className="h-12 w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-base font-semibold text-white shadow-md transition-all hover:from-indigo-600 hover:to-pink-600 hover:shadow-lg disabled:opacity-70"
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
          className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
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
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">
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
