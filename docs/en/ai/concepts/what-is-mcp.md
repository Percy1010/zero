---
title: Model Context Protocol (MCP)
description: A beginner explanation of MCP, why it is often compared to USB-C for AI, how Host, Client, and Server fit together, and how MCP relates to function calling.
---

# Model Context Protocol (MCP)

## One-Sentence Definition

`MCP`, short for `Model Context Protocol`, is an open standard for how AI applications connect to external tools and data sources in a more uniform way.

## Intuitive Analogies

### Analogy 1: USB-C

Before USB-C, different devices used different connectors. If AI systems evolve the same way, every AI client would need separate custom integrations for GitHub, Slack, databases, file systems, search tools, and more.

That creates an `N × M` integration problem.

MCP tries to solve that by letting tool providers expose capabilities through a shared standard, so AI applications that support MCP can reuse them more easily.

### Analogy 2: A shared diplomatic language

If every country needed a separate translator for every other country, complexity would explode. A shared middle protocol reduces that complexity.

## Why MCP Exists

Without a common protocol:

- every new tool needs custom integration work
- capabilities and data formats differ from one system to another
- reuse across AI clients becomes much harder

The value of MCP is not that it makes the model smarter. Its value is that it makes tool integration cleaner and more standardized.

## The Basic Architecture

You can remember three roles:

- `Host`: the application you directly use
- `Client`: the part inside the host that talks to MCP servers
- `Server`: the side that exposes specific tools, resources, or prompt templates

A common flow is:

1. the host connects to an MCP server
2. the server announces what it can provide
3. the host calls those capabilities when needed
4. the returned result goes back into the model context

## What MCP Servers Can Expose

### Tools

Things the model can do, such as:

- read or write files
- send messages
- query databases

### Resources

Things the model can read, such as:

- file content
- records
- page data

### Prompts

Reusable task templates, such as:

- code review templates
- report-generation templates

## MCP vs Function Calling

These two ideas are easy to confuse:

- `Function Calling` is the structured agreement between the model and the host
- `MCP` is the protocol standard between the host and external tool services

One solves the left side of the system, the other solves the right side.

## A Typical Use Case

Imagine a project manager who regularly needs to:

1. inspect new GitHub issues
2. summarize the important ones
3. post the summary to Slack

Without standardization, this means constant manual switching or custom integration work. With MCP, an AI client can connect both systems through a clearer common protocol.

## Common Business Uses

- office automation
- software collaboration
- analytics workflows
- customer-management systems
- content operations

## What You Need to Remember

- MCP solves how tools connect in a standardized way
- it improves reuse and integration quality, not the raw intelligence of the model
- understanding function calling first makes MCP much easier to understand

## Sources

- Model Context Protocol
  - https://modelcontextprotocol.io/introduction
- Anthropic MCP Overview
  - https://docs.anthropic.com/en/docs/mcp
