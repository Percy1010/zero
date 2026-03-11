---
title: 提示词(Prompt)
description: 用通俗方式解释 Prompt 是什么、它为什么不是“咒语”、一个好 Prompt 通常包含哪些部分，以及新手最容易犯的错误。
---

# 提示词(Prompt)

提示词的英文是 `Prompt`。你可以先把它理解成：**你给 AI 的任务说明书**。

## Prompt 是什么

Prompt 不是魔法咒语，而是你告诉模型“你要做什么、根据什么做、最后怎么输出”的方式。

## 一个更容易理解的类比

把 AI 想成实习生时，Prompt 就像你交给实习生的任务单。

如果你只说一句“帮我写点东西”，大概率会得到很泛的结果。如果你说清楚角色、任务、格式和标准，结果通常会好很多。

## 一个 Prompt 通常包含什么

最基础的 Prompt 通常包括这几部分：

1. 角色
2. 任务
3. 背景
4. 约束
5. 输出形式
6. 验收标准

## 为什么 Prompt 会影响结果

因为模型不是读心术。它只能根据你提供的文字去推测任务边界。

Prompt 写得越模糊，模型越容易：

- 理解错任务
- 忽略重点
- 自己补充你没要求的内容
- 输出结构不稳定

## Prompt 和普通提问有什么区别

普通提问更像“问一句话”。Prompt 更像“定义一个任务系统”。

## 新手最容易犯的错误

### 误区一：把 Prompt 当成神秘技巧

真正重要的不是花哨，而是清楚。

### 误区二：只给任务，不给标准

如果你不说什么叫“好结果”，模型只能自己猜。

### 误区三：把所有要求一次性堆进去

太长、太乱的 Prompt 也会让重点被冲淡。好的 Prompt 不是越长越好，而是越清晰越好。

## 你现在只需要记住什么

- Prompt 是任务说明书，不是咒语
- 好 Prompt 的核心是降低歧义
- 写清楚任务、背景、约束和输出格式，效果通常会更稳定

## 参考资料

- OpenAI Prompting Guide
  - https://platform.openai.com/docs/guides/prompting
- Anthropic Prompt Engineering Overview
  - https://docs.anthropic.com/en/docs/prompt-engineering
