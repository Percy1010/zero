---
title: 函数调用(Function Calling)
description: 用通俗方式解释 Function Calling 是什么、它为什么让 AI 从“会说”变成“会做”、基本流程是什么，以及它和 MCP、插件的区别。
---

# 函数调用(Function Calling)

`Function Calling` 通常翻译成“函数调用”。你可以先把它理解成：**模型判断“这个任务需要外部能力”，然后请求宿主程序去调用某个函数或工具**。

## Function Calling 是什么

Function Calling 让模型不只是“回答你”，还可以“请求系统替它做事”。

## 用什么类比最好懂

你可以把模型想成前台接待：

- 它负责理解你的需求
- 但真正去拿快递、查系统、打印文件的人，不是前台自己，而是后面的具体部门

## 它到底解决了什么问题

如果没有 Function Calling，模型大多只能“生成文字”。有了 Function Calling，模型就能参与更复杂的流程，例如查天气、搜网页、读文件、调数据库和调业务 API。

## 基本流程是什么

一个典型流程通常是：

1. 应用把可用函数或工具告诉模型
2. 模型判断当前任务要不要调用某个函数
3. 应用执行该函数
4. 应用把执行结果回传给模型
5. 模型基于结果继续输出最终答案

## 它和插件有什么区别

- Function Calling 更像“调用能力的机制”
- 插件更像“被接入的具体扩展模块”

## 它和 MCP 又有什么区别

- Function Calling 解决“模型怎么请求外部能力”
- MCP 更像在解决“不同外部工具和数据源怎么用统一协议接入”

## 常见误区

### 误区一：模型自己会调用网络

不完全对。模型通常只是“提出调用请求”，真正联网的是外部程序。

### 误区二：有了 Function Calling 就一定更安全

不一定。它反而让权限边界更重要，因为一旦工具开放得太多，模型能触发的动作范围也会变大。

## 你现在只需要记住什么

- Function Calling 是 AI 从“会说”走向“会做”的关键机制
- 模型不直接执行函数，外部程序才执行
- 安全边界和工具权限非常重要

## 参考资料

- OpenAI Function Calling Guide
  - https://platform.openai.com/docs/guides/function-calling/how-do-i-ensure-the-model-calls-the-correct-function
- OpenAI Tools Guide
  - https://platform.openai.com/docs/guides/tools/tool-choice
