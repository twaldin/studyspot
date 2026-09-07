# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StudySpot is an AI-powered study assistant monorepo enabling college students to create collaborative course knowledge bases, upload course materials, and get AI-powered answers using RAG (Retrieval-Augmented Generation). The architecture is built on Cloudflare's distributed edge platform for global performance and reliability.

This is the frozen original implementation, not the separate co-founder rewrite currently serving studyspot.us; see [README.md](README.md). Deployment descriptions below describe committed configuration, not verified live infrastructure. Inspect scripts before running them: local app workflows can contact external providers, and build/deployment scripts handle credentials.

## Monorepo Architecture

This is a **pnpm workspace monorepo** with a distributed Cloudflare Workers architecture:

### Applications

#### 1. **@studyspot/web** (`apps/web/`)

- **Purpose**: Main Next.js 15 frontend application deployed as Cloudflare Worker
- **Tech Stack**: Next.js 15 App Router, TypeScript, TailwindCSS 4, Clerk Auth, TanStack Query
- **Features**: Course management, document upload, AI chat interface, user onboarding
- **Deployment**: Cloudflare Workers via OpenNext.js
- **Database**: Supabase PostgreSQL with Clerk-JWT and service-role access paths; see Security Architecture for RLS limitations

#### 2. **Assistant Worker** (`workers/assistant/`)

- **Purpose**: Mastra-based AI assistant deployed as Cloudflare Worker
- **Tech Stack**: Mastra framework with Cloudflare deployer, Anthropic Claude 3.5, OpenAI embeddings, Supabase vector search
- **Features**: RAG workflows, document retrieval tools, streaming responses, persistent stream management, built-in Mastra playground
- **Deployment**: Cloudflare Workers with global edge distribution
- **Streaming**: Buffered events and reconnection support within one Worker isolate; see lifetime limitations below

#### 3. **landing-page** (`apps/landing-page/`)

- **Purpose**: Marketing/landing page for StudySpot
- **Tech Stack**: Next.js 15, TailwindCSS
- **Features**: Static landing page
- **Deployment**: Cloudflare Workers via OpenNext.js

### Shared Packages

#### **@studyspot/ui** (`packages/ui/`)

- **Purpose**: Shared UI component library and design system used by the web app
- **Tech Stack**: React 19 declared by this package, Radix UI primitives, TailwindCSS 4, TypeScript; its web consumer separately declares React 18.3.1
- **Components**: 20+ pre-built components (Button, Card, Dialog, Form, etc.)
- **Features**:
  - Reusable design system for the web app; the landing page has its own components
  - Radix UI accessibility primitives
  - TailwindCSS 4 styling with CSS variables
  - Component variants using class-variance-authority
  - Export-based modular architecture
- **Usage**: Consumed by the web app via `@studyspot/ui`; the landing page does not declare this workspace dependency
- **Exports**: Components, hooks, utilities, and global styles via package.json exports

### Configuration Management

#### Root Configuration (`config/`)

- **`prompt-configs/`**: Retained prompt configurations for development/evaluation, not files loaded by the worker at runtime
  - `active.json`: Reference system prompt, RAG-decision prompt and tool instructions; the running worker reads inline `DEFAULT_CONFIG` in `workers/assistant/src/services/config-loader.service.ts`
  - `test.json`, `test1.json`: Alternative prompt configurations retained for evaluation
- **`test-queries/`**: Retained query sets for evaluation
  - `queries.json`: RAG evaluation queries, not proof of a running production test suite
  - `template-queries.json`: Template queries for development

## Development Commands

### Root Level Commands

Root `dev:assistant` runs Wrangler from generated `workers/assistant/.mastra/output`; it does not build or watch Mastra source. On a fresh checkout, configure a development environment and run `pnpm build:assistant` before `pnpm dev`; rebuild after assistant source changes. The worker package's own `pnpm dev` runs the separate Mastra development server/playground.

`workers/assistant/build.sh` temporarily renames three worker-local `.env` files while building, then copies selected root `.env` values into `.mastra/output/.dev.vars`. This is not complete environment isolation: inherited variables remain available, and interruption can leave renamed files behind. Inspect this script before use; never commit generated credentials.

