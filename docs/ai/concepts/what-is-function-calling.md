---
title: 函数调用(Function Calling)
description: 解释 Function Calling 是什么、它为什么让模型从会说走向会做、一次典型的调用流程是什么，以及它和 Plugin、MCP 的区别。
---

# 函数调用(Function Calling)

## 一句话定义

`Function Calling` 是模型和宿主程序之间的一种格式约定: 当模型觉得需要调用工具时，不是用自然语言含糊地说，而是按结构化格式把「调用哪个工具、参数是什么」表达出来。

## 它和 MCP 的区别

- `Function Calling`: 解决「模型怎么表达我要调哪个工具」
- `MCP`: 解决「工具和数据源怎么以统一协议接进系统」

## 你现在只需要记住什么

- Function Calling 让模型从「会说」开始走向「会做」
- 模型不直接执行函数，程序才真正执行
- 结构化格式是它可靠工作的关键
