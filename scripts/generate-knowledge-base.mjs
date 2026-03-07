import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(ROOT, '..')
const DOCS_ROOT = path.join(PROJECT_ROOT, 'docs')
const AI_ROOT = path.join(DOCS_ROOT, 'ai')
const OUTPUT = path.join(DOCS_ROOT, 'public', 'knowledge-base.json')

function toPosix(p) {
  return p.split(path.sep).join('/')
}

function toLink(relFromDocs) {
  const noExt = toPosix(relFromDocs).replace(/\.md$/, '')
  if (noExt.endsWith('/index')) return `/${noExt.slice(0, -'/index'.length)}/`
  return `/${noExt}`
}

function walkMdFiles(absDir) {
  const out = []
  const entries = fs.readdirSync(absDir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue
    const abs = path.join(absDir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkMdFiles(abs))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(abs)
    }
  }
  return out
}

function stripFrontmatter(raw) {
  if (!raw.startsWith('---\n')) return raw
  const end = raw.indexOf('\n---\n', 4)
  if (end === -1) return raw
  return raw.slice(end + 5)
}

function pickTitle(raw, absFile) {
  const fmTitle = raw.match(/^---[\s\S]*?\ntitle:\s*(.+)\n[\s\S]*?---/m)
  if (fmTitle?.[1]) return fmTitle[1].trim().replace(/^['"]|['"]$/g, '')
  const h1 = raw.match(/^#\s+(.+)$/m)
  if (h1?.[1]) return h1[1].trim()
  return path.basename(absFile, '.md')
}

function extractTextLines(raw) {
  const content = stripFrontmatter(raw)
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && !line.startsWith('```') && !line.startsWith(':::'))
}

function summarize(raw) {
  const lines = extractTextLines(raw)
  const snippet = (lines[0] || '').slice(0, 80)
  const content = lines.slice(0, 3).join(' ').slice(0, 220)
  return { snippet, content }
}

function inferTags(relFromDocs) {
  const parts = toPosix(relFromDocs).split('/').filter(Boolean)
  return parts.slice(0, -1)
}

function buildAiItems() {
  if (!fs.existsSync(AI_ROOT)) return []
  const files = walkMdFiles(AI_ROOT)
  const items = []

  for (const absFile of files) {
    const raw = fs.readFileSync(absFile, 'utf-8')
    const relFromDocs = path.relative(DOCS_ROOT, absFile)
    const relParts = toPosix(relFromDocs).split('/')
    const module = relParts.length >= 3 ? relParts[1] : 'ai'
    const { snippet, content } = summarize(raw)

    items.push({
      domain: 'ai',
      module,
      title: pickTitle(raw, absFile),
      path: toLink(relFromDocs),
      tags: inferTags(relFromDocs),
      snippet,
      content
    })
  }

  return items
}

function buildGlobalItem(relFile, title, tags) {
  const abs = path.join(DOCS_ROOT, relFile)
  if (!fs.existsSync(abs)) return null
  const raw = fs.readFileSync(abs, 'utf-8')
  const { snippet, content } = summarize(raw)
  return {
    domain: 'global',
    module: relFile.split('/')[0],
    title,
    path: toLink(relFile),
    tags,
    snippet,
    content
  }
}

function main() {
  const aiItems = buildAiItems().sort((a, b) => a.path.localeCompare(b.path, 'zh-Hans-CN'))
  const globalItems = [
    buildGlobalItem('news/index.md', '日报资讯', ['资讯']),
    buildGlobalItem('community/index.md', '社媒交流', ['社群'])
  ].filter(Boolean)

  const all = [...aiItems, ...globalItems]
  fs.writeFileSync(OUTPUT, `${JSON.stringify(all, null, 2)}\n`, 'utf-8')
  console.log(`[knowledge-base] generated ${all.length} items -> ${path.relative(PROJECT_ROOT, OUTPUT)}`)
}

main()
