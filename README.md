# Zeroto（零点）

面向职业人士的教程网站，第一版聚焦 AIGC。

## 当前页面结构

- 首页：按模块展示入口
- 文档页：左侧目录常驻，点击目录直接阅读
- 右下角：问 AI 悬浮图标，点击打开右侧聊天抽屉

## 快速开始

```bash
cd /Users/Percy/03_vibe_coding/zero_next/02code/zeroto
npm install
npm run docs:dev
```

访问 `http://localhost:5173`

## 构建

```bash
npm run docs:build
npm run docs:preview
```

## 部署文档

请看：

- `DEPLOY_CLOUDFLARE.md`

其中包含：
- 如何推送到 GitHub
- 如何零成本部署到 Cloudflare Pages
- 需要你手动操作的每一步点击路径
- 国内访问速度优化建议
