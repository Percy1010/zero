---
title: Token
description: A beginner explanation of what tokens are, why they affect both cost and context windows, why complex agents consume so many tokens, and what practical steps users can take to reduce waste.
---

# Token

## One-Sentence Definition

A `Token` is the basic unit a model uses to process text. It is also the unit behind both pricing and context-window limits in many AI systems.

## Intuitive Analogies

### Analogy 1: Arcade coins

Imagine an arcade where every action costs coins.

- what you send to the model consumes input tokens
- what the model sends back consumes output tokens
- longer and more complex tasks consume more

So tokens behave like both reading cost and generation cost.

### Analogy 2: A taxi meter

Starting a conversation is like getting into the taxi. The longer the trip, the higher the cost. More context and longer answers make the meter run faster.

## What a Token Actually Is

A token is not exactly the same as a word or a character. The model first splits text into smaller units according to its tokenizer.

For example:

```text
Hello world -> 2 tokens
I'm learning AI -> 4 tokens
```

Chinese often becomes more expensive because many characters map to one token or more.

## Why Tokens Matter

Tokens directly affect two practical things:

1. cost
2. context window usage

Your prompt, prior messages, retrieved chunks, tool outputs, and the model's answer all consume tokens together.

## Why Complex Systems Burn Tokens

People often think they asked only one question. But in an agent system, there may be several hidden rounds:

1. the model decides whether to search
2. search results are fed back in
3. the model plans again
4. tools are called and results come back

Each round adds more model calls and more context.

## How to Save Tokens

### 1. say it clearly once

Repeatedly revising a vague request is expensive.

### 2. control output length

Ask for a limit such as "answer in under 200 words."

### 3. reduce irrelevant context

Do not include background that is unrelated to the current task.

### 4. use summaries

Long histories can often be replaced with short summaries.

### 5. choose the right model

Simple tasks do not always need the most expensive model.

## A Simple Example

### Inefficient

```text
Write an article about healthy eating.
```

Then you keep changing the audience, tone, and length across several rounds. That burns many more tokens.

### Better

```text
Please write a healthy eating guide for people over 60,
in a warm tone, about 1500 words, in 5 sections.
```

A clearer request often reduces both retries and cost.

## How Tokens Relate to Other Concepts

- `Context` length consumes tokens
- `Memory` strategies often exist to save tokens
- `SubAgent` decomposition can prevent context bloat
- better `Workflow` design often means fewer repeated calls

## What You Need to Remember

- tokens are the unit of model text processing and billing
- both cost and context length are tightly tied to tokens
- much of AI engineering is really about making limited tokens more valuable

## Sources

- OpenAI Tokenizer
  - https://platform.openai.com/tokenizer
- tiktoken
  - https://github.com/openai/tiktoken
