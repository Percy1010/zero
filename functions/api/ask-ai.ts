interface Env {
  AI_ROUTES?: string
  AI_BASE_URL?: string
  AI_API_KEY?: string
  AI_MODEL?: string
  AI_BASE_URLS?: string
  AI_API_KEYS?: string
  AI_MODELS?: string
  AI_SYSTEM_PROMPT?: string
  AI_TIMEOUT_MS?: string

  DOMESTIC_BASE_URL?: string
  DOMESTIC_API_KEY?: string
  DOMESTIC_MODEL?: string
  INTERNATIONAL_BASE_URL?: string
  INTERNATIONAL_API_KEY?: string
  INTERNATIONAL_MODEL?: string
}

type AskRequest = {
  question?: string
  route?: string
  context?: Array<{ title?: string; path?: string; snippet?: string; content?: string }>
  history?: Array<{ role?: string; content?: string }>
}

type RouteConfig = {
  baseUrl: string
  apiKey: string
  model: string
}

let routeCursor = 0

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  })
}

function splitList(value?: string): string[] {
  if (!value) return []
  return value
    .split(/[\n,;，；]/)
    .map((v) => v.trim())
    .filter(Boolean)
}

function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, '')
  if (/\/chat\/completions$/i.test(trimmed)) return trimmed
  if (/\/v\d+$/i.test(trimmed)) return `${trimmed}/chat/completions`
  return `${trimmed}/v1/chat/completions`
}

function normalizeModel(model?: string): string {
  return (model || '').trim() || 'gpt-4o-mini'
}

function pushRoute(routes: RouteConfig[], baseUrl?: string, apiKey?: string, model?: string) {
  const b = (baseUrl || '').trim()
  const k = (apiKey || '').trim()
  if (!b || !k) return
  routes.push({
    baseUrl: normalizeBaseUrl(b),
    apiKey: k,
    model: normalizeModel(model)
  })
}

function parseRoutesJson(raw?: string): RouteConfig[] {
  if (!raw?.trim()) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const routes: RouteConfig[] = []

    for (const item of parsed) {
      if (!item || typeof item !== 'object') continue
      const obj = item as Record<string, unknown>
      const baseUrl = String(obj.baseUrl ?? obj.base_url ?? '')
      const apiKey = String(obj.apiKey ?? obj.api_key ?? '')
      const model = String(obj.model ?? '')
      pushRoute(routes, baseUrl, apiKey, model)
    }

    return routes
  } catch {
    return []
  }
}

function rotateRoutes(routes: RouteConfig[]): RouteConfig[] {
  if (routes.length <= 1) return routes
  const start = routeCursor % routes.length
  routeCursor = (routeCursor + 1) % routes.length
  return [...routes.slice(start), ...routes.slice(0, start)]
}

