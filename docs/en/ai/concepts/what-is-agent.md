---
title: Agent
description: A beginner explanation of what an agent is, how it moves AI from chat to execution, how the ReAct loop works, and how it relates to workflow, function calling, and MCP.
---

# Agent

## One-Sentence Definition

An `Agent` is an AI executor that keeps moving toward a goal and can use tools along the way. It turns AI from "only talking" into "actually doing work."

## Intuitive Analogies

### Analogy 1: A private assistant

The model is like a smart advisor, but it does not directly check tickets, send emails, query databases, or edit files. The agent is like the assistant next to that advisor:

- it receives your goal
- it calls tools when needed
- it brings results back to the model
- it continues until the task is finished

The intelligence mainly comes from the model. The execution layer comes from the agent system and tools.

### Analogy 2: A LEGO robot

```text
Agent = brain (LLM) + hands and feet (tools) + control loop
```

The brain decides. The tools act. The loop keeps the task moving.

## The Core Idea: The ReAct Loop

Many agents follow a pattern like this:

1. reason about the next step
2. act by calling a tool
3. observe the result
4. reason again with the new information

This keeps repeating until the task is complete.

## A Simple Example

If you say:

```text
Find the cheapest high-speed train from Beijing to Shanghai tomorrow
and send the result to my colleague.
```

An agent might:

1. decide to search train options
2. call the search tool
3. compare the results
4. call an email or messaging tool
5. return a completion message to you

That is not ordinary chat. It is goal-driven execution.

## What an Agent Usually Contains

- an `LLM` reasoning module
- a tool-calling layer
- a planning layer
- a memory layer
- a loop-control layer

## Agent vs Workflow

- `Workflow` is more fixed
- `Agent` makes more dynamic choices at runtime

Stable repeatable tasks often fit workflow better. More variable tasks benefit more from agent behavior.

## Why Agents Consume So Many Tokens

Agents do not answer only once. They keep looping. Each round of reasoning, tool use, and observation can trigger another model call and add more context.

That is why systems also need:

- `Memory` for compression
- `SubAgent` for decomposition
- `Workflow` for stabilization

## Common Forms of Agents

- online AI that searches before answering
- coding assistants that read projects and edit files
- enterprise agents connected to knowledge bases and systems
- no-code agent builders

## Common Business Uses

- customer support
- sales assistance
- analytics assistants
- content operations
- HR automation
- personal automation

## What You Need to Remember

- the key difference is not better chatting, but better execution
- an agent keeps pushing toward a goal
- once you understand agents, `Function Calling` and `MCP` become easier to understand

## Sources

- Anthropic: Building effective agents
  - https://www.anthropic.com/research/building-effective-agents
- LangGraph: Workflows and agents
  - https://langchain-ai.github.io/langgraph/concepts/workflows-and-agents/
