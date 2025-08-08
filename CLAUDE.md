# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StudySpot is an AI-powered study assistant monorepo enabling college students to create collaborative course knowledge bases, upload course materials, and get AI-powered answers using RAG (Retrieval-Augmented Generation).

## Monorepo Architecture

This is a **pnpm workspace monorepo** with four applications in the `apps/` directory:

### Applications

#### 1. **@studyspot/web** (`apps/web/`)
- **Purpose**: Main Next.js 15 frontend application with Clerk authentication, TailwindCSS, and real-time chat
- **Tech Stack**: Next.js 15 App Router, TypeScript, TailwindCSS, Clerk Auth, TanStack Query
- **Features**: Course management, document upload, AI chat interface, user onboarding
- **Port**: Default Next.js port (3000)

#### 2. **@studyspot/assistant-api** (`apps/assistant-api/`)
- **Purpose**: Modern Mastra-based AI assistant API service using agent workflows
- **Tech Stack**: Mastra framework, Anthropic Claude 3.5, OpenAI embeddings, Supabase vector search
- **Features**: RAG workflows, document retrieval tools, streaming responses, prompt configuration
- **Port**: 3001 (configured via `NEXT_PUBLIC_ASSISTANT_API_URL`)

#### 3. **@studyspot/dev-panel** (`apps/prompt-eval-panel/`)
- **Purpose**: Developer panel for RAG workflow testing and prompt engineering
- **Tech Stack**: Next.js 15, TanStack Query, Recharts for analytics
- **Features**: Single test runner, A/B prompt comparison, response quality evaluation, document usage analytics
- **Port**: 3002

#### 4. **landing-page** (`apps/landing-page/`)
- **Purpose**: Marketing/landing page for StudySpot
- **Tech Stack**: Next.js 15, TailwindCSS
- **Features**: Static landing page
- **Port**: Default Next.js port

### Configuration Management

#### Root Configuration (`config/`)
- **`prompt-configs/`**: Centralized prompt configuration JSON files
  - `active.json`: Currently active prompt configuration
  - `test.json`, `test1.json`: Test configurations for A/B testing
- **`test-queries/`**: Standard test queries for evaluation
  - `queries.json`: Production test queries
  - `template-queries.json`: Template queries for development

## Development Commands

### Root Level Commands
```bash
# Start web app + assistant API (core development)
pnpm dev

# Start individual services
pnpm dev:web          # Web app only (port 3000)
pnpm dev:api          # Assistant API only (port 3001)  
pnpm dev:panel        # Dev panel only (port 3002)

# Start all services together
pnpm dev:all          # Web + API + Dev Panel

# Build and maintenance
pnpm build            # Build all applications
pnpm lint             # Run linting across all packages
pnpm test             # Run tests across all packages
pnpm clean            # Clean all build artifacts
```

### Application-Specific Commands
```bash
# Web App (apps/web)
cd apps/web
pnpm dev              # Next.js dev with Turbopack and pino-pretty
pnpm build            # Production build with environment variables
pnpm lint             # Next.js ESLint

# Assistant API (apps/assistant-api) 
cd apps/assistant-api
pnpm dev              # Run with tsx for TypeScript support
pnpm dev:mastra       # Run with Mastra CLI for enhanced development
pnpm build            # TypeScript compilation to dist/
pnpm start            # Production server

# Dev Panel (apps/prompt-eval-panel)
cd apps/prompt-eval-panel  
pnpm dev              # Next.js dev on port 3002 with pino-pretty
pnpm build            # Production build
pnpm lint             # Next.js ESLint

# Landing Page (apps/landing-page)
cd apps/landing-page
pnpm dev              # Next.js dev with Turbopack
pnpm build            # Production build
pnpm lint             # Next.js ESLint
```

## TypeScript Configuration

### Configuration Hierarchy
- **Root `tsconfig.json`**: Base configuration with strict mode, ES2017 target
- **Per-app configs**: Each app extends and customizes the base configuration

#### Key Differences by Application:
- **Web App (`apps/web/`)**: `strict: false` for rapid development, `@/*` path mapping to app root
- **Assistant API (`apps/assistant-api/`)**: `strict: true`, ES2022 target, ESM modules, compilation to `dist/`
- **Dev Panel (`apps/prompt-eval-panel/`)**: `strict: false`, Next.js optimized
- **Landing Page (`apps/landing-page/`)**: `strict: true`, minimal configuration

## Architecture

### Web Application (`apps/web/`)

#### Framework & Structure
- **Next.js 15 App Router** with TypeScript, TailwindCSS v4
- **Authentication**: Clerk integration with custom theming
- **State Management**: TanStack Query for server state, React Context for app state
- **Styling**: TailwindCSS with Radix UI components, custom design system

