import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type DefaultTheme } from 'vitepress'

const DOCS_ROOT = fileURLToPath(new URL('..', import.meta.url))
const AI_ROOT = path.join(DOCS_ROOT, 'ai')
const MAX_DIR_DEPTH = 3

const DIR_LABEL_MAP: Record<string, string> = {
  concepts: '概念篇',
  tools: '工具篇',
  methodology: '方法论',
  cases: '案例篇',
  opensource: '开源项目',
  resources: '资源推荐',
  logs: '经验实录',
  document: '文档类工具',
  writing: '写作类',
  coding: '编程类工具',
  ide: 'IDE 类'
}

function toPosix(p: string): string {
  return p.split(path.sep).join('/')
}

function humanize(input: string): string {
  if (DIR_LABEL_MAP[input]) return DIR_LABEL_MAP[input]
  return input
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function readPageTitle(absFile: string): string {
  const raw = fs.readFileSync(absFile, 'utf-8')

  const frontmatterTitle = raw.match(/^---[\s\S]*?\ntitle:\s*(.+)\n[\s\S]*?---/m)
  if (frontmatterTitle?.[1]) {
    return frontmatterTitle[1].trim().replace(/^['"]|['"]$/g, '')
  }

  const h1 = raw.match(/^#\s+(.+)$/m)
  if (h1?.[1]) return h1[1].trim()

  const filename = path.basename(absFile, '.md')
  return humanize(filename)
}

function fileToLink(relFileFromDocs: string): string {
  const noExt = toPosix(relFileFromDocs).replace(/\.md$/, '')
  if (noExt.endsWith('/index')) {
    return `/${noExt.slice(0, -'/index'.length)}/`
  }
  return `/${noExt}`
}

function buildItems(absDir: string, relDirFromDocs: string, dirDepth: number): DefaultTheme.SidebarItem[] {
  if (!fs.existsSync(absDir)) return []

  const entries = fs
    .readdirSync(absDir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.') && !entry.name.startsWith('_'))

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))

  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))

  const items: DefaultTheme.SidebarItem[] = []

  if (files.includes('index.md')) {
    items.push({
      text: '概览',
      link: fileToLink(path.join(relDirFromDocs, 'index.md'))
    })
  }

  for (const file of files) {
    if (file === 'index.md') continue
    const abs = path.join(absDir, file)
    const rel = path.join(relDirFromDocs, file)
    items.push({
      text: readPageTitle(abs),
      link: fileToLink(rel)
    })
  }

  if (dirDepth >= MAX_DIR_DEPTH) {
    return items
  }

  for (const dir of dirs) {
    const abs = path.join(absDir, dir)
    const rel = path.join(relDirFromDocs, dir)
    const childItems = buildItems(abs, rel, dirDepth + 1)
    if (!childItems.length) continue

    items.push({
      text: humanize(dir),
      collapsed: true,
      items: childItems
    })
  }

  return items
}

function buildAiSidebar(): DefaultTheme.SidebarItem[] {
  const topSections = ['concepts', 'tools', 'methodology', 'cases', 'opensource', 'resources', 'logs']

  const sidebar: DefaultTheme.SidebarItem[] = [
    {
      text: 'AIGC 总览',
      items: [{ text: '开始学习', link: '/ai/' }]
    }
  ]

  for (const section of topSections) {
    const sectionAbs = path.join(AI_ROOT, section)
    if (!fs.existsSync(sectionAbs)) continue

    const items = buildItems(sectionAbs, path.join('ai', section), 1)
    if (!items.length) continue

    sidebar.push({
      text: humanize(section),
      collapsed: false,
      items
    })
  }

  return sidebar
}

export default defineConfig({
  title: 'Zeroto 零点',
  description: '职业人士教程站，第一版聚焦 AIGC。',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'keywords', content: 'AIGC,教程,职业学习,Prompt,AI工具' }],
    ['meta', { property: 'og:type', content: 'website' }]
  ],
  sitemap: {
    hostname: 'https://zeroto.pages.dev'
  },
  themeConfig: {
    siteTitle: 'Zeroto 零点',
    nav: [
      { text: '首页', link: '/' },
      { text: 'AIGC 文档', link: '/ai/' },
      { text: '日报资讯', link: '/news/' },
      { text: '社媒交流', link: '/community/' }
    ],
    sidebar: {
      '/ai/': buildAiSidebar(),
      '/news/': [{ text: '日报资讯', items: [{ text: '资讯首页', link: '/news/' }] }],
      '/community/': [{ text: '社媒交流', items: [{ text: '入口首页', link: '/community/' }] }]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/Percy1010/zeroto' }],
    outline: {
      label: '本页目录',
      level: [2, 3]
    },
    returnToTopLabel: '返回顶部',
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    editLink: {
      pattern: 'https://github.com/Percy1010/zeroto/edit/main/docs/:path',
      text: '编辑此页'
    },
    footer: {
      message: 'From Zero, To Next',
      copyright: `Copyright © ${new Date().getFullYear()} Zeroto`
    }
  }
})
