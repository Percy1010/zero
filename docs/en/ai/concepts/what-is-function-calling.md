---
title: Function Calling
description: A beginner explanation of function calling, why it helps models move from speaking to doing, what a typical call flow looks like, and how it differs from plugins and MCP.
---

# Function Calling

## One-Sentence Definition

`Function Calling` is a structured agreement between the model and the host application. When the model thinks a tool is needed, it expresses that need in a machine-readable format instead of vague natural language.

## Intuitive Analogies

### Analogy 1: A standardized order form

If the restaurant server is a robot, you cannot say "bring me a spicy chicken dish." You have to fill in a clear form:

```json
{
  "dish_name": "kung pao chicken",
  "spice_level": "high",
  "rice": "half"
}
```

Function calling is the model learning how to fill out that form.

### Analogy 2: A bank transfer form

You do not just say "please send some money to my mother." You provide fields like:

- recipient
- account
- amount
- purpose

Only once the request is structured can the system execute it precisely.

## How It Works

A typical flow looks like this:

1. the developer tells the model which functions exist
2. the model decides whether a tool is needed
3. if needed, it outputs a structured tool request
4. the host application executes the function
5. the result goes back to the model
6. the model produces the final answer using the real result

The crucial point: the model requests the call, but the external program performs it.

## Why It Is More Reliable Than Pure Chat

In pure chat mode, the model may invent a weather answer. In function calling mode, it first asks for something like:

```json
{
  "name": "get_weather",
  "arguments": {
    "city": "Beijing"
  }
}
```

Then the program fetches real weather data and returns it to the model.

## A Simple E-Commerce Example

Possible functions might include:

- `search_product`
- `check_order_status`
- `create_return_request`
- `transfer_to_human`

If the user says:

```text
I want to return my order. The order number is 20250301001.
```

The model can first request an order-status check, then request return creation if the conditions are met. That is much closer to actual task handling than plain chat.

## Function Calling vs Plugins vs MCP

- `Function Calling`: how the model expresses tool requests
- `Plugin`: a concrete capability module that can be connected
- `MCP`: a broader protocol for standardizing tool and data integration

So function calling and MCP solve different layers.

## How Regular Users Encounter It

You may not write code yourself, but you still meet this capability when you:

- add tools in a visual builder
- configure actions
- attach plugins to an agent

Many of those systems rely on function calling underneath.

## What You Need to Remember

- function calling helps the model move from talking toward doing
- the model does not execute the function itself
- structured output is what makes this reliable

## Sources

- OpenAI Function Calling Guide
  - https://platform.openai.com/docs/guides/function-calling/how-do-i-ensure-the-model-calls-the-correct-function
- OpenAI Tools Guide
  - https://platform.openai.com/docs/guides/tools/tool-choice
