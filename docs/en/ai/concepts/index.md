---
title: Core Concepts
description: Chapter guide for core AI concepts, helping readers understand the relationships among LLM, Prompt, Context, Memory, Agent, RAG, MCP, Workflow, and related terms through one clear learning path.
---

# Core Concepts

The goal of this chapter is not to make readers memorize a pile of AI terms, but to establish one clear main line:

> Start with a large language model that can only predict the next piece of text, then understand how it gradually becomes a system that can converse, remember, search, call tools, run workflows, and collaborate.

Once this main line is clear, terms like `LLM`, `Prompt`, `Context`, `Memory`, `Agent`, `RAG`, `MCP`, `Workflow`, and `Skill` stop feeling disconnected.

## What This Chapter Covers

This chapter is organized into 5 progressive stages:

1. Understand the model itself: `LLM`, `Prompt`, `Context`, `Memory`, `Token`
2. Understand external capabilities: `Agent`, `Search`, `RAG`
3. Understand tool conventions: `Function Calling`, `MCP`
4. Understand process structuring: `Workflow`, `Skill`
5. Understand collaboration and expansion: `SubAgent`, `A2A`

## Reading Order

<ConceptOverviewList />

## Learning Framework

The most important takeaway in this chapter is not the definition of any single term, but this unifying idea:

> Most AI application-layer concepts are ultimately solving the same problem: how to place better information into the context.

You can read them like this:

- `Prompt` tells the model what you want it to do
- `Context` gives the model the background of the current task
- `Memory` carries forward prior dialogue and rules
- `Search` brings in fresh public information
- `RAG` brings in private knowledge-base content
- `Function Calling` lets the model express which tool it wants to use in a structured way
- `MCP` lets tools connect to the system in a standardized way
- `Agent` orchestrates the model, tools, retrieval, and process
- `Workflow` solidifies repeated steps
- `Skill` packages reusable know-how, instructions, and scripts
- `SubAgent` isolates context through task decomposition
- `A2A` lets multiple agents collaborate and pass results

## How to Study This Chapter

- Do not memorize these terms as isolated glossary entries. Focus on what problem each one solves from the previous stage.
- Always look at them from the perspective of 「system evolution」: how the model is gradually extended with memory, retrieval, tools, and process capabilities.
- Focus especially on a few easily confused pairs: `Prompt` vs `Context`, `Context` vs `Memory`, `Search` vs `RAG`, and `Function Calling` vs `MCP`

## What You Can Gain After Finishing This Chapter

- Know which layer the common AI terms belong to
- Understand that these concepts are not a flat list, but a connected system evolution
- Understand the relationships among models, context, memory, retrieval, tools, and process
- Clearly distinguish between 「the model's own capabilities」 and 「system-level external capabilities」
- Quickly judge what problem a new concept is trying to solve
