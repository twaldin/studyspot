# studyspot

<img src=".github/social-card.png" alt="studyspot" width="100%" />

A study assistant that answers questions about your actual course materials,
not the whole internet. Students in a course upload their syllabi, slides, and
notes into a shared course knowledge base; the assistant answers from those
documents with citations, and can turn them into flashcards and quizzes.

> **status:** this is the original studyspot implementation, which I co-founded
> and built in 2025 — frozen as of when I moved on to agent tooling. The
> [studyspot.us](https://studyspot.us) that's live today is a separate rewrite
> by my co-founder; this repo is not what's deployed there.

## what it is

Generic chatbots don't know what's on your midterm. studyspot fixes that by
scoping the AI to one course at a time and grounding every answer in documents
that course's students actually uploaded.

- **Course knowledge bases.** Join a school and a course, upload materials
  (PDF, DOCX, TXT, MD, and more), and they become a shared, searchable corpus
  for everyone in that course.
- **Grounded answers (RAG).** Ask a question and the assistant runs a semantic
  search over the course's document chunks, pulls the relevant passages, and
  answers from them with source attribution — rather than guessing.
- **Study tools from your own material.** Generate flashcard sets and quizzes
  off the uploaded documents, then save, edit, and share them by link.
- **Canvas import.** Connect a Canvas LMS account to pull course content in
  instead of uploading everything by hand.
- **Chats that persist.** Conversations are saved, forkable, and shareable via
  public share links. Streaming responses survive navigation and reconnects.

## how it works

Three moving parts, in a pnpm monorepo:

```
apps/web            Next.js 15 app — auth, course/chat UI, upload, API routes
workers/assistant   Mastra AI worker — RAG pipeline, streaming, study-tool gen
Supabase            Postgres + pgvector — documents, chunks, chats, embeddings
```

1. **Ingestion.** Uploaded files are parsed (pdf2json / llama-parse), chunked,
   embedded with OpenAI `text-embedding-3-small` (1536-dim), and stored as rows
   in a pgvector table keyed to the course.
2. **Retrieval + answer.** The assistant worker is a [Mastra](https://mastra.ai)
   agent with tools for semantic search, full-document fetch, and course
   verification. On each question it decides whether retrieval is needed, runs
   a vector search (`match_chunks`), and generates a grounded, cited answer.
3. **Streaming.** Answers stream over SSE from a persistent stream manager, so a
   response keeps running even if the client disconnects, and a reconnecting or
   second client catches up on everything already emitted.

The assistant runs as a standalone worker; the web app talks to it over a
service binding (with a public worker URL as fallback).

## stack

- **Web:** Next.js 15 (App Router), React, TypeScript, TailwindCSS 4, Radix UI,
  TanStack Query
- **AI:** Mastra agent framework; Anthropic Claude for chat (model is
  config-driven via `config/prompt-configs/`), OpenAI for embeddings, Google
  Gemini optional
- **Data:** Supabase (Postgres + pgvector), row-level security, JWT auth
- **Uploads:** UploadThing, with server-side file-type/content validation
- **Shared UI:** `@studyspot/ui` — a Radix + Tailwind component library used by
  the app and the landing page

## repo layout

```
apps/web            main application
apps/landing-page   marketing site
workers/assistant   Mastra assistant worker (RAG, streaming, tools)
packages/ui         shared component library
config/             prompt configs + eval queries for the assistant
```

## running locally

Needs a Supabase project (with pgvector), and API keys for Anthropic + OpenAI.
Auth and file-upload keys are needed for the full app; see `.env` usage in the
root `package.json` scripts.

```bash
pnpm install
pnpm dev        # web app (:3000) + assistant worker (:8787), concurrently
```

Individual pieces:

```bash
pnpm dev:web         # Next.js app only
pnpm dev:assistant   # assistant worker only
pnpm dev:landing     # landing page
```

## deploy

As committed, the repo deploys the web app and assistant to Cloudflare Workers
via OpenNext/Wrangler (`pnpm deploy`), with auth through Clerk. (The rewrite
serving studyspot.us today uses a different stack — see status note above.)

