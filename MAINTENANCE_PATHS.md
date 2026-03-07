# Zeroto 维护目录（最新）

你日常只需要维护下面这些 Markdown 文件目录：

## 1) 主内容目录（最重要）

- `docs/ai/`

在这里新增文章后：
- 会自动进入左侧侧边栏
- 会自动进入问 AI 的知识库

## 2) 资讯与社群

- `docs/news/index.md`（日报/周报资讯）
- `docs/community/index.md`（微信群、知识星球、GitHub 等入口）

## 3) 首页

- `docs/index.md`

用于调整首页模块文案和入口链接。

## 4) 可选配置文件（非日常）

- `docs/public/ask-ai-config.json`（问 AI 后端接口配置）
- `docs/.vitepress/config.mts`（站点导航、主题、自动侧边栏逻辑）

## 5) 日常发布命令

```bash
cd /Users/Percy/03_vibe_coding/zero_next
git add .
git commit -m "docs: update content"
git push
```

Cloudflare Pages 会自动部署。
