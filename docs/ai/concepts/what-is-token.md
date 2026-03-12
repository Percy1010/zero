---
title: 令牌(Token)
description: 深入解释 Token 是什么、它如何影响计费与上下文窗口、为什么长对话会让成本快速膨胀，以及普通用户最实用的节省 Token 方法。
---

# 令牌(Token)

## 一、是什么？

### 一句话定义

`Token` 是 AI 大模型处理文本的最小单位，也是计费的基本单位。它不等于一个字，也不等于一个词，而更像一种「语义碎片」。

## 二、工作原理

AI 不能直接「读」文字，它需要先把文本转换成数字序列，这个过程叫 `Tokenization`。

## 三、Token 与计费

- 中文通常更费 Token
- 英文通常更省 Token
- 输入和输出一般都要分别计费

## 四、为什么长对话会特别贵？

因为系统经常会把前文历史一起重新发送给模型，所以 Token 成本会越聊越高。

## 五、通俗比喻

- Token 像拼图碎片
- Token 像出租车计价器
- 上下文窗口像油箱

## 六、实用建议: 如何省 Token？

| 方法 | 具体做法 |
| --- | --- |
| 精简提问 | 去掉废话，直奔主题 |
| 指定回答长度 | 如「用 100 字以内回答」 |
| 适时开新对话 | 历史太长时不要硬拖 |
| 使用记忆压缩 | 先总结前文 |
| 按需使用模型 | 简单问题用便宜模型 |

## 七、你现在只需要记住什么

- Token 是模型处理文本和计费的基本单位
- 成本和上下文窗口都与 Token 直接相关
- 很多工程优化，本质上都是在「让有限的 Token 更值钱」

## 八、推荐阅读

- 人人都是产品经理: https://www.woshipm.com/ai/6184349.html
- CSDN 深入理解 Token: https://blog.csdn.net/qq_27471405/article/details/140486945
- 阿里云 Token 定义与计费: https://developer.aliyun.com/article/1529782
- OpenAI Tokenizer: https://platform.openai.com/tokenizer