```bash
# Local development (concurrent web + assistant worker)
pnpm dev                    # Starts both web app (port 3000) and assistant worker (port 8787)
pnpm dev:web               # Web app only - Next.js with Turbopack
pnpm dev:assistant         # Assistant worker local development with Wrangler
pnpm dev:assistant-remote  # Assistant worker with remote Cloudflare env
pnpm dev:remote            # Concurrent web + remote assistant worker
pnpm dev:cloudflare        # Build then run both in Cloudflare mode

# Build and deployment
pnpm build                 # Build web + assistant only
pnpm build:web            # Build web for Cloudflare Workers; loads apps/web/.env.production
pnpm build:assistant      # Build assistant via build.sh; prepares local .dev.vars
pnpm build:landing        # Standard Next.js landing build, not an OpenNext build
pnpm deploy               # Deploy web + assistant + landing; does not build them first
pnpm deploy:web           # OpenNext deploy of existing web build
pnpm deploy:assistant     # Wrangler deploy from assistant .mastra/output
pnpm deploy:landing       # OpenNext deploy of existing landing build

# Secrets management
pnpm secrets:list:assistant    # List secrets for assistant worker
pnpm secrets:set:assistant     # Set secrets for assistant worker
pnpm secrets:list:web         # List secrets for web app worker
pnpm secrets:set:web          # Set secrets for web app worker

# Maintenance
pnpm lint                 # Run declared workspace lint scripts
pnpm test                 # Recursive test entry point; no workspace test scripts are declared
pnpm clean                # Recursive clean entry point; no workspace clean scripts are declared
```

### Application-Specific Commands

Run each block from the repository root.

```bash
# Web App (apps/web) - Cloudflare Workers deployment
cd apps/web
pnpm dev                  # Next.js dev with Turbopack + pino-pretty logging
pnpm build               # Standard Next.js build
pnpm build:cloudflare    # OpenNext.js Cloudflare build
pnpm dev:wrangler        # Wrangler dev server for testing Cloudflare integration
pnpm deploy              # Build with OpenNext.js, then deploy with Wrangler
pnpm lint                # Next.js ESLint
```

```bash
# Assistant Worker (workers/assistant) - Mastra + Cloudflare Workers
cd workers/assistant
pnpm dev                 # Mastra development server/playground, not root Wrangler dev
pnpm build              # Custom build.sh; see environment caveats above
pnpm build:unsafe       # Direct Mastra build without the build.sh env-file handling
pnpm deploy             # Wrangler deploy of existing .mastra/output/wrangler.json
pnpm typecheck          # TypeScript type checking
```

```bash
# Landing Page (apps/landing-page) - Cloudflare Workers via OpenNext.js
cd apps/landing-page
pnpm dev                # Wrangler dev using existing .open-next output
pnpm build              # Standard Next.js build
pnpm build:cloudflare   # Generate .open-next output for Wrangler
pnpm dev:wrangler       # Wrangler on port 3001, avoiding root assistant's default port
pnpm deploy             # OpenNext deploy of existing build
pnpm lint               # Next.js ESLint
```

## Architecture Deep Dive

### Web Application (`apps/web/`)

#### Framework & Structure

- **Next.js 15 App Router** with TypeScript 5.9.2 and TailwindCSS 4; `strict: false` but `strictNullChecks: true`. Web builds ignore TypeScript errors via `next.config.js`
- **Cloudflare Workers Compatibility**: OpenNext.js integration with specific webpack configuration for edge runtime
- **Authentication**: Clerk integration with custom theming and JWT-based Supabase authentication
- **State Management**: TanStack Query v5 for server state, React Context for app state
- **Styling**: TailwindCSS 4.0 with Radix UI components, custom design system, unoptimized images for Cloudflare

#### Feature-Driven Architecture

Selected paths, not an exhaustive inventory. Authentication uses route matchers in `apps/web/middleware.ts`, with exceptions for public share viewers; there is no `(main)` route group.

