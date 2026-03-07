# Zeroto（零点）

面向职业人士的教程网站，第一版聚焦 AIGC。

## 项目结构

- `docs/index.md`：首页
- `docs/ai/`：AIGC 文档主目录
- `docs/news/index.md`：资讯页面
- `docs/community/index.md`：社群入口
- `docs/.vitepress/`：站点配置与主题
- `functions/api/ask-ai.ts`：问 AI 后端接口（Cloudflare Pages Functions）

## 开发

```bash
npm install
npm run docs:dev
```

## 构建

```bash
npm run docs:build
```
