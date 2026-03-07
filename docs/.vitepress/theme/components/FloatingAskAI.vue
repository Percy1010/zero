<template>
  <div>
    <button class="chat-fab" @click="open = true" aria-label="打开问AI" title="问AI">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3C6.48 3 2 6.94 2 11.8c0 2.65 1.34 5.02 3.45 6.62L4.8 22l4.05-1.9c.99.27 2.05.42 3.15.42 5.52 0 10-3.94 10-8.8S17.52 3 12 3zm-4 7h8a1 1 0 110 2H8a1 1 0 010-2zm0 4h5a1 1 0 110 2H8a1 1 0 010-2z"
          fill="currentColor"
        />
      </svg>
    </button>

    <div v-if="open" class="chat-mask" @click="open = false" />

    <aside class="chat-drawer" :class="{ open }" aria-live="polite">
      <header class="drawer-header">
        <div>
          <strong>问 AI</strong>
          <p>先检索本站文档，再调用模型回答</p>
        </div>
        <div class="header-actions">
          <select v-model="provider" aria-label="模型线路">
            <option value="domestic">国内模型</option>
            <option value="international">国际模型</option>
          </select>
          <button class="close-btn" @click="open = false" aria-label="关闭">×</button>
        </div>
      </header>

      <section class="messages" ref="messagesRef">
        <article v-for="(m, idx) in messages" :key="`${m.role}-${idx}`" :class="['msg', m.role]">
          <p>{{ m.content }}</p>
          <ul v-if="m.sources?.length" class="sources">
            <li v-for="source in m.sources" :key="source.path">
              <a :href="source.path" target="_self">{{ source.title }}</a>
            </li>
          </ul>
        </article>

        <article v-if="loading" class="msg assistant">
          <p>正在检索并生成回答...</p>
        </article>
      </section>

      <footer class="composer">
        <p class="hint">提示：回答会优先基于站内文档，请对关键结论做二次核验。</p>
        <textarea
          v-model="question"
          placeholder="请输入问题，按 Enter 发送，Shift+Enter 换行。"
          rows="3"
          @keydown.enter.exact.prevent="send"
        />
        <div class="composer-actions">
          <button @click="send" :disabled="!question.trim() || loading">发送</button>
        </div>
      </footer>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

type Provider = 'domestic' | 'international'

type KnowledgeItem = {
  domain: string
  module: string
  title: string
  path: string
  tags: string[]
  snippet: string
  content: string
}

type SourceItem = {
  title: string
  path: string
}

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  sources?: SourceItem[]
}

const route = useRoute()
const open = ref(false)
const question = ref('')
const loading = ref(false)
const provider = ref<Provider>('domestic')
const messagesRef = ref<HTMLElement | null>(null)
const knowledge = ref<KnowledgeItem[]>([])
const messages = ref<ChatMessage[]>([
  {
    role: 'assistant',
    content: '你好，我会先检索本站内容，再结合你选择的模型线路为你解答。'
  }
])

watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  }
)

onMounted(async () => {
  const kbRes = await fetch('/knowledge-base.json').catch(() => null)
  if (kbRes?.ok) {
    knowledge.value = await kbRes.json()
  }
})

function tokenize(input: string): string[] {
  return (input.toLowerCase().match(/[\u4e00-\u9fa5]{1,3}|[a-z0-9-]+/g) || []).filter(Boolean)
}

function currentDomain(path: string): string {
  if (path.startsWith('/ai/')) return 'ai'
  return 'global'
}

function retrieve(query: string): KnowledgeItem[] {
  const tokens = tokenize(query)
  if (!tokens.length) return []

  const domain = currentDomain(route.path)
  const candidates = knowledge.value.filter((item) => item.domain === domain || item.domain === 'global')

  return candidates
    .map((item) => {
      const haystack = `${item.title} ${item.tags.join(' ')} ${item.snippet} ${item.content}`.toLowerCase()
      const score = tokens.reduce((sum, token) => (haystack.includes(token) ? sum + 1 : sum), 0)
      return { item, score }
    })
    .filter((v) => v.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((v) => v.item)
}

function fallbackAnswer(query: string, refs: KnowledgeItem[]): string {
  if (!refs.length) {
    return `我暂时没有在站内检索到与你问题“${query}”直接匹配的内容。建议换更宽泛关键词，或先进入 AIGC 文档页提问。`
  }

  const bullets = refs.map((r, i) => `${i + 1}. ${r.title}：${r.snippet}`).join('\n')
  return `当前模型接口不可用，我先给你站内检索结果：\n\n${bullets}\n\n建议下一步：\n- 先从第 1 条开始，今天做一个最小实践。`
}

async function askEndpoint(query: string, refs: KnowledgeItem[]): Promise<string | null> {
  try {
    const res = await fetch('/api/ask-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        provider: provider.value,
        question: query,
        route: route.path,
        context: refs.map((r) => ({ title: r.title, path: r.path, snippet: r.snippet, content: r.content })),
        history: messages.value.slice(-8)
      })
    })

    if (!res.ok) return null
    const data = await res.json()
    if (typeof data?.answer === 'string' && data.answer.trim()) {
      return data.answer
    }
    return null
  } catch {
    return null
  }
}

async function send() {
  const q = question.value.trim()
  if (!q || loading.value) return

  messages.value.push({ role: 'user', content: q })
  question.value = ''
  loading.value = true

  const refs = retrieve(q)
  const endpointAnswer = await askEndpoint(q, refs)
  const answer = endpointAnswer || fallbackAnswer(q, refs)

  messages.value.push({
    role: 'assistant',
    content: answer,
    sources: refs.map((r) => ({ title: r.title, path: r.path }))
  })

  loading.value = false
}
</script>

<style scoped>
.chat-fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 30;
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 999px;
  background: var(--vp-c-brand-1);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.chat-fab svg {
  width: 26px;
  height: 26px;
}

.chat-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  z-index: 40;
}

.chat-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: min(420px, 95vw);
  height: 100vh;
  background: var(--vp-c-bg);
  border-left: 1px solid var(--vp-c-divider);
  z-index: 50;
  transform: translateX(100%);
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;
}

.chat-drawer.open {
  transform: translateX(0);
}

.drawer-header {
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.drawer-header p {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

select {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 4px 8px;
  font-family: inherit;
}

.close-btn {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  width: 28px;
  height: 28px;
  cursor: pointer;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.msg {
  border-radius: 10px;
  padding: 10px 12px;
  max-width: 92%;
}

.msg p {
  margin: 0;
  white-space: pre-wrap;
}

.msg.user {
  background: var(--vp-c-brand-soft);
  align-self: flex-end;
}

.msg.assistant {
  background: var(--vp-c-bg-soft);
  align-self: flex-start;
}

.sources {
  margin: 8px 0 0;
  padding-left: 18px;
}

.composer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 12px;
}

.hint {
  color: var(--vp-c-text-2);
  font-size: 12px;
  margin: 0 0 8px;
}

textarea {
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px;
  font-family: inherit;
}

.composer-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

.composer-actions button {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
}

.composer-actions button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
