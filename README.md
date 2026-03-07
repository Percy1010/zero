# Zeroto（零点）

面向职业人士的教程网站，第一版聚焦 AIGC。

## 当前页面结构

- 首页：按模块展示入口
- 文档页：左侧目录常驻，点击目录直接阅读
- 右下角：问 AI 悬浮图标，点击打开右侧聊天抽屉

## 快速开始

```bash
cd /Users/Percy/03_vibe_coding/zero_next
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

## 文档维护目录

- AIGC 主文档：`docs/ai/`
- 资讯：`docs/news/`
- 社群：`docs/community/`
- 问 AI 配置：`docs/public/ask-ai-config.json`

## 自动侧边栏说明

- 侧边栏会自动扫描 `docs/ai/` 下的 `.md` 文件并生成目录。
- 新增文章后，不需要手动改 `config.mts`。
- 标题来源优先级：`frontmatter title` > 一级标题 `#` > 文件名。

## 自动知识库说明（问 AI）

- 每次执行 `npm run docs:dev` 或 `npm run docs:build`，都会自动生成 `docs/public/knowledge-base.json`。
- 你不需要手动维护知识库文件，只要维护 `docs/ai/`、`docs/news/`、`docs/community/` 的 Markdown 即可。