```
apps/web/
├── app/                    # Next.js App Router; middleware handles authentication
│   ├── chat/              # Chat UI, including [chatId]/share/[shareToken] viewers
│   ├── courses/           # Course selection and management interface
│   ├── content/           # Course content browsing and document viewing
│   ├── flashcards/        # Interactive flashcard study interface
│   ├── quiz/              # Interactive quizzes
│   ├── api/               # Server-side API routes with comprehensive endpoints
│   │   ├── chats/         # Chat CRUD operations and conversation management
│   │   ├── courses/       # Course operations, verification, join/leave
│   │   ├── documents/     # Document ingestion streaming and file processing
│   │   ├── uploadthing/   # File upload handler with security validation
│   │   └── user/          # User management, onboarding, preferences
│   └── onboarding/        # Multi-step user onboarding flow
├── features/              # Domain-driven feature modules with clear separation
│   ├── chat/              # Chat functionality with modular architecture
│   │   ├── chat-operations.ts          # Database operation functions (I/O, not pure)
│   │   ├── services/                   # Specialized services layer
│   │   │   ├── chat-streaming.service.ts      # Real-time SSE processing
│   │   │   ├── persistent-stream-client.service.ts  # New persistent stream client
│   │   │   ├── chat-title-generator.ts        # AI-powered title generation
│   │   │   ├── resource-augmentor.ts          # Document and resource fetching
│   │   │   ├── streaming-manager.service.ts   # Legacy manager still used by chat-client.tsx
│   │   │   └── chat.service.ts                # Orchestration layer
│   │   ├── utils/                      # Navigation utilities
│   │   │   └── navigation.ts           # Router utility functions
│   │   ├── chat.types.ts               # TypeScript interfaces
│   │   ├── ChatNavigationContext.tsx   # Persistent chat navigation state
│   │   └── PendingChatContext.tsx      # Temporary chat state management
│   ├── flashcards/        # Interactive flashcard system
│   │   ├── types.ts                    # TypeScript interfaces for flashcard data
│   │   ├── services/                   # Business logic functions
│   │   │   └── flashcard.service.ts    # Pure utility functions for flashcard operations
│   │   └── components/                 # React components for flashcard UI
│   ├── quiz/              # Interactive quiz system
│   │   ├── types.ts                    # TypeScript interfaces for quiz data
│   │   ├── services/                   # Business logic functions
│   │   │   └── quiz.service.ts         # QuizService singleton for quiz operations
│   │   └── components/                 # React components for quiz UI
│   ├── assistant/         # AI assistant functionality
│   │   └── operations.ts               # Suggested queries and AI interaction functions
│   ├── courses/           # Course management with Canvas integration
│   │   ├── operations.ts               # Course-related database functions
│   │   ├── course.model.ts             # TypeScript data models
│   │   ├── course-extraction.ts        # AI-powered course information extraction
│   │   └── components/                 # React components for course UI
│   └── auth/              # Authentication utilities and operations
│       ├── operations.ts               # Auth helper functions with Clerk integration
│       └── types.ts                    # Authentication type definitions
├── components/            # Shared UI components with consistent design system
│   ├── ui/                # App-specific composites; shared primitives live in packages/ui
│   └── *.tsx              # App-specific reusable components
├── hooks/api/             # TanStack Query hooks for type-safe data fetching
│   ├── chats.ts           # Chat CRUD operations with optimistic updates
│   ├── courses.ts         # Course management API integration
│   ├── documents.ts       # Document upload and processing hooks
│   └── user.ts            # User preferences and onboarding state
└── lib/                   # Core utilities and services
    ├── services/          # External integrations and core business logic
    │   ├── ai/            # Multi-provider AI service integrations
    │   │   ├── ai-sdk-service.ts        # Unified AI service interface
    │   │   ├── gemini.service.ts        # Google Gemini integration
    │   │   └── course-code-generator.service.ts  # AI-powered course code generation
    │   ├── database/      # Supabase service layer with comprehensive error handling
    │   │   └── supabase.service.ts      # Singleton service with retry logic and caching
    │   ├── canvas/        # Canvas LMS integration services
    │   │   ├── canvas.service.ts        # Canvas API client
    │   │   ├── canvas-ingestion.service.ts  # Course content ingestion
    │   │   └── canvas.error.ts          # Canvas-specific error handling
    │   ├── file/          # File validation and security services
    │   │   ├── file-validation.service.ts    # Multi-layer file security validation
    │   │   ├── fileSecurityRules.ts          # Security rule definitions
    │   │   ├── upload-security.service.ts    # Upload checks; caller can swallow failures
    │   │   └── verifyFileContent.ts          # Content verification utilities
    │   └── auth/          # Authentication services
    │       └── clerk-edge.service.ts    # Clerk integration for edge runtime
    └── types/             # Shared TypeScript type definitions
        ├── AITypes.ts                   # AI service and response types
        ├── CourseTypes.ts               # Course and education-related types
        └── Document.ts                  # Document processing types
```

