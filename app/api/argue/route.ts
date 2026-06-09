import type { ApiErrorBody, ArgumentRequest, ArgumentResponse } from "@/lib/argument-types";
import {
  generateResponses,
  OpenRouterHttpError,
  OpenRouterResponseShapeError,
} from "@/lib/openrouter-client";

const MAX_INPUT_LENGTH = 500;

function jsonError(status: number, error: string): Response {
  const body: ApiErrorBody = { error };
  return Response.json(body, { status });
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "请求体不是合法 JSON");
  }

  const { message, intensity } = body as Partial<ArgumentRequest>;

  if (typeof message !== "string" || !message.trim()) {
    return jsonError(400, "请输入对方说的话");
  }
  if (message.length > MAX_INPUT_LENGTH) {
    return jsonError(400, `输入过长（最多 ${MAX_INPUT_LENGTH} 字）`);
  }
  if (typeof intensity !== "number" || intensity < 1 || intensity > 10) {
    return jsonError(400, "强度必须在 1-10");
  }

  try {
    const responses = await generateResponses(message, intensity);
    const result: ArgumentResponse = { responses };
    return Response.json(result);
  } catch (cause) {
    if (cause instanceof OpenRouterHttpError) {
      if (cause.status === 401 || cause.status === 403) {
        return jsonError(500, "服务暂时不可用");
      }
      if (cause.status === 429) {
        return jsonError(429, "吵架高手开小差了，请稍后再试");
      }
      return jsonError(500, "回复生成失败，请重试");
    }
    if (cause instanceof OpenRouterResponseShapeError) {
      return jsonError(500, "回复生成失败，请重试");
    }
    if (cause instanceof Error && cause.message.includes("OPENROUTER_API_KEY")) {
      return jsonError(500, "服务未配置，请联系作者");
    }
    return jsonError(500, "回复生成失败，请重试");
  }
}
