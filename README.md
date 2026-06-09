# 吵架包赢

输入对方说的话 → 拖动强度滑块 → 立刻得到 3 条犀利回怼，复制即用。

> 吵架时大脑空白、事后才想起该怎么怼？让吵架高手替你上场。

## 启动

```bash
npm install
cp .env.example .env.local   # 编辑 .env.local 填入 OPENROUTER_API_KEY
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 环境变量

| 变量 | 说明 | 必填 |
|---|---|---|
| `OPENROUTER_API_KEY` | OpenRouter API Key（[申请地址](https://openrouter.ai/keys)） | 是 |

> 缺少 `OPENROUTER_API_KEY` 时，接口会返回 500 + `{ "error": "服务未配置，请联系作者" }`，前端展示对应错误条。

## 技术栈

- **Next.js 16**（App Router）+ **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**（slider / button / card / textarea / popover）
- **OpenRouter**（[OpenAI 兼容接口](https://openrouter.ai/docs)，模型 `nex-agi/nex-n2-pro:free`）
- 无数据库、无登录、无历史

## 项目结构

```
app/
├── page.tsx                 # 主页（Server Component）
├── layout.tsx               # 根布局 + metadata + viewport
├── globals.css              # 主题色（紫粉渐变）+ 动画
└── api/argue/route.ts       # POST 接口：校验 → 调 OpenRouter → 返回 3 条

components/
├── argument-form.tsx        # 主表单（客户端，组合所有子组件）
├── intensity-slider.tsx     # 1-10 滑块 + 档位文字
├── example-chips.tsx        # 示例语句
├── result-card.tsx          # 单条回复卡片 + 复制按钮
└── share-button.tsx         # 分享给朋友 popover

lib/
├── openrouter-client.ts     # OpenRouter 客户端 + 错误类
├── prompts.ts               # 3 档 prompt 模板
└── argument-types.ts        # 类型定义
```

## 强度档位

| 档位 | 范围 | 风格 |
|---|---|---|
| 🧊 理性反论 | 1-3 | 冷静克制，事实逻辑反驳 |
| 😏 幽默挖苦 | 4-6 | 机智反讽、调侃，让对方会心一笑 |
| 🔥 犀利金句 | 7-10 | 一针见血、直击要害 |

## 命令

```bash
npm run dev      # 开发服务器（http://localhost:3000）
npm run build    # 生产构建
npm run start    # 启动生产服务
npm run lint     # ESLint 检查
```

## 接口

`POST /api/argue`

请求：
```json
{ "message": "你怎么这么懒", "intensity": 7 }
```

成功响应（200）：
```json
{ "responses": ["回复1", "回复2", "回复3"] }
```

错误响应：所有错误统一为 `{ "error": "中文提示" }`，HTTP 状态码区分类型（400 校验失败 / 429 限流 / 500 服务异常）。

## 后续可扩展

详见 `~/.claude/plans/next-js-app-router-reactive-beaver.md` §12：
- 真实微信 JSSDK 分享
- 服务端限流（IP）
- 多种吵架风格（地域/性别/关系）
- 历史记录（localStorage）
- 语音输入
