import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "nex-agi/nex-n2-pro:free";
const APP_REFERER = "https://argue-winner.app";
const APP_TITLE = "ArgueWinner";

export class OpenRouterHttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(`OpenRouter API ${status}: ${message}`);
    this.name = "OpenRouterHttpError";
    this.status = status;
  }
}

export class OpenRouterResponseShapeError extends Error {
  constructor(message: string) {
    super(`OpenRouter 返回内容结构异常: ${message}`);
    this.name = "OpenRouterResponseShapeError";
  }
}

interface ChatCompletionResponse {
  choices: Array<{
    message: { content: string };
  }>;
}

function extractJsonObject(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : raw.trim();
  try {
    return JSON.parse(candidate);
  } catch {
    const firstBrace = candidate.indexOf("{");
    const lastBrace = candidate.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("未找到 JSON 对象");
    }
    return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
  }
}

export async function generateResponses(
  userMessage: string,
  intensity: number,
): Promise<string[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY 未配置");
  }

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": APP_REFERER,
      "X-Title": APP_TITLE,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt(intensity) },
        { role: "user", content: buildUserPrompt(userMessage) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "无法读取错误内容");
    throw new OpenRouterHttpError(response.status, errorText);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new OpenRouterResponseShapeError("choices[0].message.content 缺失或非字符串");
  }

  let parsed: unknown;
  try {
    parsed = extractJsonObject(content);
  } catch (cause) {
    throw new OpenRouterResponseShapeError(
      `JSON 解析失败: ${(cause as Error).message}`,
    );
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !Array.isArray((parsed as { responses?: unknown }).responses)
  ) {
    throw new OpenRouterResponseShapeError("缺少 responses 数组");
  }

  const responses = (parsed as { responses: unknown[] }).responses.filter(
    (item): item is string => typeof item === "string" && item.length > 0,
  );

  if (responses.length === 0) {
    throw new OpenRouterResponseShapeError("responses 数组为空");
  }

  return responses.slice(0, 3);
}
