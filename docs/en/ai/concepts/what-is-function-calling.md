---
title: Function Calling
description: A simple explanation of function calling, how it helps models request external actions, and how it differs from MCP.
---

# Function Calling

`Function Calling` means the model can request that the host application call a specific external function or tool.

## What function calling is

It helps the model move from only generating text to asking the system to perform actions.

## A useful analogy

The model is like a receptionist that understands the request, but another department actually performs the task.

## Typical flow

1. the app tells the model which tools exist
2. the model requests a tool
3. the app runs it
4. the result is returned to the model
5. the model continues the response

## Function calling vs MCP

- Function calling is the request mechanism
- MCP is a broader standardization layer for tool and data integration

## What to remember

- The model does not directly execute the function
- The host application executes it

## Sources

- https://platform.openai.com/docs/guides/function-calling/how-do-i-ensure-the-model-calls-the-correct-function
- https://platform.openai.com/docs/guides/tools/tool-choice
