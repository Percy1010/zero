import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(ROOT, '..')
const DOCS_ROOT = path.join(PROJECT_ROOT, 'docs')
const mode = process.argv[2] || 'lint'

const FORBIDDEN_MARKERS = [
  '待补',
  '待补二维码',
  'to be added',
  'TODO',
  'FIXME',
  'coming soon',
  'Coming soon'
]

function toPosix(p) {
  return p.split(path.sep).join('/')
}

function walkMdFiles(absDir) {
  const out = []
  const entries = fs.readdirSync(absDir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const abs = path.join(absDir, entry.name)
    if (entry.isDirectory()) out.push(...walkMdFiles(abs))
    if (entry.isFile() && entry.name.endsWith('.md')) out.push(abs)
  }
  return out
}

function fileToLink(relFileFromDocs) {
  const noExt = toPosix(relFileFromDocs).replace(/\.md$/, '')
  if (noExt === 'index') return '/'
  if (noExt.endsWith('/index')) return `/${noExt.slice(0, -'/index'.length)}/`
  return `/${noExt}`
}

function normalizeRoute(route) {
  if (!route) return '/'
  const withSlash = route.startsWith('/') ? route : `/${route}`
  if (withSlash !== '/' && withSlash.endsWith('/')) return withSlash.slice(0, -1)
  return withSlash
}

function collectKnownRoutes(mdFiles) {
  const known = new Set(['/'])
  for (const file of mdFiles) {
    const rel = path.relative(DOCS_ROOT, file)
    const route = fileToLink(rel)
    known.add(route)
    known.add(normalizeRoute(route))
  }
  return known
}

function isKnownRoute(route, known) {
  const normalized = normalizeRoute(route)
  return known.has(route) || known.has(normalized) || known.has(`${normalized}/`)
}

function extractInternalLinks(raw) {
  const links = []
  const regex = /\[[^\]]*?\]\((\/[^)#?\s]*)(?:[#?][^)]*)?\)/g
  let matched = regex.exec(raw)
  while (matched) {
    links.push(matched[1])
    matched = regex.exec(raw)
  }
  return links
}

function runLint() {
  const mdFiles = walkMdFiles(DOCS_ROOT)
  const knownRoutes = collectKnownRoutes(mdFiles)
  const errors = []

  for (const file of mdFiles) {
    const rel = toPosix(path.relative(PROJECT_ROOT, file))
    const raw = fs.readFileSync(file, 'utf-8')

    for (const marker of FORBIDDEN_MARKERS) {
      if (raw.includes(marker)) {
        errors.push(`${rel}: found forbidden placeholder "${marker}"`)
      }
    }

    const links = extractInternalLinks(raw)
    for (const link of links) {
      if (!isKnownRoute(link, knownRoutes)) {
        errors.push(`${rel}: broken internal link "${link}"`)
      }
    }
  }

  if (errors.length) {
    console.error('[lint] failed:')
    for (const err of errors) console.error(`- ${err}`)
    process.exit(1)
  }

  console.log(`[lint] ok (${mdFiles.length} markdown files checked)`)
}

function runTest() {
  const zhAiRoot = path.join(DOCS_ROOT, 'ai')
  const enAiRoot = path.join(DOCS_ROOT, 'en', 'ai')
  const zhHome = path.join(DOCS_ROOT, 'index.md')
  const enHome = path.join(DOCS_ROOT, 'en', 'index.md')

  if (!fs.existsSync(zhHome) || !fs.existsSync(enHome)) {
    console.error('[test] failed: missing homepage markdown for zh or en')
    process.exit(1)
  }

  const zhAiFiles = fs.existsSync(zhAiRoot) ? walkMdFiles(zhAiRoot) : []
  const enAiFiles = fs.existsSync(enAiRoot) ? walkMdFiles(enAiRoot) : []

  if (!zhAiFiles.length || !enAiFiles.length) {
    console.error('[test] failed: missing AI markdown files for zh or en')
    process.exit(1)
  }

  console.log(`[test] ok (zh ai: ${zhAiFiles.length}, en ai: ${enAiFiles.length})`)
}

if (mode === 'lint') runLint()
else if (mode === 'test') runTest()
else {
  console.error(`Unknown mode: ${mode}`)
  process.exit(1)
}
