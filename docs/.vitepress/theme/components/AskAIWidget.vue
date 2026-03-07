<template>
  <section class="ask-ai-widget">
    <h3>问 AI（MVP）</h3>
    <p class="desc">输入问题后，系统会先在站内文档中检索相关片段，再生成可复制的提问上下文。</p>

    <textarea v-model="question" placeholder="例如：AIGC 新手应该先学哪些内容？" rows="4" />

    <div class="actions">
      <button @click="search" :disabled="!question.trim() || loading">{{ loading ? '检索中...' : '检索知识库' }}</button>
      <button @click="copyPrompt" :disabled="!promptText">复制上下文</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="matches.length" class="results">
      <h4>命中文档</h4>
      <ul>
        <li v-for="item in matches" :key="item.path">
          <a :href="item.path">{{ item.title }}</a>
          <span class="snippet">{{ item.snippet }}</span>
        </li>
      </ul>
    </div>

    <div v-if="promptText" class="prompt-box">
      <h4>推荐提问上下文</h4>
      <pre>{{ promptText }}</pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type KnowledgeItem = {
  title: string
  path: string
  tags: string[]
  snippet: string
}

const question = ref('')
const loading = ref(false)
const error = ref('')
const dataset = ref<KnowledgeItem[]>([])
const matches = ref<KnowledgeItem[]>([])
const promptText = ref('')

onMounted(async () => {
  try {
    const res = await fetch('/knowledge-base.json')
    if (!res.ok) throw new Error('知识库加载失败')
    dataset.value = await res.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '知识库加载失败'
  }
})

function tokenize(input: string): string[] {
  const clean = input.toLowerCase().replace(/[，。！？、,.!?]/g, ' ')
  return clean.split(/\s+/).filter(Boolean)
}

function score(item: KnowledgeItem, tokens: string[]): number {
  const text = `${item.title} ${item.tags.join(' ')} ${item.snippet}`.toLowerCase()
  return tokens.reduce((sum, token) => (text.includes(token) ? sum + 1 : sum), 0)
}

function buildPrompt(q: string, topItems: KnowledgeItem[]): string {
  const references = topItems
    .map((item, index) => `${index + 1}. ${item.title} (${item.path})\n   摘要: ${item.snippet}`)
    .join('\n')

  return `你是 Zeroto 网站的学习助教。请只基于以下参考内容回答问题，并明确给出引用来源。\n\n用户问题：${q}\n\n参考内容：\n${references}\n\n回答要求：\n1. 先给结论，再给步骤。\n2. 用中文回答，面向零基础用户。\n3. 标注引用来源（按序号）。\n4. 若内容不足，请明确说明“当前文档没有覆盖”。`
}

function search() {
  error.value = ''
  loading.value = true

  try {
    const tokens = tokenize(question.value)
    if (!tokens.length) {
      matches.value = []
      promptText.value = ''
      return
    }

    const ranked = dataset.value
      .map((item) => ({ item, s: score(item, tokens) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 5)
      .map((x) => x.item)

    matches.value = ranked
    promptText.value = ranked.length ? buildPrompt(question.value, ranked) : ''

    if (!ranked.length) {
      error.value = '未命中站内文档，请换个关键词或先使用站内搜索。'
    }
  } finally {
    loading.value = false
  }
}

async function copyPrompt() {
  if (!promptText.value) return
  await navigator.clipboard.writeText(promptText.value)
}
</script>

<style scoped>
.ask-ai-widget {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 16px;
  margin-top: 16px;
}

.desc {
  color: var(--vp-c-text-2);
}

textarea {
  width: 100%;
  margin: 12px 0;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  padding: 10px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

button {
  border: 1px solid var(--vp-c-divider);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  background: var(--vp-c-bg-soft);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #c0392b;
}

.results ul {
  margin: 8px 0;
  padding-left: 18px;
}

.snippet {
  display: block;
  color: var(--vp-c-text-2);
}

.prompt-box {
  margin-top: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 12px;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}
</style>