#### Feature-Driven Architecture
```
apps/web/
├── app/                    # Next.js App Router
│   ├── (main)/            # Protected route group
│   │   ├── chat/          # Chat interface routes
│   │   ├── courses/       # Course management
│   │   ├── content/       # Content browsing
│   │   └── flashcards/    # Flashcard study interface
│   ├── api/               # API routes for database operations
│   └── onboarding/        # User onboarding flow
├── features/              # Domain-driven feature modules
│   ├── chat/              # Chat functionality
│   │   ├── chat-operations.ts      # Database operations (functions)
│   │   ├── services/               # Specialized services
│   │   │   ├── chat-streaming.service.ts    # Real-time streaming
│   │   │   ├── chat-title-generator.ts      # AI title generation
│   │   │   ├── resource-augmentor.ts        # Resource fetching
│   │   │   └── chat.service.ts              # Orchestration layer
│   │   ├── utils/                  # Navigation utilities
│   │   │   └── navigation.ts       # Router utility functions
│   │   ├── chat.types.ts           # Type definitions
│   │   └── *Context.tsx            # React contexts
│   ├── flashcards/        # Flashcard system
│   │   ├── types.ts                # TypeScript interfaces
│   │   ├── services/               # Business logic functions
│   │   │   └── flashcard.service.ts # Pure utility functions
│   │   └── components/             # React components
│   ├── assistant/         # AI assistant functionality
│   │   └── operations.ts           # Suggested queries functions
│   ├── courses/           # Course management
│   │   └── operations.ts           # Course-related functions
│   ├── auth/              # Authentication utilities
│   │   └── operations.ts           # Auth helper functions
│   └── document/          # Document processing and upload
├── components/            # Shared UI components
│   ├── ui/                # Radix-based design system components
│   └── *.tsx              # App-specific components
├── hooks/api/             # TanStack Query hooks for data fetching
└── lib/                   # Core utilities and services
    ├── services/          # External integrations
    │   ├── ai/            # AI service integrations
    │   ├── database/      # Supabase service layer
    │   ├── document-ingestion/ # Document processing pipeline
    │   └── file/          # File validation and security
    └── types/             # Shared type definitions
```

#### Key Architectural Patterns
- **Function-Based Operations**: Pure functions for business logic in `*-operations.ts` and `*.service.ts` files
- **Selective Service Layer**: Singleton services only for stateful operations (streaming, global state)
- **Feature Modules**: Domain-specific folders with clear separation of concerns
  - `operations.ts` - Database operations and pure business logic
  - `services/` - Specialized services for complex stateful operations
  - `utils/` - Simple utility functions
  - `types.ts` - TypeScript interface definitions
  - `components/` - React components
- **Context Providers**: Global state management for chat navigation and pending chats
- **Custom Hooks**: API integration layer using TanStack Query
- **Security-First**: Comprehensive file validation, content sanitization, access controls

### Assistant API (`apps/assistant-api/`)

#### Modern Agent-Based Architecture  
- **Mastra Framework**: Agent orchestration with workflows and tool calling
- **Anthropic Claude 3.5 Sonnet**: Primary LLM for conversational AI
- **OpenAI Embeddings**: text-embedding-3-small for vector search (1536 dimensions)
- **Supabase pgvector**: Vector database for semantic document retrieval
- **Server-Sent Events**: Streaming responses compatible with web app

#### Core Components
```
apps/assistant-api/
├── src/mastra/
│   ├── agents/
│   │   ├── studyspot-agent.ts         # Main conversational agent
│   │   └── query-reformulation-agent.ts # Query processing agent
│   ├── tools/
│   │   ├── get-full-document.tool.ts   # Document retrieval
│   │   ├── list-all-documents.tool.ts  # Document listing
│   │   ├── semantic-search.tool.ts     # Vector search
│   │   └── set-sources.tool.ts         # Source attribution
│   └── workflows/
│       └── rag-workflow.ts             # Complete RAG orchestration
├── src/services/
│   ├── config-loader.service.ts        # Prompt configuration management
│   ├── supabase.service.ts             # Database integration
│   └── embedding.service.ts            # Vector embedding generation
├── api/chat/
│   └── stream.ts                       # SSE streaming endpoint
└── server.js                           # Node.js server setup
```

#### RAG Workflow Architecture
1. **Query Analysis**: Determine if RAG retrieval is needed
2. **Vector Search**: Semantic similarity search across course documents  
3. **Document Retrieval**: Fetch complete documents based on search results
4. **Response Generation**: Claude 3.5 with course context and conversation history
5. **Source Attribution**: AI-controlled document linking for citations

### Development Panel (`apps/prompt-eval-panel/`)

#### Testing & Evaluation Platform
- **Next.js 15** with TypeScript for rapid UI development
- **TanStack Query** for data fetching and caching
- **Recharts** for analytics visualization and quality metrics
- **Assistant API Proxy** for testing different prompt configurations

