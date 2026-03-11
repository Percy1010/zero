---
title: Retrieval-Augmented Generation (RAG)
description: A simple explanation of RAG, how it combines retrieval and generation, and why it is common in knowledge assistants and document QA systems.
---

# Retrieval-Augmented Generation (RAG)

`RAG` stands for `Retrieval-Augmented Generation`.

## What RAG is

RAG means the system retrieves relevant information first and then asks the model to generate an answer using that material.

## A useful analogy

It is like an open-book exam:

- first gather the right pages
- then write the answer

## Why RAG matters

It helps when the model needs:

- newer information
- private knowledge
- better grounding

## Search vs RAG

- Search finds the material
- RAG uses that material as part of the answer generation pipeline

## What to remember

- RAG is retrieve first, generate second
- It improves grounding, but it does not guarantee perfection

## Sources

- https://aws.amazon.com/what-is/retrieval-augmented-generation/
- https://platform.openai.com/docs/guides/tools-file-search