Document upload/ingestion spans `components/file-upload-dialog.tsx`, `hooks/use-document-processing.ts`, `hooks/api/documents.ts`, `app/api/uploadthing/` and `app/api/documents/ingest-stream/`; it is not a `features/document/` module.

#### Key Architectural Patterns

- **Function-Based Operations**: Prefer functions for business logic; database operations perform I/O and are not pure
- **Selective Service Layer**: Prefer singletons for stateful needs, but stateless singleton classes remain (for example `QuizService`); the migration is incomplete
- **Feature Modules**: Domain-specific folders with clear separation of concerns
  - `operations.ts` - Database operations and business logic
  - `services/` - Specialized services for complex stateful operations
  - `utils/` - Simple utility functions
  - `types.ts` - TypeScript interface definitions
  - `components/` - React components
- **Context Providers**: Global state management for chat navigation and pending chats
- **Custom Hooks**: API integration layer using TanStack Query with comprehensive error handling
- **Security Layers**: File validation, content sanitization and JWT-based clients exist; enforcement limitations are documented under Security Architecture

### Assistant Worker (`workers/assistant/`)

#### Mastra Framework Architecture on Cloudflare Workers

- **Mastra Framework**: Agent orchestration with Cloudflare deployer for edge distribution
- **Multi-Provider AI**: Anthropic for chat, relevance checks and course verification; OpenAI for embeddings. Gemini helpers belong to the web app, not this worker
- **Vector Database**: Supabase pgvector with OpenAI text-embedding-3-small (1536 dimensions)
- **Persistent Streaming**: In-memory stream buffering and catch-up within one Worker isolate
- **Global Edge Distribution**: Cloudflare Workers is the configured target; no application latency benchmark is established here

#### Core Components Architecture

```
workers/assistant/
├── src/mastra/
│   ├── agents/                         # AI agent implementations
│   │   ├── studyspot-agent.ts         # Main conversational agent; prompt-driven <thinking> tags
│   │   ├── query-reformulation-agent.ts   # Registered agent, not a stage in rag-workflow
│   │   └── relevance-checker-agent.ts     # Ingestion-time course relevance check
│   ├── tools/                          # AI tools for RAG and content generation
│   │   ├── semantic-search.tool.ts        # Vector similarity search
│   │   ├── get-full-document.tool.ts      # Complete document retrieval
│   │   ├── list-all-documents.tool.ts     # Course document listing
│   │   ├── set-sources.tool.ts            # Source attribution and linking
│   │   ├── generate-flashcard-set.tool.ts # Interactive flashcard generation
│   │   ├── generate-quiz.tool.ts          # Interactive quiz generation
│   │   ├── verify-course.tool.ts          # Backs /courses/verify, not registered on the chat agent
│   │   └── vector-search.tool.ts          # Full-text keyword search despite the filename
│   ├── workflows/                      # Complete AI workflow orchestrations
│   │   ├── rag-workflow.ts                # Single agent step plus streaming adapter
│   │   └── document-ingestion-workflow.ts # Document processing pipeline
│   └── index.ts                        # Mastra configuration and API route definitions
├── src/services/                       # Core business services
│   ├── config-loader.service.ts        # Inline defaults and request prompt overrides
│   ├── supabase.service.ts             # Service-role clients cached by URL/key pair
│   ├── embedding.service.ts            # OpenAI embedding generation service
│   └── suggested-queries.service.ts    # AI-powered query suggestion generation
├── src/streaming/                      # Persistent streaming architecture
│   └── persistent-stream-manager.ts    # Isolate-local buffered stream management
├── build.sh                           # Build and local env-file handling; see caveats above
├── wrangler.toml                      # Cloudflare Workers configuration with KV bindings
└── package.json                       # Mastra + Cloudflare Workers dependencies
```

