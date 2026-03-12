---
title: 提示词(Prompt)
description: 深入解释 Prompt 和 Prompt Engineering 是什么、一个好 Prompt 如何组成、常见技巧有哪些，以及它们在真实业务里的具体应用方式。
---

# 提示词(Prompt)

## 一、是什么？

### 一句话定义

提示词 `Prompt`，就是你输入给 AI 模型的指令、问题、背景、限制条件和格式要求。  
提示词工程 `Prompt Engineering`，则是研究如何构造和迭代 Prompt，让模型输出更稳定、更符合需求的一套方法。

## 二、工作原理

你的 Prompt 越清晰、具体、没有歧义，模型越容易给出符合预期的答案。

## 三、一个完整 Prompt 的组成结构

```text
① 角色设定
② 背景 / 上下文
③ 任务指令
④ 格式要求
⑤ 示例
```

## 四、核心技巧

| 技巧名称 | 怎么做 | 适用场景 |
| --- | --- | --- |
| 角色扮演 | 「你是一位有 10 年经验的律师」 | 让回答更专业 |
| 思维链（CoT） | 「请一步步思考」 | 复杂推理、数学题 |
| 少样本提示 | 给 2-3 个示例 | 让 AI 模仿特定风格 |
| 提示链 | 把复杂任务拆成多步 | 长篇写作、复杂分析 |

## 五、通俗比喻

- Prompt 像点菜
- Prompt Engineering 像面试官的提问技巧
- Prompt 像导航目的地

## 六、实战案例

### 差的 Prompt

```text
帮我写个文案
```

### 更好的 Prompt

```text
你是一位资深的母婴电商运营专家。我们即将上线一款婴儿湿巾新品，
主打天然有机、无添加、超柔软。请为我撰写一条小红书推广文案，要求:
1. 字数在 150-200 字之间
2. 语气亲切、口语化
3. 包含至少 2 个 emoji
4. 结尾带 3 个相关标签
```

## 七、业务场景应用

| 业务场景 | Prompt 示例 |
| --- | --- |
| 客服标准回复 | 按固定结构回复投诉 |
| 周报生成 | 按固定栏目输出 |
| 会议纪要 | 提取议题、决议、待办、负责人 |
| 数据分析 | 找趋势并给可执行建议 |

## 八、你现在只需要记住什么

- Prompt 是任务说明书，不是神秘咒语
- Prompt Engineering 的核心是减少歧义、提升稳定性
- 不会写代码的人，也能通过 Prompt 驱动大模型

## 九、推荐阅读

- Prompt Engineering Guide: https://www.promptingguide.ai/zh
- 菜鸟教程 Prompt Engineering: https://www.runoob.com/ai-agent/prompt-engineering.html
- 阿里云百炼 Prompt 教程: https://help.aliyun.com/zh/model-studio/prompt-engineering-guide
- GitHub 提示词工程资源: https://github.com/yunwei37/Prompt-Engineering-Guide-zh-CN
