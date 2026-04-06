---
title: "CRM Backend System"
description: "A production-grade CRM backend system built for a client managing B2B sales pipelines with over 2,000 contacts."
date: "2026.03 → 2026.04"
tags: ["Spring Boot", "PostgreSQL", "Supabase", "REST API"]
demo: ""
github: ""
---

## The Problem

The client was a small B2B sales team using a mix of spreadsheets and a generic CRM tool that didn't fit their workflow. They needed a custom backend that could handle their specific pipeline stages, custom contact fields, and reporting logic.

## What I Built

A REST API backend with:

- **Contact management** — full CRUD with custom field support
- **Pipeline tracking** — configurable stages per sales team
- **Activity logging** — every call, email, and meeting tracked automatically
- **Role-based access** — sales reps see their own data, managers see all
- **Webhook integration** — fires events to Slack on key pipeline milestones

## Technical Decisions

I chose **Spring Boot** because the client needed long-term maintainability by a Java team they were planning to hire. I chose **Supabase** as the database layer for its built-in auth and storage — it cut development time significantly without sacrificing control.

## What Made This Hard

The hardest part wasn't the code — it was understanding the sales team's mental model of what a "contact" actually was. To them, a contact was a relationship, not a record. That shift in framing changed the entire data model.

## Result

Delivered in 6 weeks. The client's sales cycle visibility improved immediately. They could see where deals were stalling for the first time.