#### Persistent Streaming Architecture (Current Implementation)

The stream manager buffers events in an in-memory `Map`, decoupling workflow execution from individual subscribers. This is best-effort reconnection support, not durable execution: buffers are not shared across Worker isolates or retained across restarts. The code starts workflow execution in the background without `waitUntil`; source alone does not prove survival after a client disconnect. A 24-hour cleanup timer is not a guaranteed retention period.

**Key Features:**

- **Stream Persistence**: Workflow execution is started independently of subscribers, subject to Worker lifetime
- **Multi-Client Support**: Multiple subscribers can connect to the same stream
- **Catch-up Mechanism**: New subscribers can replay buffered events when the stream is still available
- **End-of-Stream Database Updates**: Attempts one final conversation update rather than incremental writes; empty content or missing session ID skips the write, and failures are logged
- **Tool Activity Preservation**: All existing tool events (`toolActivity`, `chunk`, `done`) work identically
- **Navigation Support**: The client can subscribe again after navigation; the stream must still exist on the responding isolate

**API Endpoints:**

- `POST /chat/stream` - Create new stream or subscribe to existing
- `POST /chat/stream/subscribe` - Subscribe to specific stream with catch-up
- `GET /chat/stream/status` - Stream monitoring and debugging
- `POST /courses/verify` - Course verification using a separate tool
- `POST /documents/ingest-stream` - Document ingestion with progress events
- `GET /suggested-queries` - KV-cached suggested queries

#### RAG Workflow Architecture

1. **Agent Turn**: `rag-workflow.ts` runs one StudySpot agent step with course context and conversation history; the streaming adapter calls the agent directly
2. **Agent-Chosen Retrieval**: `semantic_search` embeds the query and calls `match_documents_by_course`; full-document and document-list tools provide additional context. Query reformulation and RAG-decision prompts are retained but are not separate stages in this workflow
3. **Response Generation**: `studyspot-agent.ts` pins `claude-3-5-sonnet-20241022`; the model/temperature returned by the config loader are logged, not used to select the agent model
4. **Source Attribution**: `set_sources` tool results provide linked document IDs
5. **Streaming Response**: SSE chunks and tool activity; `<thinking>` tags are prompt-driven, not a provider reasoning mode

#### Mastra Configuration & Deployment

- **CloudflareDeployer**: Automated deployment configuration with KV namespace bindings
- **Custom Build Process**: `build.sh` temporarily hides worker-local env files and prepares generated `.dev.vars`; see Development Commands for limitations
- **Environment Handling**: Root web builds load `apps/web/.env.production`; assistant local vars are copied from the root `.env`
- **KV Storage Integration**: Cloudflare KV caches suggested queries; prompt defaults are in source, not KV
- **Service Bindings**: Direct worker-to-worker communication between web app and assistant

### Configuration Management & Secrets

#### Environment Variables Architecture

**Environment Variables Referenced by Source/Configuration** (requirements depend on the feature; this is not a validated deployment recipe):

```bash
# Database (Supabase) - Required for both applications
SUPABASE_URL=                           # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=              # Service role key for admin operations
NEXT_PUBLIC_SUPABASE_URL=               # Public URL for client-side access
NEXT_PUBLIC_SUPABASE_ANON_KEY=          # Public anonymous key

# Authentication (Clerk) - Web app only
CLERK_SECRET_KEY=                       # Clerk backend secret key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=      # Clerk frontend publishable key

# AI Providers - Assistant and web features
OPENAI_API_KEY=                         # Embeddings
ANTHROPIC_API_KEY=                      # Assistant chat
GOOGLE_API_KEY=                         # Web Gemini helpers; required by some helper guards
GEMINI_API_KEY=                         # Alternate key accepted by web GeminiService
LLAMA_CLOUD_API_KEY=                    # Required for non-duplicate assistant document ingestion

# File Upload (UploadThing v7) - Web app
UPLOADTHING_TOKEN=                      # Token named in apps/web/wrangler.toml
UPLOADTHING_CALLBACK_URL=               # Upload callback override

# Assistant URL - Needed by browser chat; some server paths use a service binding
NEXT_PUBLIC_ASSISTANT_API_URL=          # Primary assistant endpoint setting
NEXT_PUBLIC_ASSISTANT_WORKER_URL=       # Fallback accepted by some, not all, callers

# Cloudflare tooling - Deployment only
CLOUDFLARE_API_TOKEN=                   # Cloudflare API token
CLOUDFLARE_ACCOUNT_ID=                  # Account override in the Mastra deployer
CLOUDFLARE_API_EMAIL=                   # Email read by the Mastra deployer
```