function buildRouteConfigs(env: Env): RouteConfig[] {
  const jsonRoutes = parseRoutesJson(env.AI_ROUTES)
  if (jsonRoutes.length) {
    return rotateRoutes(jsonRoutes)
  }

  const routes: RouteConfig[] = []

  // Single-route envs
  pushRoute(routes, env.AI_BASE_URL, env.AI_API_KEY, env.AI_MODEL)

  // Multi-route envs
  const bases = splitList(env.AI_BASE_URLS)
  const keys = splitList(env.AI_API_KEYS)
  const models = splitList(env.AI_MODELS)

  if (bases.length && keys.length) {
    const count = Math.max(bases.length, keys.length, models.length || 1)

    for (let i = 0; i < count; i += 1) {
      const base = bases[i] ?? bases[bases.length - 1]
      const key = keys[i] ?? keys[keys.length - 1]
      const model = models[i] ?? models[models.length - 1] ?? 'gpt-4o-mini'
      pushRoute(routes, base, key, model)
    }
  }

  // Legacy envs
  if (env.DOMESTIC_BASE_URL && env.DOMESTIC_API_KEY && env.DOMESTIC_MODEL) {
    pushRoute(routes, env.DOMESTIC_BASE_URL, env.DOMESTIC_API_KEY, env.DOMESTIC_MODEL)
  }
  if (env.INTERNATIONAL_BASE_URL && env.INTERNATIONAL_API_KEY && env.INTERNATIONAL_MODEL) {
    pushRoute(routes, env.INTERNATIONAL_BASE_URL, env.INTERNATIONAL_API_KEY, env.INTERNATIONAL_MODEL)
  }

  // De-duplicate exact same route triplets
  const seen = new Set<string>()
  const deduped = routes.filter((r) => {
    const key = `${r.baseUrl}|${r.apiKey}|${r.model}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return rotateRoutes(deduped)
}

function buildContextPrompt(route: string, context: NonNullable<AskRequest['context']>): string {
  const contextText = context
    .slice(0, 6)
    .map((item, idx) => {
      const title = item.title || '未命名文档'
      const path = item.path || '/'
      const snippet = item.snippet || ''
      const content = item.content || ''
      return `${idx + 1}. ${title} (${path})\n摘要：${snippet}\n内容片段：${content}`
    })
    .join('\n\n')

  return [
    `当前页面路径：${route || '/'}`,
    '以下是站内检索到的参考内容，请优先使用这些内容回答并引用来源：',
    contextText || '（没有检索到有效上下文）',
    '回答要求：',
    '1. 使用中文。',
    '2. 先给结论，再给步骤。',
    '3. 若信息不足，明确说明站内文档未覆盖。',
    '4. 有引用时请标注文档标题。'
  ].join('\n')
}

function normalizeHistory(history: AskRequest['history']) {
  if (!Array.isArray(history)) return []
  return history
    .filter((h) => h && typeof h.content === 'string' && typeof h.role === 'string')
    .filter((h) => h.role === 'user' || h.role === 'assistant')
    .slice(-6)
    .map((h) => ({ role: h.role as 'user' | 'assistant', content: h.content as string }))
}

async function callRoute(
  route: RouteConfig,
  question: string,
  contextPrompt: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string,
  timeoutMs: number
): Promise<{ ok: true; answer: string } | { ok: false; reason: string }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const upstreamRes = await fetch(route.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${route.apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: route.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'system', content: contextPrompt },
          ...history,
          { role: 'user', content: question }
        ],
        temperature: 0.4,
        max_tokens: 900
      })
    })

    if (!upstreamRes.ok) {
      const text = await upstreamRes.text()
      return { ok: false, reason: `HTTP ${upstreamRes.status}: ${text.slice(0, 180)}` }
    }

    const data = (await upstreamRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }

    const answer = data?.choices?.[0]?.message?.content?.trim()
    if (!answer) {
      return { ok: false, reason: '模型未返回有效内容' }
    }

    return { ok: true, answer }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    return { ok: false, reason: message }
  } finally {
    clearTimeout(timer)
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as AskRequest
    const question = (body.question || '').trim()

    if (!question) {
      return json({ error: '问题不能为空' }, 400)
    }

    const routes = buildRouteConfigs(context.env)
    if (!routes.length) {
      return json(
        {
          error: '未配置可用模型路由',
          detail:
            '请配置 AI_ROUTES(JSON) 或 AI_BASE_URL+AI_API_KEY(+AI_MODEL) 或 AI_BASE_URLS+AI_API_KEYS(+AI_MODELS)'
        },
        500
      )
    }

    const timeoutMs = Number(context.env.AI_TIMEOUT_MS || '25000')
    const systemPrompt =
      context.env.AI_SYSTEM_PROMPT ||
      '你是 Zero 网站的学习助教。请优先基于站内文档回答，回答要准确、简洁，并给出可执行建议。'

    const contextPrompt = buildContextPrompt(body.route || '/', body.context || [])
    const history = normalizeHistory(body.history)

    const errors: string[] = []
    for (let i = 0; i < routes.length; i += 1) {
      const result = await callRoute(routes[i], question, contextPrompt, history, systemPrompt, timeoutMs)
      if (result.ok) {
        return json({ answer: result.answer, routeIndex: i + 1, routeCount: routes.length })
      }
      errors.push(`route#${i + 1}: ${result.reason}`)
    }

    return json(
      {
        error: '所有模型路由均失败',
        detail: errors.join(' | ').slice(0, 1200)
      },
      502
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    return json({ error: '请求处理失败', detail: message }, 500)
  }
}
