---
title: my-portfolio
description: '  Personal Portfolio with AI Chatbot'
date: 2026.04 -> ongoing
tags:
  - Next.js
  - Typescript
  - Claude
  - Tailwind
  - Anthropic SDK
demo: 'https://seyoun.kim'
github: 'https://github.com/syk25/portfolio'
---
I built this portfolio to have a place I actually control — update content without touching code, ship writing or projects instantly, and present myself in a way that feels like me.

## What I built
The site has a public-facing layer (homepage, projects, blog) and a password-protected admin panel where I can create, edit, and reorder everything — posts, projects, the hero section, even the chatbot's behavior — all without redeploying.
The AI chatbot, powered by the Anthropic API, reads my actual content at runtime to answer visitor questions. I can tune its behavior through the admin panel. Responses stream token by token so it feels fast.

## How I built it
I used Claude Code as my primary development tool. I made the product decisions — features, admin UX, chatbot behavior, visual feel. Claude Code handled the implementation, and I iterated on what I saw working. I shipped roughly 55 versions across the project.

This taught me a lot about what it means to work with AI in a build loop — where human judgment matters, and where it doesn't.
