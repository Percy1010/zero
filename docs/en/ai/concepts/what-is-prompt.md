---
title: Prompt
description: A beginner-friendly explanation of what a prompt is, what a good prompt usually contains, why prompts change results so much, and how non-technical users can build reusable prompt templates.
---

# Prompt

## One-Sentence Definition

A `Prompt` is everything you say to the AI: the task, the question, the background, the output format, and the constraints.

## Intuitive Analogies

### Analogy 1: Ordering food

At a restaurant:

- "Just bring me something" leads to unpredictable results
- "One kung pao chicken, mildly spicy, less oil, rice packed separately" is much clearer

A prompt works the same way. The clearer you are, the more controllable the output becomes.

### Analogy 2: Briefing an intern

If you only say "write a proposal," the intern does not know:

- what kind of proposal
- who it is for
- what tone to use
- what length you want
- what matters most

A good prompt reduces that ambiguity.

## What a Good Prompt Often Contains

You do not always need every part, but these are common:

1. role
2. background
3. task
4. format requirements
5. examples
6. constraints

## Why Prompts Matter

The model does not read minds. It infers the task from the words you provide.

When a prompt is vague, the model is more likely to:

- misunderstand the task
- miss the real priority
- invent assumptions you did not ask for
- produce unstable structure

## A Simple Comparison

### Weak prompt

```text
Write an article for me.
```

This leaves too many open questions.

### Better prompt

```text
Write a public WeChat-style article about building a habit of
waking up early, around 2000 words, for working professionals.
```

Better, but still not very controlled.

### Stronger prompt

```text
# Role
You are a personal growth writer with a humorous, grounded style.

# Task
Write an article titled "Does waking up early really change your life?"

# Audience
Working professionals aged 25-35 who stay up late and want to change.

# Requirements
1. Open with a short engaging story
2. Give 3 practical actions
3. End with one memorable line

# Format
- 2000-2500 words
- 5 to 6 sections
- warm and natural tone
```

This is much easier for the model to execute well.

## Common Techniques

- `Zero-shot`: ask directly without examples
- `Few-shot`: provide examples to imitate
- `Chain of Thought`: ask for step-by-step reasoning
- `Role Prompting`: assign a professional role
- `Step-by-step`: break complex work into steps

## How It Helps in Real Work

- customer service: consistent tone and boundaries
- hiring: structured resume review
- content operations: reusable writing templates
- meetings: extract decisions, owners, and deadlines
- training: simulate an interviewer, customer, or coach

## Why Prompt Leads to Later Concepts

Prompt alone is often not enough. Real tasks usually also need:

- `Context` for background
- `Memory` for continuity
- `Search / RAG` for extra information
- `Workflow` for multi-step execution

## What You Need to Remember

- a prompt is not a magic spell, it is a task brief
- the goal is clarity, not cleverness
- clear role, task, background, constraints, and format usually improve output stability

## Sources

- OpenAI Prompting Guide
  - https://platform.openai.com/docs/guides/prompting
- Anthropic Prompt Engineering
  - https://docs.anthropic.com/en/docs/prompt-engineering
