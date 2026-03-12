import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type DefaultTheme } from 'vitepress'

const SITE_URL = 'https://zeroto.pages.dev'
const SITE_NAME = 'Zero 零点'
const SITE_NAME_EN = 'Zero'
const DEFAULT_OG_IMAGE = '/og-image.svg'
const ZH_DESCRIPTION =
  'Zero 零点是面向职业人士的零基础 AIGC 教程站，覆盖 AI 概念、工具实操、Prompt 方法论、案例复盘、开源项目与资源导航。'
const EN_DESCRIPTION =
  'Zero is an AIGC tutorial site for professionals, covering AI concepts, practical tools, prompt methods, case studies, open-source projects, and curated resources.'
const ZH_KEYWORDS = ['AIGC教程', 'AI工具', 'Prompt', '零基础AI', '职业学习', 'AI案例']
const EN_KEYWORDS = ['AIGC tutorials', 'AI tools', 'prompt engineering', 'AI workflow', 'AI case studies']
const DOCS_ROOT = fileURLToPath(new URL('..', import.meta.url))
const AI_ROOT = path.join(DOCS_ROOT, 'ai')
const AI_EN_ROOT = path.join(DOCS_ROOT, 'en', 'ai')
const MAX_DIR_DEPTH = 3

const ZH_LABEL_MAP: Record<string, string> = {
  concepts: '基础概念',
  tools: '热门工具',
  methodology: '实践总结',
  cases: '项目案例',
  opensource: '开源项目',
  resources: '资源推荐',
  logs: '经验实录',
  document: '文档类工具',
  writing: '写作类',
  coding: '编程类工具',
  ide: 'IDE 类'
}

const EN_LABEL_MAP: Record<string, string> = {
  concepts: 'Core Concepts',
  tools: 'Popular Tools',
  methodology: 'Practice Notes',
  cases: 'Project Cases',
  opensource: 'Open Source',
  resources: 'Resources',
  logs: 'Field Notes',
  document: 'Documentation Tools',
  writing: 'Writing',
  coding: 'Coding Tools',
  ide: 'IDE'
}

const CONCEPT_PAGE_ORDER = [
  'what-is-llm.md',
  'what-is-prompt.md',
  'what-is-context.md',
  'what-is-memory.md',
  'what-is-token.md',
  'what-is-agent.md',
  'what-is-search.md',
  'what-is-rag.md',
  'what-is-function-calling.md',
  'what-is-mcp.md',
  'what-is-workflow.md',
  'what-is-skill.md',
  'what-is-subagent.md',
  'what-is-a2a.md'
]

function toPosix(p: string): string {
  return p.split(path.sep).join('/')
}

function sortDocNames(names: string[], relDirFromDocs: string): string[] {
  const rel = toPosix(relDirFromDocs)
  const preferredOrder =
    rel === 'ai/concepts' || rel === 'en/ai/concepts' ? CONCEPT_PAGE_ORDER : []

  return [...names].sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a)
    const bIndex = preferredOrder.indexOf(b)

    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    }

    return a.localeCompare(b, 'en')
  })
}

function normalizePath(input: string): string {
  if (!input) return '/'
  const noQuery = input.split('#')[0]?.split('?')[0] || '/'
  const withSlash = noQuery.startsWith('/') ? noQuery : `/${noQuery}`
  if (withSlash !== '/' && withSlash.endsWith('/')) return withSlash.slice(0, -1)
  return withSlash
}

function walkMdFiles(absDir: string): string[] {
  const out: string[] = []
  const entries = fs.readdirSync(absDir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const abs = path.join(absDir, entry.name)
    if (entry.isDirectory()) out.push(...walkMdFiles(abs))
    if (entry.isFile() && entry.name.endsWith('.md')) out.push(abs)
  }
  return out
}

