---
title: Context
description: A beginner explanation of what context means in AI, how it differs from prompt and memory, why context windows matter, and how better context design improves results.
---

# Context

## One-Sentence Definition

`Context` is all the information the model can currently see, use, and rely on while producing an answer.

## Intuitive Analogies

### Analogy 1: Visiting a doctor

If you only say "I have a headache," the doctor has very little to work with. But if you add:

- it has lasted for three days
- it is on the right side
- you have been sleeping badly
- you had a scan last year
- there is family history

those details make diagnosis much better. For a model, that added background is context.

### Analogy 2: "Previously on..."

A TV recap helps viewers quickly understand the current episode. That recap is context. Without it, you are dropped into the middle of the story with no orientation.

The model feels the same way if you provide no background.

## What Context Usually Includes

A full model call may include:

- system prompt
- prior messages
- uploaded files
- retrieved documents
- tool outputs
- the user's current message

So even when you think you only asked one sentence, the model may actually be seeing a much larger bundle of information.

## Why Context Matters So Much

Many quality problems are not really model problems. They are context problems.

Typical failures include:

- incomplete background
- too much irrelevant material
- weak structure
- missing distinction between background and instruction

## Context vs Prompt vs Memory

- `Prompt`: the task brief
- `Context`: everything the model currently sees
- `Memory`: information the system keeps for later reuse

A prompt is part of context, but context is broader. Memory is often inserted back into context, but the two are not the same concept.

## The Key Limit: Context Window

Every model has a limit on how much context it can handle at one time. This is called the context window.

You can think of it as the number of seats around a table:

- more information takes more seats
- once the seats are full, something has to be removed
- too much material is not only more expensive, it also makes focus worse

This is one reason long conversations often feel like they "forget the beginning."

## A Simple Contrast

### Weak context

```text
Help me write a proposal.
```

The model does not know:

- what kind of proposal
- for whom
- what tone
- how long

### Better context

```text
[Background] We are a startup selling premium pet food for cats.
[Current status] We mainly sell on Taobao, with a small team and limited budget.
[Need] Please write a 3-month social media marketing plan.
[Requirement] It should be realistic and executable.
```

Now the model has a real working situation to reason from.

## Context Engineering

You can think of context engineering as designing what the model sees before it answers.

Practical rules:

1. include only relevant information
2. structure it with headings, lists, or tables
3. place the most important parts at the front or the end
4. clearly separate background from instruction

## Common Business Uses

- customer support: manuals, FAQ, return policies
- brand writing: voice, audience, competitor examples
- analytics: metric definitions, history, business background
- legal support: facts, statutes, case summaries

## What You Need to Remember

- context is what the model can actually see right now
- many poor answers are context problems
- designing context well is often more powerful than just rephrasing the same question

## Sources

- OpenAI Prompting Guide
  - https://platform.openai.com/docs/guides/prompting
- Anthropic Token Counting
  - https://docs.anthropic.com/en/docs/build-with-claude/token-counting
