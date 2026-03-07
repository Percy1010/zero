import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import FloatingAskAI from './components/FloatingAskAI.vue'
import './style/custom.css'

const theme: Theme = {
  ...DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(FloatingAskAI)
    })
}

export default theme
