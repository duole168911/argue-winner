"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Share2 } from "lucide-react";

const INVITE_TEXT =
  "我用「吵架必赢」一次都没输过，你也来试试 👉 https://argue-winner.vercel.app/";

export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(INVITE_TEXT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (cause) {
      window.alert(`复制失败: ${(cause as Error).message}`);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-indigo-200 bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <Share2 className="size-4" />
            分享给朋友
          </Button>
        }
      />
      <PopoverContent
        align="end"
        className="w-80 border-indigo-100 bg-white/95 p-4 backdrop-blur-sm"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Share2 className="size-4 text-indigo-500" />
            把这个工具推荐给朋友
          </div>
          <p className="rounded-lg bg-gradient-to-r from-indigo-50 to-pink-50 p-3 text-sm leading-relaxed text-foreground">
            {INVITE_TEXT}
          </p>
          <Button
            type="button"
            onClick={handleCopy}
            className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:from-indigo-600 hover:to-pink-600"
          >
            {copied ? (
              <>
                <Check className="size-4" />
                已复制
              </>
            ) : (
              "复制邀请文案"
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
