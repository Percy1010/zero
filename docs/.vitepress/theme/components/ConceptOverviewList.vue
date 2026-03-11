<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

type ConceptOverviewItem = {
  text: string
  link: string
  description: string
}

const { page, theme } = useData()

const localeKey = computed(() => (page.value.relativePath.startsWith('en/') ? 'en' : 'root'))
const items = computed<ConceptOverviewItem[]>(() => {
  return theme.value.conceptOverview?.[localeKey.value] || []
})
</script>

<template>
  <div class="concept-overview-list">
    <ol v-if="items.length" class="concept-overview-plain-list">
      <li v-for="item in items" :key="item.link">
        <a :href="item.link">{{ item.text }}</a>
      </li>
    </ol>
    <p v-else class="concept-overview-empty">当前还没有可展示的概念文档。</p>
  </div>
</template>
