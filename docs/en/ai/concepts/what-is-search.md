---
title: Search
description: A beginner explanation of what search means in AI systems, why it compensates for model knowledge cutoffs, how it differs from RAG, and where search-enhanced AI is used in real work.
---

# Search

## One-Sentence Definition

`Search` is the ability that lets an AI system look up external information before answering, which helps compensate for outdated model knowledge and missing real-time details.

## Intuitive Analogy

### Analogy: An open-book exam

Without search, the model is closer to a closed-book exam. It can only answer using what it already absorbed during training. With search, it becomes more like an open-book exam: when it needs current facts, it can go look them up first.

## How It Works

A typical flow looks like this:

1. the user asks a question
2. the system decides whether search is needed
3. it searches websites, knowledge bases, or other sources
4. it returns the results to the model
5. the model reads and organizes the answer

So search is about finding material, not about the final expression itself.

## What Search Solves

- outdated model knowledge
- latest news, prices, rules, and announcements
- missing source material
- finding specific documents or pages first

## Search vs Generation

- search finds
- the LLM writes

Many so-called online AI products are really search plus generation.

## Search vs RAG

- `Search` often targets the public web or external sources
- `RAG` often targets your private documents or controlled knowledge base

An easy way to remember it:

- Search: go outside
- RAG: go into the material you prepared

## A Simple Example

If you ask:

```text
How is the stock market doing today?
```

Without search, the model may rely on old knowledge or guess. With search, the system can first retrieve live data and news, then answer using fresher material.

## Common Business Uses

- competitor monitoring
- public opinion tracking
- industry research
- live news summaries
- customer support fallback when the knowledge base has no answer

## What You Need to Remember

- search gives the model outside material
- search itself is not the final answer
- many online AI experiences are fundamentally "search first, write second"

## Sources

- OpenAI Tools Guide
  - https://platform.openai.com/docs/guides/tools/tool-choice
- OpenAI File Search Guide
  - https://platform.openai.com/docs/guides/tools-file-search
