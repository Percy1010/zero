---
title: LangChain
description: A non-technical explanation of what LangChain is, why it belongs in the engineering-framework layer, and how it relates to workflow, agents, and RAG.
---

# LangChain

## One-Sentence Definition

`LangChain` is a programming framework for building LLM applications and agents. It provides reusable components that help developers assemble AI systems faster.

## Why It Does Not Belong in Core Concepts

`LangChain` is not a general concept like `LLM`, `Prompt`, or `RAG`. It is a concrete engineering framework.

More precisely:

- core concepts answer "what should I understand?"
- LangChain answers "how would a developer turn those ideas into a system?"

That is why it belongs better in the tools and engineering-framework layer.

## Intuitive Analogies

### Analogy 1: A LEGO kit

If building an AI app from scratch is like constructing a house by hand, LangChain is more like a LEGO kit with pre-made pieces:

- model connection pieces
- prompt template pieces
- memory pieces
- RAG pieces
- tool pieces
- agent pieces

You do not have to build every part from the ground up.

### Analogy 2: A cookbook framework

You can cook by improvising, but a good cookbook gives you tested recipes. LangChain plays a similar role for many AI engineering patterns.

## Core Modules

- `Chain`: connects several steps into a pipeline
- `Agent`: lets the system choose what to do next
- `Retriever`: supports RAG retrieval
- `Tool`: exposes external capabilities
- `Memory`: manages history and reusable information

## Why Developers Use It

Real AI systems are often more than one model call. They may need to:

1. read files
2. split text
3. retrieve documents
4. call a model
5. parse output
6. use tools
7. save results

Writing all of that from scratch is expensive. LangChain reduces repeated engineering work.

## How Much a Non-Programmer Needs to Learn

If you are not writing code yet, you do not need to learn its API in depth. You mainly need to know:

- it is an AI engineering framework
- it is often used to implement workflow, RAG, and agent systems
- when technical teams mention it, they are talking about implementation, not a basic concept

## Relationship to Workflow and Agent

- `Workflow` is a method-layer concept
- `Agent` is a capability-layer concept
- `LangChain` is one common framework used to implement them

They are related, but they are not the same layer.

## What You Need to Remember

- LangChain is a framework, not a core concept
- it mainly serves AI application developers
- knowing what it is helps you understand a large part of modern AI engineering material
