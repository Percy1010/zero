# Cloudflare Pages 零成本部署手册（Zeroto）

本项目可以用 `Cloudflare Pages` 免费部署，满足“零成本 + 国内可用速度”。

## 0. 先确认本地可构建

在项目目录执行：

```bash
cd /Users/Percy/03_vibe_coding/zero_next
npm install
npm run docs:build
```

看到 `build complete` 即可。

## 1. 推送到 GitHub（你需要操作）

### 1.1 在 GitHub 网页创建空仓库

1. 打开 `https://github.com/new`
2. Repository name 填：`zeroto`
3. 选择 Public 或 Private（都可）
4. 不勾选 `Add a README`（因为本地已有）
5. 点击 `Create repository`

### 1.2 本地推送命令（新仓库）

```bash
cd /Users/Percy/03_vibe_coding/zero_next

# 提交代码
git add .
git commit -m "feat: initial zeroto docs site"

# 绑定远程（替换成你的地址）
git remote set-url origin https://github.com/<你的GitHub用户名>/zeroto.git

# 推送
git push
```

如果你使用 SSH，把 remote 改成：

```bash
git remote set-url origin git@github.com:<你的GitHub用户名>/zeroto.git
```

## 2. 连接 Cloudflare Pages（你需要操作）

### 2.1 创建 Pages 项目

1. 登录 Cloudflare Dashboard：`https://dash.cloudflare.com`
2. 左侧进入 `Workers & Pages`
3. 点击 `Create`
4. 选择 `Pages` -> `Connect to Git`
5. 授权 GitHub，选中你的 `zeroto` 仓库

### 2.2 构建参数（关键）

- Framework preset: `None`（或自动识别为 VitePress 也可以）
- Build command: `npm run docs:build`
- Build output directory: `docs/.vitepress/dist`
- Root directory:
  - 当前仓库结构为项目根目录，保持留空即可

环境变量（Environment variables）新增：

- `NODE_VERSION=20`

然后点击 `Save and Deploy`。

## 3. 使用免费域名（零成本）

部署完成后会得到：

- `https://<项目名>.pages.dev`

这一步完全免费，且可直接访问。

## 4. 绑定自定义域名（可选，非零成本）

如果你要 `zeroto.com/zeroto.site`：

1. 在 Cloudflare 中添加你的域名站点（如果还没加）
2. 进入 Pages 项目 -> `Custom domains`
3. `Set up a custom domain`
4. 输入域名并确认
5. Cloudflare 会自动生成 DNS 记录和证书

## 5. 国内访问速度建议（免费可做）

在 Cloudflare 里确认这些开关：

1. `Speed` -> 打开 `Brotli`
2. `Network` -> 打开 `HTTP/3 (with QUIC)`
3. 使用 Cloudflare DNS 托管域名，并保持记录为 `Proxied`（橙色云）

说明：Cloudflare Pages 免费方案在国内通常“可用且较快”，但不是中国大陆节点直出；若后期追求极致速度，需要备案 + 国内 CDN。

## 6. 后续更新发布流程

日常只需要：

```bash
git add .
git commit -m "docs: update content"
git push
```

Cloudflare Pages 会自动重新构建并发布。

## 7. 常见问题

### Q1: 构建失败，提示找不到 package.json
- 原因：Root directory 配错。
- 解决：当前项目应保持 Root directory 为空（仓库根目录）。

### Q2: 构建失败，Node 版本问题
- 解决：在 Pages 环境变量里加 `NODE_VERSION=20`。

### Q3: 页面 404
- 解决：确认 Build output directory 是 `docs/.vitepress/dist`。