#### Secrets Management Best Practices

- **Cloudflare Workers Secrets**: Use `wrangler secret put` for all sensitive data
- **Development Environment**: Use `.dev.vars` files for local Wrangler development
- **Production Separation**: Keep secrets out of committed configuration and generated build artifacts
- **Build Handling**: Inspect `build.sh` and generated configuration; hiding selected env files is not a guarantee against credential leakage

### Database Architecture & Integration

#### PostgreSQL Schema with Vector Extensions

This is a source-level map, not an authoritative schema. No SQL migrations or RLS policies are committed. `apps/web/lib/database.types.ts` and assistant query code disagree in places; preserve those discrepancies until a separately authorized schema audit can resolve them.

**Core Tables:**

- **`chunks`**: Document text segments with vector embeddings (1536 dimensions)
  - Web types list `id`, `doc_id`, `content`, `embedding`, `created_at`; assistant inserts also write `chunk_count`, and its result interface includes `course_id`. Course association on ingestion is through `docs.course_id`
- **`docs`**: File metadata and course associations
  - `id`, `file_name`, `file_url`, `file_type`, `course_id`, `file_hash`, `course_provided`
- **`courses`**: Course hierarchy with school relationships and Canvas integration
  - `id`, `code`, `title`, `school_id`, `icon`, `canvas_course_id`
- **`schools`**: Educational institution information
  - `id`, `name`, `city`, `state`, `domain`, `logo_url`
- **`chats`**: Conversation history with JSONB message storage
  - Web types list `id`, `user_id`, `course_id`, `title`, `chats` (JSONB), `created_at`, `is_public`, `share_token`, `visibility_mode`; assistant updates also write `updated_at`, which the web type omits

- **Study tools**: `flashcard_sets` / `flashcards` and `quizzes` / `quiz_questions`
- **Additional typed tables**: `lecture_chat_sessions` / `lecture_chat_messages`; retained schema knowledge, not proof of an active feature

**Vector Search Functions:**

- **`match_chunks`**: Declared in `apps/web/lib/database.types.ts`, but not called by the assistant retrieval path
- **`match_documents_by_course`**: Course-scoped vector-search RPC called by `workers/assistant/src/services/supabase.service.ts`

The worker RPC is absent from the web type file; neither SQL function definition is committed.

#### Database Service Architecture

**Web App Service** (`apps/web/lib/services/database/supabase.service.ts`):

- Comprehensive singleton service with authenticated and anonymous clients
- Retry logic with exponential backoff for network resilience
- Query execution with timeout handling and error categorization
- Anonymous-client caching; authenticated clients are created per request, not pooled by this service
- Cloudflare context integration for service role operations

**Assistant Worker Service** (`workers/assistant/src/services/supabase.service.ts`):

- Service-role clients cached by URL/key pair, accepting an injected Worker environment or `process.env`; no named dev/staging/prod client setup
- Direct service role access for RAG operations
- Optimized for edge runtime performance
- Comprehensive database operations for AI workflows

#### Security Architecture

- **Supabase Access**: Clerk `supabase` JWTs are forwarded with the anon key for authenticated clients. Service-role clients are also used by the assistant and web sharing/public/upload paths; they bypass RLS and depend on application-level authorization. Committed source does not establish the deployed RLS policies
- **File Validation Pipeline**: MIME/extension/size checks, magic-number and content-pattern rules, and DOCX inspection helpers exist. However, `app/api/uploadthing/core.ts` logs and swallows failures from its additional security/file-validation block; those checks are not a reliable rejection gate. Its separate signed-in-user check and UploadThing's declared file type/size limits remain
- **HTML Sanitization**: Assistant, flashcard and quiz renderers use DOMPurify on the client; their SSR branches return unsanitized HTML. Do not treat this as universal sanitization
- **Rate Limiting**: Query hooks use a browser-side throttle; upload checks use a per-isolate in-memory counter (10 attempts/minute) and can be swallowed by the upload handler above. These are not durable, global API enforcement

