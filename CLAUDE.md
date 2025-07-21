# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StudySpot is an AI-powered study assistant monorepo with two main applications:
- **@studyspot/web**: Next.js 15 frontend with Clerk authentication, TailwindCSS, and real-time chat
- **@studyspot/assistant-api**: Backend API service for AI interactions and document processing

The platform enables college students to create collaborative course knowledge bases, upload course materials, and get AI-powered answers using RAG (Retrieval-Augmented Generation).

## Development Commands

### Root Level Commands
```bash
# Start both web and API in development
pnpm dev

# Start only web app (recommended for frontend work)
pnpm dev:web

# Start only API service
pnpm dev:api

# Build both applications
pnpm build

# Run linting across all packages
pnpm lint

# Run tests across all packages (Jest for API)
pnpm test

# Clean all build artifacts
pnpm clean
```

### App-Specific Commands
```bash
# Web app (apps/web)
cd apps/web
pnpm dev          # Next.js dev with Turbopack and pino-pretty logging
pnpm build        # Production build
pnpm lint         # Next.js ESLint

# Assistant API (apps/assistant-api)
cd apps/assistant-api
pnpm dev:vercel   # Build and start WebSocket server
pnpm build        # TypeScript compilation with tsc-alias
pnpm test         # Jest test runner
```

## Architecture

### Monorepo Structure
- **pnpm workspaces** with apps/* and packages/* (though no packages/ exist currently)
- **Feature-first architecture** in the web app with clear domain separation
- **Shared utilities** between web and API for AI services and types

### Key Architectural Patterns

#### Web App (`apps/web`)
- **Next.js App Router** with TypeScript and TailwindCSS
- **Feature-based organization**: `/features/{domain}/` contains services, components, types
- **Service layer pattern**: Each domain has dedicated service classes (singleton pattern)
- **API routes**: RESTful endpoints in `/app/api/` for database operations
- **Context providers**: React Context for global state (chat navigation, pending chats)
- **Custom hooks**: `/hooks/api/` for data fetching with TanStack Query

#### Assistant API (`apps/assistant-api`)
- **LlamaIndex integration** for RAG pipeline and AI orchestration
- **Multi-provider AI**: OpenAI GPT-4, Anthropic Claude 3.5 Sonnet, Google Gemini
- **Streaming responses** with WebSocket server for real-time AI interactions
- **Tool-calling system**: Modular tools for document retrieval and processing
- **Vector embeddings**: OpenAI text-embedding-3-small for semantic search

### Core Services

#### AI and RAG System
- **StreamingAgentService** (`apps/assistant-api/lib/rag/streaming-agent.service.ts`): Main AI orchestration
- **RetrievalService**: Document retrieval using vector similarity search
- **QueryService**: Query processing and context preparation
- **ToolManager**: Manages AI tool calling for document retrieval

#### Document Processing Pipeline
- **DocumentIngestionService**: File upload, extraction, and preprocessing
- **CourseExtractionService**: AI-powered course validation and metadata extraction
- **File security**: Comprehensive validation with content verification and type checking

#### Database and Authentication
- **Supabase**: PostgreSQL with vector extensions for embeddings storage
- **Row-Level Security (RLS)**: Database-level access controls
- **Clerk**: Authentication with user management and onboarding flow

## Code Conventions

### TypeScript Configuration
- **Strict mode enabled** in API (`apps/assistant-api`)
- **Non-strict mode** in web app for rapid development
- **Path aliases**: `@/*` maps to app root for clean imports
- **ES2022 target** for API, ES2017 for web app

### Service Architecture Patterns
- **Singleton services**: Use static `getInstance()` method pattern
- **Error handling**: Custom error classes with specific error codes
- **Type safety**: Comprehensive interfaces for API requests/responses
- **Logging**: Pino logger with structured logging and pretty formatting in development

### File Organization
```
apps/web/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (database operations)
│   └── (main)/            # Protected routes
├── features/              # Domain-driven features
│   ├── {domain}/
│   │   ├── components/    # Feature-specific components
│   │   ├── services/      # Business logic and API calls
│   │   └── {domain}.types.ts
├── components/ui/         # Shared UI components (Radix-based)
├── hooks/api/            # TanStack Query hooks
└── lib/                  # Shared utilities and services
```

### AI Provider Integration
- **Multi-provider support**: Consistent interface across OpenAI, Anthropic, and Gemini
- **Model configuration**: Environment-based model selection
- **Streaming**: Real-time response streaming with tool-calling capabilities
- **Context management**: Conversation history with course-specific context

## Environment Setup

### Required Environment Variables
```bash
# Database
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Authentication
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=

# File Upload
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Assistant API
NEXT_PUBLIC_ASSISTANT_API_URL=http://localhost:3001  # URL of the assistant-api service
```

### Development Dependencies
- **Node.js**: ES modules support required
- **pnpm**: Package manager for workspace management
- **Turbopack**: Next.js development bundler for faster builds
- **ESLint**: Next.js config with relaxed rules for unescaped entities

## Testing

- **Jest** configured for API testing (`apps/assistant-api`)
- **No testing framework** currently set up for web app
- **Test files**: Use `.test.ts` or `.spec.ts` extensions

## Key Integration Points

### Database Schema
- **Vector embeddings**: `chunks` table with OpenAI embeddings (1536 dimensions)
- **Course hierarchy**: Schools → Courses → Documents → Chunks
- **User data**: Clerk user IDs as foreign keys with RLS policies

### AI Tool System
- **Document retrieval tool**: Semantic search across course materials
- **Course context**: All AI interactions scoped to user's selected course
- **Real-time suggestions**: AI-generated query suggestions based on course content

### Security Considerations
- **File validation**: Multiple layers of security for uploaded documents
- **Content sanitization**: DOMPurify for user-generated content
- **Rate limiting**: Built into service layer (check `rate-limiter.ts`)
- **Access control**: Supabase RLS ensures users only access their data