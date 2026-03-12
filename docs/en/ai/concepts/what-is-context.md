---
title: Context
description: A deeper tutorial on context and context windows, including what fits inside the window, why larger is not always better, and how context matters in support, documents, and code tasks.
---

# Context

## 1. What Is It?

### One-sentence definition

`Context` is all the information you provide to the model for the current interaction: the prompt, conversation history, references, retrieved documents, and tool outputs.  
`Context Window` is the maximum amount of context the model can handle at one time.

## 2. How It Works

The easiest analogy is a desk:

- the desk is the `Context Window`
- the papers on the desk are the `Context`
- a larger desk can hold more material
- once the desk is full, something must be removed, compressed, or summarized

## 3. What Is Actually Inside the Window?

```text
1. System prompt
2. Conversation history
3. Retrieved references
4. Tool outputs
5. The current user message
6. The model's current answer generation
```

All of these compete for the same limited space.

## 4. Example Window Sizes

| Model | Context window | Rough intuition |
| --- | --- | --- |
| GPT-3 (2022) | ~4K tokens | a few pages |
| GPT-3.5 | 16K tokens | a long article |
| GPT-4 Turbo | 128K tokens | a short book |
| Claude 3.5 | 200K tokens | multiple long documents |
| Gemini 1.5 Pro | 1M+ tokens | a very large corpus |

## 5. Key Insight: Bigger Is Not Always Better

A larger window often helps with longer conversations and longer documents, but it also brings tradeoffs:

- higher cost
- heavier computation
- more noise
- weaker use of information in the middle of long contexts

## 6. Intuitive Analogies

| Analogy | Meaning |
| --- | --- |
| Desk | how much material can be open at once |
| Working memory | how much can be actively held |
| RAM | active runtime information |
| Spotlight | only what gets attention is truly used well |

## 7. Business Applications

| Scenario | Why context matters |
| --- | --- |
| Customer support | remembers the current issue and prior constraints |
| Document analysis | handles whole contracts or reports |
| Long-form writing | keeps style and consistency |
| Code review | sees more of the codebase at once |

## 8. What You Need to Remember

- `Context` is what the model can actually see
- `Context Window` is how much it can see
- many bad answers are not model problems but context-design problems

## 9. Recommended Reading

- IBM: https://www.ibm.com/think/topics/context-window
- Zhihu explainer: https://zhuanlan.zhihu.com/p/15530206889
- Context length vs context window: https://www.53ai.com/news/LargeLanguageModel/2024073165281.html
- AI Bot encyclopedia: https://ai-bot.cn/what-is-context-window/