## Development Environment Integration

StudySpot is designed to work with Claude Code and supports MCP (Model Context Protocol) servers for enhanced development workflows. Individual developers may configure their own MCP servers and development environments based on their preferences.

For specific MCP configurations and personal development setups, refer to your local CLAUDE.local.md file (not tracked in git).

## Code Conventions & Patterns

The following are design conventions to prefer, not claims that the frozen tree has completed every refactor. Existing stateless singletons, direct provider integrations in worker agents/tools, and broad `any` types remain.

### Service Architecture Patterns

- **Function-First Approach**: Prefer functions for stateless business logic; keep I/O explicit in database operations
- **Selective Singletons**: Reserve new singletons for stateful services, external API clients or global state
- **Operations Pattern**: Group database operations and business logic in operation modules without describing I/O as pure
- **Service Layer**: Complex stateful operations in `services/` directories when singleton pattern is justified
- **Error Handling**: Comprehensive error service with specific error codes and contextual information
- **Type Safety**: Prefer explicit API interfaces; existing types are partial and `any` remains common
- **Logging**: Pino logger with structured logging and pretty formatting in development

### File Naming & Organization Conventions

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
- **AI Service Layer**: In the web app, use consolidated AI services (`lib/services/ai/`); worker agents/tools instantiate their providers directly

### AI Provider Integration Standards

- **Multi-Provider Support**: Anthropic Claude 3.5, OpenAI (embeddings), Google Gemini
- **Unified Interface**: Consistent service layer abstractions across different AI providers
- **Model Configuration**: Assistant models are selected in agent/tool source, not by env vars or edits to prompt JSON alone; provider keys come from the environment
- **Streaming Architecture**: Real-time response streaming with tool-calling capabilities
- **Context Management**: Conversation history with course-specific context and memory
- **Prompt Configuration**: Worker runtime defaults live in `config-loader.service.ts`; preserve the reference JSON in `config/prompt-configs/`, but editing that JSON alone does not change runtime behavior

## Testing & Quality Assurance

### Development Testing Approach

- **Manual Testing**: Primary approach using Mastra Playground and direct interaction
- **Mastra Playground**: Built-in testing via assistant worker's Mastra playground at development URL
- **RAG Workflow Testing**: Test vector search, document retrieval, and response generation
- **Persistent Streaming Testing**: Verify stream continuity across client disconnections
- **Cross-Browser Testing**: Browser automation such as Playwright; an MCP server is optional

### Quality Evaluation Process

1. **Mastra Playground**: Execute workflows and test configurations in real-time
2. **Local Development Testing**: Direct interaction with assistant worker endpoints
3. **Document Usage Monitoring**: Track which documents are being referenced in responses
4. **Performance Monitoring**: Response time metrics via Cloudflare Workers analytics
5. **Browser Testing**: Automated UI testing and screenshot verification; MCP is optional

### Performance Optimization

- **Cloudflare Edge Distribution**: Measure latency in an authorized environment; the repository establishes no sub-50ms guarantee
- **Vector Search Optimization**: Efficient pgvector queries with similarity thresholds
- **Persistent Streaming**: Replays buffered events when the isolate-local stream remains available; does not guarantee no lost responses
- **Client Caching**: TanStack Query provides client caching; `lib/utils/cache-manager.ts` coordinates cache clearing. This is not a Service Worker cache
- **Lazy Loading**: Dynamic imports and component-level code splitting

## Deployment Architecture

### Cloudflare Workers Platform

- **Global Edge Network**: The configured target is Cloudflare Workers; this repository does not establish a current location count or latency guarantee
- **Automatic Scaling**: Handle traffic spikes without infrastructure management
- **Worker-to-Worker Communication**: Direct service bindings between applications
- **KV Storage Integration**: Suggested-query caching through the `SUGGESTED_QUERIES` binding
- **Built-in Analytics**: Performance monitoring and error tracking

