---
title: Memory
description: A beginner explanation of memory in AI systems, how it differs from context, how short-term and long-term memory work, and what practical memory strategies users can apply today.
---

# Memory

## One-Sentence Definition

`Memory` is the mechanism that lets a system preserve important information and reuse it later, instead of treating every interaction as a completely fresh start.

## Intuitive Analogies

### Analogy 1: A goldfish with a notebook

The model itself is more like a goldfish: if you do not give it old information again, it does not naturally remember it. Memory is like giving that goldfish a notebook:

- save important information after the conversation
- look it up next time
- place the relevant part back into context

The improvement is in the system, not in the model suddenly growing human-style memory.

### Analogy 2: A hotel front desk note pad

The front desk cannot truly remember every guest, but it can keep notes:

- this guest dislikes spicy food
- this guest prefers a window room
- this guest reported a problem last time

When those notes are used later, the service feels personalized.

## Common Types of Memory

### Short-term memory

Information kept during the current conversation or task.

### Long-term memory

Information preserved across multiple conversations.

### Summary memory

A compressed summary of a long history, used to save tokens while keeping the main points.

## How Memory Works

The core pattern is simple:

1. save conversation history or key facts
2. retrieve the relevant part before the next interaction
3. place it back into the new context

So memory does not mean "the model remembers internally." It means the surrounding system manages useful information for the model.

## What Happens When Conversations Get Long

Common strategies include:

- sliding windows
- summarization
- extracting only key facts
- storing full history externally and retrieving what matters

## A Simple Contrast

### Without memory

Yesterday:

```text
My name is Xiaoming and I work in e-commerce operations.
```

Today:

```text
Please continue helping me with the problem from yesterday.
```

The model may answer:

```text
I am not sure which problem you mean. Please provide more detail.
```

### With memory

If the system has already kept facts such as:

- the user works in e-commerce
- the company is in Hangzhou
- the current project is in pet food

then future answers can be much more relevant immediately.

## What You Can Do Today

### Method 1: manual memory

Start important conversations with a stable block of background:

```markdown
## My information
- Role: e-commerce operator
- Industry: pet food
- Current goal: expand Xiaohongshu channel
- Preferred style: concise and direct
```

### Method 2: built-in product memory

Many AI products now support cross-session memory, project knowledge, or preference saving. The system is handling memory management for you.

### Method 3: your own context file

You can maintain one personal background document and paste it when needed.

## Common Business Uses

- support: order history and complaint history
- sales: budget, pain points, status
- coaching: progress and weak areas
- writing: brand tone and terminology
- project management: stage, owners, next actions

## What You Need to Remember

- memory is not just raw chat history
- it is about preserving information that should still matter later
- better memory is selective and accurate, not simply larger

## Sources

- LangGraph Memory Overview
  - https://langchain-ai.github.io/langgraph/concepts/memory/
- Anthropic Claude Code Memory
  - https://docs.anthropic.com/en/docs/claude-code/memory
