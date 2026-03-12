---
title: Memory
description: A deeper tutorial on memory in AI systems, including why models forget, how short-term and long-term memory work, common memory strategies, and practical value in support, education, CRM, and personal assistants.
---

# Memory

## 1. What Is It?

### One-sentence definition

`Memory` is the mechanism that allows an AI system to "remember" prior statements, user preferences, and important past facts. It is a key step in turning an agent from a one-shot answer machine into a more persistent assistant.

## 2. Why Does AI Forget?

LLMs are fundamentally closer to turn-based systems. In most products, the system sends "history + new message" back to the model every time.

This creates the illusion of memory. Once the history becomes too long and exceeds the context window, earlier information gets dropped, and the model seems to forget.

## 3. Types of Memory

| Memory type | Human analogy | AI implementation | Characteristics |
| --- | --- | --- | --- |
| Short-term memory | what you are actively thinking about | session buffer / rolling window | small, fast, local to current conversation |
| Long-term memory | accumulated experience | summaries, databases, knowledge graphs, vector stores | large, cross-session, persistent |

## 4. Common Short-Term Memory Strategies

```text
1. Buffer memory
2. Window memory
3. Summary memory
```

Summary memory is often the most practical because it preserves important facts while controlling token usage.

## 5. How Long-Term Memory Works

1. detect information worth saving
2. store it in a database or vector store
3. retrieve it when relevant later
4. place it back into context

## 6. Intuitive Analogies

| Analogy | Meaning |
| --- | --- |
| Sticky notes | short-term memory |
| Notebook / diary | long-term memory |
| Brain vs external notebook | context window vs external store |
| RAM vs hard drive | short-term fast and small, long-term slower and larger |

## 7. Business Applications

| Scenario | Memory use |
| --- | --- |
| Customer support | order history, complaint history, preferences |
| Personal assistant | schedule, family info, food preferences |
| Education AI | weak areas, progress, mistakes |
| Sales CRM | communication history, intent, decision chain |
| Health management | allergy history, medication records, goals |

## 8. What You Need to Remember

- memory is not just another name for chat history
- its value is keeping important information active across turns and sessions
- without memory, many agents remain short-lived and forgetful

## 9. Recommended Reading

- Blog园 article: https://www.cnblogs.com/bonelee/p/18382383
- Zhihu article: https://zhuanlan.zhihu.com/p/1938384459033448484
- AWS article: https://aws.amazon.com/cn/blogs/china/agentic-ai-infrastructure-deep-practice-experience-thinking-series-three-best-practices-for-agent-memory-module/
- CSDN article: https://blog.csdn.net/Attitude93/article/details/137006922
- Mem0 article: https://apframework.com/blog/essay/2025-06-22-mem0
