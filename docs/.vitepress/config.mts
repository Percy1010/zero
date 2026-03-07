import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Zeroto 零点',
  description: '职业人士教程站，第一版聚焦 AIGC。',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'keywords', content: 'AIGC,教程,职业学习,Prompt,AI工具' }],
    ['meta', { property: 'og:type', content: 'website' }]
  ],
  themeConfig: {
    siteTitle: 'Zeroto 零点',
    nav: [
      { text: '首页', link: '/' },
      { text: 'AIGC 文档', link: '/ai/' },
      { text: '日报资讯', link: '/news/' },
      { text: '社媒交流', link: '/community/' }
    ],
    sidebar: {
      '/ai/': [
        {
          text: 'AIGC 总览',
          items: [
            { text: '开始学习', link: '/ai/' }
          ]
        },
        {
          text: '概念篇',
          collapsed: false,
          items: [
            { text: '概览', link: '/ai/concepts/' },
            { text: '什么是 AIGC', link: '/ai/concepts/what-is-aigc' }
          ]
        },
        {
          text: '工具篇',
          collapsed: false,
          items: [
            { text: '概览', link: '/ai/tools/' },
            {
              text: '文档类工具',
              collapsed: true,
              items: [
                {
                  text: '写作类',
                  collapsed: true,
                  items: [
                    { text: '语法助手', link: '/ai/tools/document/writing/grammar-assistant' }
                  ]
                }
              ]
            },
            {
              text: '编程类工具',
              collapsed: true,
              items: [
                {
                  text: 'IDE 类',
                  collapsed: true,
                  items: [
                    { text: 'Cursor', link: '/ai/tools/coding/ide/cursor' }
                  ]
                }
              ]
            }
          ]
        },
        {
          text: '方法论',
          items: [{ text: '概览', link: '/ai/methodology/' }]
        },
        {
          text: '案例篇',
          items: [{ text: '概览', link: '/ai/cases/' }]
        },
        {
          text: '开源项目',
          items: [{ text: '概览', link: '/ai/opensource/' }]
        },
        {
          text: '资源推荐',
          items: [{ text: '概览', link: '/ai/resources/' }]
        },
        {
          text: '经验实录',
          items: [{ text: '概览', link: '/ai/logs/' }]
        }
      ],
      '/news/': [
        { text: '日报资讯', items: [{ text: '资讯首页', link: '/news/' }] }
      ],
      '/community/': [
        { text: '社媒交流', items: [{ text: '入口首页', link: '/community/' }] }
      ]
    },
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-name/zeroto' }
    ],
    outline: {
      label: '本页目录',
      level: [2, 3]
    },
    returnToTopLabel: '返回顶部',
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    editLink: {
      pattern: 'https://github.com/your-name/zeroto/edit/main/docs/:path',
      text: '编辑此页'
    },
    footer: {
      message: 'From Zero, To Next',
      copyright: `Copyright © ${new Date().getFullYear()} Zeroto`
    }
  }
})
