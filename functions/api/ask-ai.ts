interface Env {
  DOMESTIC_BASE_URL?: string
  DOMESTIC_API_KEY?: string
  DOMESTIC_MODEL?: string
  DOMESTIC_SYSTEM_PROMPT?: string

  INTERNATIONAL_BASE_URL?: string
  INTERNATIONAL_API_KEY?: string
  INTERNATIONAL_MODEL?: string
  INTERNATIONAL_SYSTEM_PROMPT?: string

  DEFAULT_SYSTEM_PROMPT?: string
}

type Provider = 'domestic' | 'international'

type AskRequest = {
  provider?: Provider
  question?: string
  route?: string
  context?: Array<{ title?: string; path?: string; snippet?: string; content?: string }>
  history?: Array<{ role?: string; content?: string }>
}

type ProviderConfig = {
  baseUrl: string
  apiKey: string
  model: string
  systemPrompt: string
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  })
}

function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, '')
  if (trimmed.endsWith('/chat/completions')) return trimmed
  return `${trimmed}/chat/completions`
}

function pickProviderConfig(provider: Provider, env: Env): ProviderConfig | null {
  const defaultPrompt =
    env.DEFAULT_SYSTEM_PROMPT ||
    '你是 Zero 网站的学习助教。请优先基于站内文档回答，回答要准确、简洁，并给出可执行建议。'

  if (provider === 'domestic') {
    if (!env.DOMESTIC_BASE_URL || !env.DOMESTIC_API_KEY || !env.DOMESTIC_MODEL) return null
    return {
      baseUrl: normalizeBaseUrl(env.DOMESTIC_BASE_URL),
      apiKey: env.DOMESTIC_API_KEY,
      model: env.DOMESTIC_MODEL,
      systemPrompt: env.DOMESTIC_SYSTEM_PROMPT || defaultPrompt
    }
  }

  if (!env.INTERNATIONAL_BASE_URL || !env.INTERNATIONAL_API_KEY || !env.INTERNATIONAL_MODEL) return null
  return {
    baseUrl: normalizeBaseUrl(env.INTERNATIONAL_BASE_URL),
    apiKey: env.INTERNATIONAL_API_KEY,
    model: env.INTERNATIONAL_MODEL,
    systemPrompt: env.INTERNATIONAL_SYSTEM_PROMPT || defaultPrompt
  }
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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as AskRequest
    const question = (body.question || '').trim()

    if (!question) {
      return json({ error: '问题不能为空' }, 400)
    }

    const provider: Provider = body.provider === 'international' ? 'international' : 'domestic'
    const providerConfig = pickProviderConfig(provider, context.env)

    if (!providerConfig) {
      return json({ error: `未配置${provider === 'domestic' ? '国内' : '国际'}模型环境变量` }, 500)
    }

    const contextPrompt = buildContextPrompt(body.route || '/', body.context || [])
    const history = normalizeHistory(body.history)

    const messages = [
      { role: 'system', content: providerConfig.systemPrompt },
      { role: 'system', content: contextPrompt },
      ...history,
      { role: 'user', content: question }
    ]

    const upstreamRes = await fetch(providerConfig.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${providerConfig.apiKey}`
      },
      body: JSON.stringify({
        model: providerConfig.model,
        messages,
        temperature: 0.4,
        max_tokens: 900
      })
    })

    if (!upstreamRes.ok) {
      const text = await upstreamRes.text()
      return json({ error: '上游模型请求失败', detail: text.slice(0, 500) }, 502)
    }

    const data = (await upstreamRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }

    const answer = data?.choices?.[0]?.message?.content?.trim()
    if (!answer) {
      return json({ error: '模型未返回有效内容' }, 502)
    }

    return json({ answer, provider })
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    return json({ error: '请求处理失败', detail: message }, 500)
  }
}