#### Key Features
- **Single Test Runner**: Execute individual queries with real-time results
- **A/B Comparison Framework**: Compare different prompt configurations side-by-side
- **Response Quality Evaluation**: AI-powered response scoring using Claude 3.5 Haiku
- **Document Usage Analytics**: Track which documents are referenced by the AI
- **Prompt Override System**: Runtime prompt customization for experimentation

## Core Services & Integration

### AI and RAG System
- **RAG Workflow** (`apps/assistant-api/src/mastra/workflows/rag-workflow.ts`): Complete AI orchestration with Mastra
- **StudySpot Agent**: Primary conversational agent using Claude 3.5 Sonnet with scratchpad reasoning
- **Document Tools**: `get_full_document`, `semantic_search`, `list_all_documents`, `set_sources`
- **Config Management**: Centralized prompt configuration loading from root `config/` folder
- **Streaming Service**: Server-Sent Events for real-time response streaming

### Document Processing Pipeline
- **Document Ingestion** (`apps/web/lib/services/document-ingestion/`): File upload, extraction, text processing
- **Course Extraction Service** (`apps/web/features/document/services/course-extraction.service.ts`): AI-powered course validation
- **File Security**: Multi-layer validation with content verification, type checking, and sanitization
- **Vector Embedding**: OpenAI text-embedding-3-small for semantic search preparation

### Database and Authentication
- **Supabase Service** (`apps/web/lib/services/database/supabase.service.ts`): Comprehensive database abstraction layer
  - Authenticated and anonymous client management
  - Query execution with retries and error handling
  - Transaction support and query optimization
- **Database Schema**: PostgreSQL with pgvector for embeddings (1536 dimensions)
  - `chunks` table: Document text chunks with vector embeddings
  - `documents` table: File metadata and course associations
  - `courses` table: Course hierarchy with school relationships
- **Authentication**: Clerk integration with JWT-based Supabase authentication
- **Security**: Row-Level Security (RLS) policies ensuring user data isolation

### State Management & Data Flow

#### Web App Data Architecture
- **TanStack Query**: Server state management with caching, optimistic updates
- **React Context**: App-level state (chat navigation, pending chats, developer mode)
- **Custom Hooks** (`apps/web/hooks/api/`): Typed API integration layer
  - `chats.ts`: Chat CRUD operations and streaming
  - `courses.ts`: Course management and selection
  - `documents.ts`: Document upload and processing
  - `user.ts`: User preferences and onboarding state

#### Chat System Architecture
- **Modular Chat System** with clean separation of concerns:
  - **Chat Operations** (`features/chat/chat-operations.ts`): Pure database functions
  - **Chat Streaming Service** (`features/chat/services/chat-streaming.service.ts`): Real-time SSE processing
  - **Chat Title Generator** (`features/chat/services/chat-title-generator.ts`): AI-powered title generation
  - **Resource Augmentor** (`features/chat/services/resource-augmentor.ts`): Document and resource fetching
  - **Chat Service** (`features/chat/services/chat.service.ts`): Orchestration layer maintaining backward compatibility
  - **Navigation Utils** (`features/chat/utils/navigation.ts`): Router utility functions
- **Chat Navigation Context**: Persistent chat state during navigation
- **Pending Chat Context**: Temporary chat state for new conversations

## Code Conventions & Patterns

### Service Architecture Patterns
- **Function-First Approach**: Pure functions for stateless business logic and database operations
- **Selective Singletons**: Singleton pattern only for legitimate use cases (streaming services, global state)
- **Operations Pattern**: Database operations and business logic in `*-operations.ts` files using pure functions
- **Service Layer**: Complex stateful operations in `services/` directories when singleton pattern is justified
- **Error Handling**: Custom error service with specific error codes and context (`error-response.service.ts`)
- **Type Safety**: Comprehensive TypeScript interfaces for all API requests/responses
- **Logging**: Pino logger with structured logging and pretty formatting in development

### File Naming & Organization
- **Operations**: `*-operations.ts` - Database operations and pure business logic functions
- **Services**: `*.service.ts` - Complex stateful business logic (use sparingly, prefer operations)
- **Types**: `*.types.ts` - TypeScript interface definitions  
- **Components**: `*.tsx` - React components with PascalCase naming
- **Hooks**: `use-*.ts` - Custom React hooks with camelCase naming
- **Utils**: `*.ts` - Pure utility functions for simple transformations

### Import Conventions
- **Path Aliases**: `@/*` maps to application root in web app
- **Absolute Imports**: Prefer absolute imports over relative for clarity
- **Function Imports**: Import individual functions from operations and utility files
- **Service Imports**: Import singleton instances for legitimate stateful services
- **Type-Only Imports**: Use `import type` for TypeScript interfaces
- **AI Service Layer**: Always use consolidated AI services (`lib/services/ai/`) instead of direct client imports