### Deployment Commands & Processes

#### Web Application Deployment

```bash
cd apps/web
pnpm build:cloudflare      # OpenNext.js build for Cloudflare Workers
pnpm deploy               # Rebuild with OpenNext.js, then deploy with Wrangler
```

#### Assistant Worker Deployment

```bash
cd workers/assistant
pnpm build                # Custom build script; inspect environment handling first
pnpm deploy               # Wrangler deploy from generated .mastra/output
```

#### Environment-Specific Deployments

- **Development**: Local Wrangler development with `.dev.vars`
- **Preview**: Web and landing packages declare preview commands, but their committed Wrangler files do not define `[env.preview]`; verify configuration before use
- **Production**: Committed Wrangler configuration describes the original Workers setup, not the live studyspot.us rewrite

### Infrastructure Monitoring

- **Cloudflare Analytics**: Built-in performance and error monitoring
- **Supabase Monitoring**: Database performance and query optimization
- **Custom Logging**: Structured logging with Pino for debugging and analysis
- **Optional MCP Integration**: A personally configured memory server may track deployment history and issues

## Architecture Design Principles

### Function-First Architecture Benefits

- **Testability**: Pure functions enable comprehensive unit testing
- **Maintainability**: Clear separation of concerns and minimal side effects
- **Scalability**: Stateless functions scale horizontally on edge infrastructure
- **Debugging**: Easier to trace issues and understand data flow

### Refactor Direction and Remaining Work

- **Singletons**: Prefer state only where needed. `chat.service.ts` retains a legacy singleton export, and `quiz.service.ts` is still a singleton
- **Abstraction**: Prefer direct functions over wrapper classes when the wrapper adds no state or behavior
- **Responsibilities**: Preserve separation between database operations, business logic and presentation
- **Provider Access**: Web integrations use `lib/services/ai/`; worker agents and tools use provider SDKs directly
- **Feature Organization**: Keep domain modules in `features/`, while recognizing upload/ingestion currently crosses routes, hooks and components
- **Types and Testability**: Modular functions help testing, but web builds ignore type errors and broad `any` usage remains
- **Streaming**: Preserve buffered catch-up while accounting for isolate lifetime and final-write failures
- **MCP**: Personal tooling is optional, not part of the application architecture

## Development Workflow Optimization

### Recommended Development Flow

1. **Environment Setup**: Inspect scripts and configure only the development services needed for the task
2. **Assistant Build**: Run `pnpm build:assistant` before root Wrangler development; review the env-file caveats above
3. **Concurrent Development**: Start web and assistant with `pnpm dev`
4. **Iterative Testing**: Use the worker package's Mastra dev server/playground or browser tooling when authorized; these may contact providers
5. **Optional Tooling**: Personal MCP memory, TypeScript, Playwright and shadcn servers are conveniences, not repository prerequisites; no fixed six-server setup is required

### Common Development Tasks

- **Adding New Features**: Follow feature-first architecture in appropriate domain directory
- **Database Changes**: Update both type definitions and service layer implementations
- **AI Prompt Tuning**: Update runtime defaults in `workers/assistant/src/services/config-loader.service.ts` and keep reference JSON in `config/prompt-configs/` aligned; request prompt overrides are also supported
- **Streaming Modifications**: Work with persistent stream manager for real-time features
- **UI Components**: Reuse existing shared components; a personally configured shadcn MCP server is optional
- **Performance Optimization**: Monitor Cloudflare analytics and optimize edge performance

### Troubleshooting & Debugging

- **Optional MCP Server Issues**: For a personal Claude Code setup, use `claude mcp list` to inspect configured servers
- **Database Connection**: Check Supabase service layer for connection issues
- **Streaming Problems**: Monitor persistent stream manager logs and status endpoints
- **Build Issues**: Review custom build scripts and environment variable isolation
- **Deployment Failures**: Check Cloudflare Workers logs and secret configuration

Use this guide for architecture and operational context; package scripts and source remain authoritative for the frozen implementation.