function humanize(input: string, labelMap: Record<string, string>): string {
  if (labelMap[input]) return labelMap[input]
  return input
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function readPageTitle(absFile: string, labelMap: Record<string, string>): string {
  const raw = fs.readFileSync(absFile, 'utf-8')

  const frontmatterTitle = raw.match(/^---[\s\S]*?\ntitle:\s*(.+)\n[\s\S]*?---/m)
  if (frontmatterTitle?.[1]) {
    return frontmatterTitle[1].trim().replace(/^['"]|['"]$/g, '')
  }

  const h1 = raw.match(/^#\s+(.+)$/m)
  if (h1?.[1]) return h1[1].trim()

  const filename = path.basename(absFile, '.md')
  return humanize(filename, labelMap)
}

function fileToLink(relFileFromDocs: string): string {
  const noExt = toPosix(relFileFromDocs).replace(/\.md$/, '')
  if (noExt === 'index') {
    return '/'
  }
  if (noExt.endsWith('/index')) {
    return `/${noExt.slice(0, -'/index'.length)}/`
  }
  return `/${noExt}`
}

function getLocaleCode(publicPath: string): 'zh-CN' | 'en-US' {
  return publicPath === '/en/' || publicPath.startsWith('/en/') ? 'en-US' : 'zh-CN'
}

function getLabelMap(publicPath: string): Record<string, string> {
  return getLocaleCode(publicPath) === 'en-US' ? EN_LABEL_MAP : ZH_LABEL_MAP
}

function getSiteTitle(publicPath: string): string {
  return getLocaleCode(publicPath) === 'en-US' ? SITE_NAME_EN : SITE_NAME
}

function getSiteDescription(publicPath: string): string {
  return getLocaleCode(publicPath) === 'en-US' ? EN_DESCRIPTION : ZH_DESCRIPTION
}

function getKeywords(publicPath: string): string {
  const base = getLocaleCode(publicPath) === 'en-US' ? [...EN_KEYWORDS] : [...ZH_KEYWORDS]

  if (publicPath.includes('/tools/')) {
    base.push(getLocaleCode(publicPath) === 'en-US' ? 'AI coding tools' : 'AI工具实操')
  }
  if (publicPath.includes('/methodology/')) {
    base.push(getLocaleCode(publicPath) === 'en-US' ? 'prompt methods' : 'Prompt方法论')
  }
  if (publicPath.includes('/cases/')) {
    base.push(getLocaleCode(publicPath) === 'en-US' ? 'AI use cases' : 'AI案例')
  }
  if (publicPath.includes('/news/')) {
    base.push(getLocaleCode(publicPath) === 'en-US' ? 'AI news analysis' : 'AI资讯解读')
  }
  if (publicPath.includes('/community/')) {
    base.push(getLocaleCode(publicPath) === 'en-US' ? 'AI learning community' : 'AI学习社群')
  }

  return Array.from(new Set(base)).join(', ')
}

function stripInlineMarkdown(input: string): string {
  return input
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
    .replace(/<[^>]+>/g, ' ')
}

function trimDescription(input: string, max = 160): string {
  const normalized = input.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1).trim()}…`
}

function extractDescription(absFile: string, fallbackTitle: string): string {
  const raw = fs.readFileSync(absFile, 'utf-8')
  const frontmatterDescription = raw.match(/^---[\s\S]*?\ndescription:\s*(.+)\n[\s\S]*?---/m)
  if (frontmatterDescription?.[1]) {
    return trimDescription(frontmatterDescription[1].trim().replace(/^['"]|['"]$/g, ''))
  }

  const content = raw
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/m, '')
    .replace(/```[\s\S]*?```/g, ' ')

  const lines = content
    .split(/\r?\n/)
    .map((line) =>
      stripInlineMarkdown(
        line
          .trim()
          .replace(/^>\s*/, '')
          .replace(/^[-*+]\s+/, '')
          .replace(/^\d+\.\s+/, '')
      )
    )
    .filter(
      (line) => line && !line.startsWith('#') && !line.startsWith('|') && !/^[-:| ]+$/.test(line)
    )

  if (!lines.length) return trimDescription(fallbackTitle)
  return trimDescription(lines.slice(0, 2).join(' '))
}

function toAbsoluteUrl(publicPath: string): string {
  return new URL(publicPath, `${SITE_URL}/`).toString()
}

function counterpartPath(publicPath: string): string {
  if (publicPath === '/en/') return '/'
  if (publicPath.startsWith('/en/')) return publicPath.replace(/^\/en/, '') || '/'
  return publicPath === '/' ? '/en/' : `/en${publicPath}`
}

function inferPublicPath(relativePath: string): string {
  return fileToLink(relativePath)
}

function publicPathForNormalized(normalizedPath: string): string {
  if (normalizedPath === '/') return '/'
  return ROUTE_PUBLIC_PATH_BY_NORMALIZED.get(normalizedPath) || normalizedPath
}

function inferPageType(publicPath: string): 'WebSite' | 'CollectionPage' | 'AboutPage' | 'TechArticle' | 'WebPage' {
  if (publicPath === '/' || publicPath === '/en/') return 'WebSite'
  if (publicPath === '/community/' || publicPath === '/en/community/') return 'AboutPage'
  if (publicPath.includes('/news/')) return 'CollectionPage'
  if (publicPath.includes('/ai/')) return 'TechArticle'
  return 'WebPage'
}

function buildBreadcrumbList(publicPath: string, pageTitle: string) {
  const localeCode = getLocaleCode(publicPath)
  const labelMap = getLabelMap(publicPath)
  const homePath = localeCode === 'en-US' ? '/en/' : '/'
  const homeLabel = localeCode === 'en-US' ? 'Home' : '首页'
  const parts = publicPath.replace(/^\/|\/$/g, '').split('/').filter(Boolean)
  const filteredParts = localeCode === 'en-US' ? parts.slice(1) : parts
  const items = [{ name: homeLabel, path: homePath }]
  const walkingParts = localeCode === 'en-US' ? ['en'] : []

  filteredParts.forEach((part, index) => {
    walkingParts.push(part)
    const normalized = `/${walkingParts.join('/')}`
    const isLast = index === filteredParts.length - 1
    items.push({
      name: isLast ? pageTitle : humanize(part, labelMap),
      path: isLast ? publicPath : publicPathForNormalized(normalized)
    })
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path)
    }))
  }
}

function buildJsonLd(publicPath: string, pageTitle: string, description: string) {
  const localeCode = getLocaleCode(publicPath)
  const siteHome = localeCode === 'en-US' ? '/en/' : '/'
  const pageType = inferPageType(publicPath)
  const pageEntity = {
    '@context': 'https://schema.org',
    '@type': pageType,
    name: pageTitle,
    description,
    inLanguage: localeCode,
    url: toAbsoluteUrl(publicPath),
    isPartOf: {
      '@type': 'WebSite',
      name: getSiteTitle(publicPath),
      url: toAbsoluteUrl(siteHome)
    }
  }

  if (pageType === 'WebSite') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: getSiteTitle(publicPath),
        description,
        inLanguage: localeCode,
        url: toAbsoluteUrl(publicPath)
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: getSiteTitle(publicPath),
        url: toAbsoluteUrl(siteHome),
        logo: toAbsoluteUrl(DEFAULT_OG_IMAGE)
      }
    ]
  }

  return [pageEntity, buildBreadcrumbList(publicPath, pageTitle)]
}

function safeJsonLd(input: unknown): string {
  return JSON.stringify(input).replace(/</g, '\\u003c')
}

function buildItems(
  absDir: string,
  relDirFromDocs: string,
  dirDepth: number,
  labelMap: Record<string, string>,
  overviewText: string
): DefaultTheme.SidebarItem[] {
  if (!fs.existsSync(absDir)) return []

  const entries = fs
    .readdirSync(absDir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.') && !entry.name.startsWith('_'))

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
  const sortedFiles = sortDocNames(files, relDirFromDocs)

  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'en'))

  const items: DefaultTheme.SidebarItem[] = []

  if (sortedFiles.includes('index.md')) {
    items.push({
      text: overviewText,
      link: fileToLink(path.join(relDirFromDocs, 'index.md'))
    })
  }

  for (const file of sortedFiles) {
    if (file === 'index.md') continue
    const abs = path.join(absDir, file)
    const rel = path.join(relDirFromDocs, file)
    items.push({
      text: readPageTitle(abs, labelMap),
      link: fileToLink(rel)
    })
  }

  if (dirDepth >= MAX_DIR_DEPTH) {
    return items
  }

  for (const dir of dirs) {
    const abs = path.join(absDir, dir)
    const rel = path.join(relDirFromDocs, dir)
    const childItems = buildItems(abs, rel, dirDepth + 1, labelMap, overviewText)
    if (!childItems.length) continue

    items.push({
      text: humanize(dir, labelMap),
      collapsed: true,
      items: childItems
    })
  }

  return items
}

function buildAiSidebar(
  absRoot: string,
  relRoot: string,
  labelMap: Record<string, string>,
  startText: string,
  overviewText: string
): DefaultTheme.SidebarItem[] {
  const topSections = ['concepts', 'tools', 'methodology', 'cases']

  const sidebar: DefaultTheme.SidebarItem[] = [{ text: startText, link: `/${relRoot}/` }]

  for (const section of topSections) {
    const sectionAbs = path.join(absRoot, section)
    if (!fs.existsSync(sectionAbs)) continue

    const sectionText = humanize(section, labelMap)
    const items = buildItems(sectionAbs, path.join(relRoot, section), 1, labelMap, overviewText)
    if (!items.length) continue

    sidebar.push({
      text: sectionText,
      collapsed: false,
      items
    })
  }

  return sidebar
}

function buildOverviewItems(
  absDir: string,
  relDirFromDocs: string,
  labelMap: Record<string, string>
): { text: string; link: string; description: string }[] {
  if (!fs.existsSync(absDir)) return []

  const files = sortDocNames(
    fs
      .readdirSync(absDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md')
      .map((entry) => entry.name),
    relDirFromDocs
  )

  return files.map((file) => {
    const abs = path.join(absDir, file)
    const rel = path.join(relDirFromDocs, file)
    const text = readPageTitle(abs, labelMap)
    return {
      text,
      link: fileToLink(rel),
      description: extractDescription(abs, text)
    }
  })
}

const zhAiSidebar = buildAiSidebar(AI_ROOT, 'ai', ZH_LABEL_MAP, '快速开始', '本章导读')
const enAiSidebar = buildAiSidebar(AI_EN_ROOT, 'en/ai', EN_LABEL_MAP, 'Quick Start', 'Chapter Guide')
const zhConceptOverview = buildOverviewItems(path.join(AI_ROOT, 'concepts'), 'ai/concepts', ZH_LABEL_MAP)
const enConceptOverview = buildOverviewItems(
  path.join(AI_EN_ROOT, 'concepts'),
  'en/ai/concepts',
  EN_LABEL_MAP
)
const ALL_MD_FILES = walkMdFiles(DOCS_ROOT)
const ROUTE_PUBLIC_PATH_BY_NORMALIZED = new Map(
  ALL_MD_FILES.map((absFile) => {
    const relFile = path.relative(DOCS_ROOT, absFile)
    const publicPath = fileToLink(relFile)
    return [normalizePath(publicPath), publicPath]
  })
)

const zhNav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '教程文档', link: '/ai/' },
  { text: '资讯日报', link: '/news/' },
  { text: '社群交流', link: '/community/' }
]

const enNav: DefaultTheme.NavItem[] = [
  { text: 'Home', link: '/en/' },
  { text: 'Docs', link: '/en/ai/' },
  { text: 'News', link: '/en/news/' },
  { text: 'Community', link: '/en/community/' }
]

const zhSidebar: DefaultTheme.Sidebar = {
  '/ai/': zhAiSidebar,
  '/news/': [{ text: '日报资讯', items: [{ text: '资讯首页', link: '/news/' }] }],
  '/community/': [{ text: '社媒交流', items: [{ text: '入口首页', link: '/community/' }] }]
}

const enSidebar: DefaultTheme.Sidebar = {
  '/en/ai/': enAiSidebar,
  '/en/news/': [{ text: 'News', items: [{ text: 'News Home', link: '/en/news/' }] }],
  '/en/community/': [{ text: 'Community', items: [{ text: 'Community Home', link: '/en/community/' }] }]
}

export default defineConfig({
  title: SITE_NAME,
  description: ZH_DESCRIPTION,
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.svg' }],
    ['link', { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLMs.txt' }],
    ['link', { rel: 'alternate', type: 'text/plain', href: '/llms-full.txt', title: 'LLMs Full' }],
    ['meta', { name: 'keywords', content: ZH_KEYWORDS.join(', ') }],
    ['meta', { name: 'author', content: SITE_NAME }],
    ['meta', { name: 'theme-color', content: '#0a7f52' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:image', content: `${SITE_URL}${DEFAULT_OG_IMAGE}` }],
    ['meta', { property: 'og:image:type', content: 'image/svg+xml' }],
    ['meta', { property: 'og:image:alt', content: 'Zero AIGC tutorials' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${SITE_URL}${DEFAULT_OG_IMAGE}` }]
  ],
  sitemap: {
    hostname: SITE_URL
  },
  transformPageData(pageData) {
    if (!pageData.relativePath) return
    const absFile = path.join(DOCS_ROOT, pageData.relativePath)
    if (!fs.existsSync(absFile)) return

    return {
      description:
        pageData.description ||
        pageData.frontmatter.description ||
        extractDescription(absFile, pageData.title)
    }
  },
  transformHead({ pageData }) {
    if (!pageData?.relativePath) return

    const publicPath = inferPublicPath(pageData.relativePath)
    const localeCode = getLocaleCode(publicPath)
    const alternatePath = counterpartPath(publicPath)
    const alternateExists = ROUTE_PUBLIC_PATH_BY_NORMALIZED.has(normalizePath(alternatePath))
    const isLocaleHome = publicPath === '/' || publicPath === '/en/'
    const pageTitle = isLocaleHome
      ? getSiteTitle(publicPath)
      : pageData.title === getSiteTitle(publicPath)
        ? pageData.title
        : `${pageData.title} | ${getSiteTitle(publicPath)}`
    const description = pageData.description || getSiteDescription(publicPath)
    const jsonLd = buildJsonLd(publicPath, pageData.title, description)

    const head: [string, Record<string, string>, string?][] = [
      ['link', { rel: 'canonical', href: toAbsoluteUrl(publicPath) }],
      ['meta', { name: 'description', content: description }],
      ['meta', { name: 'keywords', content: getKeywords(publicPath) }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: toAbsoluteUrl(publicPath) }],
      ['meta', { property: 'og:locale', content: localeCode === 'en-US' ? 'en_US' : 'zh_CN' }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: description }],
      ['script', { type: 'application/ld+json' }, safeJsonLd(jsonLd)]
    ]

    if (alternateExists) {
      head.push(
        ['link', { rel: 'alternate', hreflang: localeCode === 'en-US' ? 'zh-CN' : 'en-US', href: toAbsoluteUrl(alternatePath) }],
        ['link', { rel: 'alternate', hreflang: 'x-default', href: toAbsoluteUrl('/') }],
        ['meta', { property: 'og:locale:alternate', content: localeCode === 'en-US' ? 'zh_CN' : 'en_US' }]
      )
    }

    return head
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        outline: {
          label: '本页目录',
          level: [2, 3]
        },
        returnToTopLabel: '返回顶部',
        docFooter: {
          prev: '上一篇',
          next: '下一篇'
        },
        lastUpdated: {
          text: '最近更新',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short',
            forceLocale: true
          }
        },
        editLink: {
          pattern: 'https://github.com/Percy1010/zero/edit/main/docs/:path',
          text: '编辑此页'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: SITE_NAME_EN,
      description: EN_DESCRIPTION,
      themeConfig: {
        siteTitle: SITE_NAME_EN,
        nav: enNav,
        sidebar: enSidebar,
        outline: {
          label: 'On this page',
          level: [2, 3]
        },
        returnToTopLabel: 'Back to top',
        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },
        lastUpdated: {
          text: 'Last updated',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short',
            forceLocale: true
          }
        },
        editLink: {
          pattern: 'https://github.com/Percy1010/zero/edit/main/docs/:path',
          text: 'Edit this page'
        }
      }
    }
  },
  themeConfig: {
    siteTitle: SITE_NAME,
    conceptOverview: {
      root: zhConceptOverview,
      en: enConceptOverview
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                displayDetails: '显示详情',
                resetButtonTitle: '清空搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '未找到相关结果',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search docs'
              },
              modal: {
                displayDetails: 'Display details',
                resetButtonTitle: 'Clear search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results found',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate',
                  closeText: 'Close'
                }
              }
            }
          }
        }
      }
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/Percy1010/zero' }],
    footer: {
      message: 'From Zero, To Next',
      copyright: `Copyright © ${new Date().getFullYear()} Zero`
    }
  }
})