### AI Provider Integration
- **Multi-Provider Support**: Anthropic Claude 3.5, OpenAI (embeddings), Google Gemini
- **Unified Interface**: Consistent service layer abstractions across different AI providers
- **Model Configuration**: Environment-based model selection and API key management
- **Streaming Architecture**: Real-time response streaming with tool-calling capabilities
- **Context Management**: Conversation history with course-specific context and memory

## Architecture Design Principles

### Function-First Architecture
- **Pure Functions Preferred**: Stateless business logic implemented as pure functions for better testability
- **Operations Pattern**: Database operations and business logic in dedicated `*-operations.ts` files
- **Selective Complexity**: Use classes/singletons only when truly needed for stateful operations

### Anti-Patterns Eliminated
- ❌ **Singleton Abuse**: No more singleton classes for stateless operations
- ❌ **Unnecessary Abstraction**: Removed wrapper classes around simple operations
- ❌ **Mixed Responsibilities**: Clear separation between database, business logic, and presentation layers
- ❌ **Direct Client Imports**: All AI integrations go through service layer

### Current Best Practices
- ✅ **Feature-Driven Organization**: Domain-specific code in `features/` directories
- ✅ **Clear Separation of Concerns**: Operations, services, utils, and components have distinct roles
- ✅ **Testable Architecture**: Pure functions and modular design enable comprehensive testing
- ✅ **Type Safety**: Strong TypeScript throughout with minimal `any` usage
- ✅ **Service Layer**: Consolidated AI services with consistent interfaces

## Environment Setup

### Required Environment Variables
```bash
# Database (Supabase)
SUPABASE_URL=                           # Supabase project URL
SUPABASE_ANON_KEY=                      # Public anon key for client access
SUPABASE_SERVICE_ROLE_KEY=              # Service role key for admin operations

# Authentication (Clerk)
CLERK_SECRET_KEY=                       # Clerk backend secret key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=      # Clerk frontend publishable key

# AI Providers
OPENAI_API_KEY=                         # OpenAI API key (for embeddings)
ANTHROPIC_API_KEY=                      # Anthropic API key (for Claude 3.5)
GEMINI_API_KEY=                         # Google Gemini API key (optional)

# File Upload (UploadThing)
UPLOADTHING_SECRET=                     # UploadThing secret key
UPLOADTHING_APP_ID=                     # UploadThing application ID

# Inter-Service Communication
NEXT_PUBLIC_ASSISTANT_API_URL=http://localhost:3001  # Assistant API service endpoint
```

### Development Dependencies
- **Node.js**: v20.9.0+ required for ES modules and modern features
- **pnpm**: Workspace-aware package manager for monorepo management
- **Turbopack**: Next.js development bundler for faster builds and HMR
- **ESLint**: Next.js configuration with project-specific customizations

## Testing & Quality Assurance

### Testing Infrastructure
- **No automated testing** currently configured for web app
- **Development Panel**: Manual testing and quality evaluation via `apps/prompt-eval-panel`
- **RAG Testing**: A/B comparison framework for prompt engineering
- **Response Quality**: AI-powered evaluation using Claude 3.5 Haiku

### Quality Evaluation Process
1. **Single Test Runner**: Execute individual queries with real-time response analysis
2. **Prompt Comparison**: Side-by-side testing of different configurations
3. **Document Usage Analytics**: Track which documents are being referenced
4. **Response Time Monitoring**: Performance metrics for optimization

## Database Schema & Integration

### Core Tables
- **`chunks`**: Document text segments with vector embeddings (1536 dimensions)
  - `id`, `content`, `embedding`, `document_id`, `course_id`
- **`documents`**: File metadata and course associations
  - `id`, `file_name`, `file_type`, `course_id`, `user_id`, `upload_date`
- **`courses`**: Course hierarchy with school relationships
  - `id`, `name`, `course_code`, `school_id`, `created_by`
- **`chats`**: Conversation history and message storage
  - `id`, `user_id`, `course_id`, `messages`, `created_at`

### Security Architecture
- **Row-Level Security (RLS)**: PostgreSQL policies ensuring user data isolation
- **Clerk Integration**: JWT-based authentication with Supabase
- **File Validation**: Multi-layer security for document uploads
  - Content type verification, file size limits, content scanning
- **Content Sanitization**: DOMPurify for user-generated content
- **Rate Limiting**: Service-layer protection against abuse

### AI Tool Integration
- **Vector Search**: Semantic similarity search using pgvector extension
- **Document Retrieval**: Complete document reconstruction from chunks
- **Course Context**: All AI interactions scoped to user's selected course
- **Source Attribution**: AI-controlled document linking for citations
- **Real-time Suggestions**: Context-aware query suggestions based on course content