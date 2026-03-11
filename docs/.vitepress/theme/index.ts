import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ConceptOverviewList from './components/ConceptOverviewList.vue'
import './style/custom.css'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ConceptOverviewList', ConceptOverviewList)
  }
}

export default theme
