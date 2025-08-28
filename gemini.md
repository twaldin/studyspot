# gemini.md

## Project Overview

StudySpot is an AI-powered study assistant monorepo enabling college students to create collaborative course knowledge bases, upload course materials, and get AI-powered answers using RAG (Retrieval-Augmented Generation). The architecture is built on Cloudflare's distributed edge platform for global performance and reliability.

## Monorepo Architecture

This is a **pnpm workspace monorepo** with a distributed Cloudflare Workers architecture:

### Applications

#### 1. **@studyspot/web** (`apps/web/`)

- **Purpose**: Main Next.js 15 frontend application deployed as Cloudflare Worker
- **Tech Stack**: Next.js 15 App Router, TypeScript, TailwindCSS 4, Clerk Auth, TanStack Query
- **Features**: Course management, document upload, AI chat interface, user onboarding
- **Deployment**: Cloudflare Pages with Worker runtime via OpenNext.js
- **Database**: Supabase PostgreSQL with JWT-based RLS security

#### 2. **Assistant Worker** (`workers/assistant/`)

- **Purpose**: Mastra-based AI assistant deployed as Cloudflare Worker
- **Tech Stack**: Mastra framework with Cloudflare deployer, Anthropic Claude 3.5, OpenAI embeddings, Supabase vector search
- **Features**: RAG workflows, document retrieval tools, streaming responses, persistent stream management, built-in Mastra playground
- **Deployment**: Cloudflare Workers with global edge distribution
- **Key Innovation**: Persistent streaming architecture allowing streams to continue even when clients disconnect

#### 3. **landing-page** (`apps/landing-page/`)

- **Purpose**: Marketing/landing page for StudySpot
- **Tech Stack**: Next.js 15, TailwindCSS
- **Features**: Static landing page
- **Deployment**: Cloudflare Pages

### Shared Packages

#### **@studyspot/ui** (`packages/ui/`)

- **Purpose**: Shared UI component library and design system for all applications
- **Tech Stack**: React 19, Radix UI primitives, TailwindCSS 4, TypeScript
- **Components**: 20+ pre-built components (Button, Card, Dialog, Form, etc.)
- **Features**:
  - Consistent design system across web app and landing page
  - Radix UI accessibility primitives
  - TailwindCSS 4 styling with CSS variables
  - Component variants using class-variance-authority
  - Export-based modular architecture
- **Usage**: Consumed by both web app and landing page via `@studyspot/ui` workspace reference
- **Exports**: Components, hooks, utilities, and global styles via package.json exports

### Configuration Management

#### Root Configuration (`config/`)

- **`prompt-configs/`**: Centralized prompt configuration JSON files for AI assistant
  - `active.json`: Currently active prompt configuration with system prompts, RAG decision logic, tool instructions
  - `test.json`, `test1.json`: Test configurations for A/B testing
- **`test-queries/`**: Standard test queries for evaluation
  - `queries.json`: Production test queries for RAG testing
  - `template-queries.json`: Template queries for development

## Development Commands

### Root Level Commands

```bash
# Local development (concurrent web + assistant worker)
pnpm dev                    # Starts both web app (port 3000) and assistant worker (port 8787)
pnpm dev:web               # Web app only - Next.js with Turbopack
pnpm dev:assistant         # Assistant worker local development with Wrangler
pnpm dev:assistant-remote  # Assistant worker with remote Cloudflare env
pnpm dev:remote            # Concurrent web + remote assistant worker
pnpm dev:cloudflare        # Build then run both in Cloudflare mode

# Build and deployment
pnpm build                 # Build all applications
pnpm build:web            # Build web app for Cloudflare Pages (OpenNext.js)
pnpm build:assistant      # Build assistant worker with custom build.sh script
pnpm deploy               # Deploy both to Cloudflare (web app + assistant worker)
pnpm deploy:web           # Deploy web app to Cloudflare Pages via OpenNext.js
pnpm deploy:assistant     # Deploy assistant worker to Cloudflare Workers

# Secrets management
pnpm secrets:list:assistant    # List secrets for assistant worker
pnpm secrets:set:assistant     # Set secrets for assistant worker
pnpm secrets:list:web         # List secrets for web app worker
pnpm secrets:set:web          # Set secrets for web app worker

# Maintenance
pnpm lint                 # Run linting across all packages
pnpm test                 # Run tests across all packages
pnpm clean                # Clean all build artifacts
```

### Application-Specific Commands

```bash
# Web App (apps/web) - Cloudflare Pages deployment
cd apps/web
pnpm dev                  # Next.js dev with Turbopack + pino-pretty logging
pnpm build               # Standard Next.js build
pnpm build:cloudflare    # OpenNext.js Cloudflare build
pnpm dev:wrangler        # Wrangler dev server for testing Cloudflare integration
pnpm deploy              # Build + deploy to Cloudflare Pages via OpenNext.js
pnpm lint                # Next.js ESLint

# Assistant Worker (workers/assistant) - Mastra + Cloudflare Workers
cd workers/assistant
pnpm dev                 # Mastra dev server with local Wrangler persistence
pnpm build              # Custom build script (see build.sh) - handles env isolation
pnpm build:unsafe       # Direct Mastra build (may leak env vars)
pnpm deploy             # Deploy to Cloudflare Workers via Mastra deployer
pnpm typecheck          # TypeScript type checking

# Landing Page (apps/landing-page) - Static Cloudflare Pages
cd apps/landing-page
pnpm dev                # Next.js dev with Turbopack
pnpm build              # Next.js static build
pnpm deploy             # Deploy to Cloudflare Pages
pnpm lint               # Next.js ESLint
```

## Architecture Deep Dive

### Web Application (`apps/web/`)

#### Framework & Structure

- **Next.js 15 App Router** with TypeScript 5.9.2, TailwindCSS 4.0, strict disabled for rapid development
- **Cloudflare Workers Compatibility**: OpenNext.js integration with specific webpack configuration for edge runtime
- **Authentication**: Clerk integration with custom theming and JWT-based Supabase authentication
- **State Management**: TanStack Query v5 for server state, React Context for app state
- **Styling**: TailwindCSS 4.0 with Radix UI components, custom design system, unoptimized images for Cloudflare

#### Feature-Driven Architecture

```
apps/web/
├── app/                    # Next.js App Router with protected route groups
│   ├── (main)/            # Protected route group requiring authentication
│   │   ├── chat/          # AI chat interface and conversation management
│   │   ├── courses/       # Course selection and management interface
│   │   ├── content/       # Course content browsing and document viewing
│   │   └── flashcards/    # Interactive flashcard study interface
│   ├── api/               # Server-side API routes with comprehensive endpoints
│   │   ├── chats/         # Chat CRUD operations and conversation management
│   │   ├── courses/       # Course operations, verification, join/leave
│   │   ├── documents/     # Document ingestion streaming and file processing
│   │   ├── uploadthing/   # File upload handler with security validation
│   │   └── user/          # User management, onboarding, preferences
│   └── onboarding/        # Multi-step user onboarding flow
├── features/              # Domain-driven feature modules with clear separation
│   ├── chat/              # Chat functionality with modular architecture
│   │   ├── chat-operations.ts          # Pure database functions
│   │   ├── services/                   # Specialized services layer
│   │   │   ├── chat-streaming.service.ts      # Real-time SSE processing
│   │   │   ├── persistent-stream-client.service.ts  # New persistent stream client
│   │   │   ├── chat-title-generator.ts        # AI-powered title generation
│   │   │   ├── resource-augmentor.ts          # Document and resource fetching
│   │   │   ├── streaming-manager.service.ts   # Legacy stream management (being refactored)
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
│   │   │   └── quiz.service.ts         # Pure utility functions for quiz operations
│   │   └── components/                 # React components for quiz UI
│   ├── assistant/         # AI assistant functionality
│   │   └── operations.ts               # Suggested queries and AI interaction functions
│   ├── courses/           # Course management with Canvas integration
│   │   ├── operations.ts               # Course-related database functions
│   │   ├── course.model.ts             # TypeScript data models
│   │   ├── course-extraction.ts        # AI-powered course information extraction
│   │   └── components/                 # React components for course UI
│   ├── auth/              # Authentication utilities and operations
│   │   ├── operations.ts               # Auth helper functions with Clerk integration
│   │   └── types.ts                    # Authentication type definitions
│   └── document/          # Document processing and upload pipeline
├── components/            # Shared UI components with consistent design system
│   ├── ui/                # Radix-based design system components
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
    │   │   ├── upload-security.service.ts    # Upload security enforcement
    │   │   └── verifyFileContent.ts          # Content verification utilities
    │   └── auth/          # Authentication services
    │       └── clerk-edge.service.ts    # Clerk integration for edge runtime
    └── types/             # Shared TypeScript type definitions
        ├── AITypes.ts                   # AI service and response types
        ├── CourseTypes.ts               # Course and education-related types
        └── Document.ts                  # Document processing types
```

#### Key Architectural Patterns

- **Function-Based Operations**: Pure functions for business logic in `*-operations.ts` and `*.service.ts` files
- **Selective Service Layer**: Singleton services only for stateful operations (streaming, global state, external API clients)
- **Feature Modules**: Domain-specific folders with clear separation of concerns
  - `operations.ts` - Database operations and pure business logic
  - `services/` - Specialized services for complex stateful operations
  - `utils/` - Simple utility functions
  - `types.ts` - TypeScript interface definitions
  - `components/` - React components
- **Context Providers**: Global state management for chat navigation and pending chats
- **Custom Hooks**: API integration layer using TanStack Query with comprehensive error handling
- **Security-First**: Multi-layer file validation, content sanitization, Row-Level Security (RLS) access controls

### Assistant Worker (`workers/assistant/`)

#### Mastra Framework Architecture on Cloudflare Workers

- **Mastra Framework**: Agent orchestration with Cloudflare deployer for edge distribution
- **Multi-Provider AI**: Anthropic Claude 3.5 Sonnet (primary), OpenAI (embeddings), Google Gemini (optional)
- **Vector Database**: Supabase pgvector with OpenAI text-embedding-3-small (1536 dimensions)
- **Persistent Streaming**: Revolutionary streaming architecture allowing streams to continue even when clients disconnect
- **Global Edge Distribution**: Cloudflare Workers providing sub-50ms response times worldwide

#### Core Components Architecture

```
workers/assistant/
├── src/mastra/
│   ├── agents/                         # AI agent implementations
│   │   ├── studyspot-agent.ts         # Main conversational agent with scratchpad reasoning
│   │   ├── query-reformulation-agent.ts   # Query processing and reformulation
│   │   └── relevance-checker-agent.ts     # Content relevance validation
│   ├── tools/                          # AI tools for RAG and content generation
│   │   ├── semantic-search.tool.ts        # Vector similarity search
│   │   ├── get-full-document.tool.ts      # Complete document retrieval
│   │   ├── list-all-documents.tool.ts     # Course document listing
│   │   ├── set-sources.tool.ts            # Source attribution and linking
│   │   ├── generate-flashcard-set.tool.ts # Interactive flashcard generation
│   │   ├── generate-quiz.tool.ts          # Interactive quiz generation
│   │   ├── verify-course.tool.ts          # Course code verification
│   │   └── vector-search.tool.ts          # Advanced vector search operations
│   ├── workflows/                      # Complete AI workflow orchestrations
│   │   ├── rag-workflow.ts                # Complete RAG pipeline with streaming
│   │   └── document-ingestion-workflow.ts # Document processing pipeline
│   └── index.ts                        # Mastra configuration and API route definitions
├── src/services/                       # Core business services
│   ├── config-loader.service.ts        # Centralized prompt configuration management
│   ├── supabase.service.ts             # Database integration with multi-environment support
│   ├── embedding.service.ts            # OpenAI embedding generation service
│   └── suggested-queries.service.ts    # AI-powered query suggestion generation
├── src/streaming/                      # Persistent streaming architecture
│   └── persistent-stream-manager.ts    # Revolutionary persistent stream management
├── build.sh                           # Custom build script preventing env variable leaks
├── wrangler.toml                      # Cloudflare Workers configuration with KV bindings
└── package.json                       # Mastra + Cloudflare Workers dependencies
```

#### Persistent Streaming Architecture (Current Implementation)

The assistant worker features a groundbreaking persistent streaming architecture that solves the fundamental problem of client disconnections during long AI responses:

**Key Features:**

- **Stream Persistence**: Streams continue processing even when no clients are connected
- **Multi-Client Support**: Multiple subscribers can connect to the same stream
- **Catch-up Mechanism**: New clients receive all previous events instantly
- **End-of-Stream Database Updates**: Single database write when stream completes (not incremental)
- **Tool Activity Preservation**: All existing tool events (`toolActivity`, `chunk`, `done`) work identically
- **Navigation Support**: Seamless stream resumption when navigating between chats

**API Endpoints:**

- `POST /chat/stream` - Create new stream or subscribe to existing
- `POST /chat/stream/subscribe` - Subscribe to specific stream with catch-up
- `GET /chat/stream/status` - Stream monitoring and debugging

#### RAG Workflow Architecture

1. **Query Analysis**: Intelligent determination of RAG retrieval necessity using dedicated agent
2. **Vector Search**: Semantic similarity search across course documents using pgvector
3. **Document Retrieval**: Complete document reconstruction from chunks with relevance scoring
4. **Response Generation**: Claude 3.5 Sonnet with course context and conversation history
5. **Source Attribution**: AI-controlled document linking for citations and verification
6. **Streaming Response**: Server-Sent Events with tool activity indicators and thinking tags

#### Mastra Configuration & Deployment

- **CloudflareDeployer**: Automated deployment configuration with KV namespace bindings
- **Custom Build Process**: `build.sh` script prevents environment variable leaks during build
- **Environment Isolation**: Separate handling of development vs production environment variables
- **KV Storage Integration**: Cloudflare KV for suggested queries caching and configuration storage
- **Service Bindings**: Direct worker-to-worker communication between web app and assistant

### Configuration Management & Secrets

#### Environment Variables Architecture

**Required Environment Variables:**

```bash
# Database (Supabase) - Required for both applications
SUPABASE_URL=                           # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=              # Service role key for admin operations
NEXT_PUBLIC_SUPABASE_URL=               # Public URL for client-side access
NEXT_PUBLIC_SUPABASE_ANON_KEY=          # Public anonymous key

# Authentication (Clerk) - Web app only
CLERK_SECRET_KEY=                       # Clerk backend secret key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=      # Clerk frontend publishable key

# AI Providers - Assistant worker
OPENAI_API_KEY=                         # OpenAI API key (for embeddings)
ANTHROPIC_API_KEY=                      # Anthropic API key (for Claude 3.5)
GEMINI_API_KEY=                         # Google Gemini API key (optional)

# File Upload (UploadThing) - Web app
UPLOADTHING_SECRET=                     # UploadThing secret key
UPLOADTHING_APP_ID=                     # UploadThing application ID

# Cloudflare Deployment - Both applications
NEXT_PUBLIC_ASSISTANT_WORKER_URL=       # Assistant worker endpoint URL
CLOUDFLARE_API_TOKEN=                   # Cloudflare API token for deployments
CLOUDFLARE_ACCOUNT_ID=                  # Cloudflare account ID
```

#### Secrets Management Best Practices

- **Cloudflare Workers Secrets**: Use `wrangler secret put` for all sensitive data
- **Development Environment**: Use `.dev.vars` files for local Wrangler development
- **Production Separation**: Never commit environment variables to wrangler.json
- **Build Isolation**: Custom build.sh script prevents env variable leakage during builds

### Database Architecture & Integration

#### PostgreSQL Schema with Vector Extensions

**Core Tables:**

- **`chunks`**: Document text segments with vector embeddings (1536 dimensions)
  - `id`, `content`, `embedding`, `doc_id`, `course_id`, `chunk_count`
- **`docs`**: File metadata and course associations
  - `id`, `file_name`, `file_url`, `file_type`, `course_id`, `file_hash`, `course_provided`
- **`courses`**: Course hierarchy with school relationships and Canvas integration
  - `id`, `code`, `title`, `school_id`, `icon`, `canvas_course_id`
- **`schools`**: Educational institution information
  - `id`, `name`, `city`, `state`, `domain`, `logo_url`
- **`chats`**: Conversation history with JSONB message storage
  - `id`, `user_id`, `course_id`, `title`, `chats` (JSONB), `created_at`, `updated_at`

**Vector Search Functions:**

- **`match_chunks`**: Semantic similarity search using pgvector
- **`match_documents_by_course`**: Course-scoped document search

#### Database Service Architecture

**Web App Service** (`apps/web/lib/services/database/supabase.service.ts`):

- Comprehensive singleton service with authenticated and anonymous clients
- Retry logic with exponential backoff for network resilience
- Query execution with timeout handling and error categorization
- Client caching and connection pool management
- Cloudflare context integration for service role operations

**Assistant Worker Service** (`workers/assistant/src/services/supabase.service.ts`):

- Multi-environment client management (dev/staging/prod)
- Direct service role access for RAG operations
- Optimized for edge runtime performance
- Comprehensive database operations for AI workflows

#### Security Architecture

- **Row-Level Security (RLS)**: PostgreSQL policies ensuring user data isolation
- **JWT-based Authentication**: Clerk integration with Supabase custom claims
- **File Validation Pipeline**: Multi-layer security for document uploads
  - Content type verification, file size limits, content scanning
  - DOMPurify for user-generated content sanitization
- **API Rate Limiting**: Service-layer protection against abuse

## Development Environment Integration

StudySpot is designed to work with Claude Code and supports MCP (Model Context Protocol) servers for enhanced development workflows. Individual developers may configure their own MCP servers and development environments based on their preferences.

For specific MCP configurations and personal development setups, refer to your local CLAUDE.local.md file (not tracked in git).

## Code Conventions & Patterns

### Service Architecture Patterns

- **Function-First Approach**: Pure functions for stateless business logic and database operations
- **Selective Singletons**: Singleton pattern only for legitimate use cases (streaming services, external API clients, global state)
- **Operations Pattern**: Database operations and business logic in `*-operations.ts` files using pure functions
- **Service Layer**: Complex stateful operations in `services/` directories when singleton pattern is justified
- **Error Handling**: Comprehensive error service with specific error codes and contextual information
- **Type Safety**: Comprehensive TypeScript interfaces for all API requests/responses
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
- **AI Service Layer**: Always use consolidated AI services (`lib/services/ai/`) instead of direct client imports

### AI Provider Integration Standards

- **Multi-Provider Support**: Anthropic Claude 3.5, OpenAI (embeddings), Google Gemini
- **Unified Interface**: Consistent service layer abstractions across different AI providers
- **Model Configuration**: Environment-based model selection and API key management
- **Streaming Architecture**: Real-time response streaming with tool-calling capabilities
- **Context Management**: Conversation history with course-specific context and memory
- **Prompt Configuration**: Centralized prompt management in `config/prompt-configs/`

## Testing & Quality Assurance

### Development Testing Approach

- **Manual Testing**: Primary approach using Mastra Playground and direct interaction
- **Mastra Playground**: Built-in testing via assistant worker's Mastra playground at development URL
- **RAG Workflow Testing**: Test vector search, document retrieval, and response generation
- **Persistent Streaming Testing**: Verify stream continuity across client disconnections
- **Cross-Browser Testing**: Use MCP Playwright server for automated browser testing

### Quality Evaluation Process

1. **Mastra Playground**: Execute workflows and test configurations in real-time
2. **Local Development Testing**: Direct interaction with assistant worker endpoints
3. **Document Usage Monitoring**: Track which documents are being referenced in responses
4. **Performance Monitoring**: Response time metrics via Cloudflare Workers analytics
5. **MCP Playwright Testing**: Automated UI testing and screenshot verification

### Performance Optimization

- **Cloudflare Edge Distribution**: Sub-50ms response times globally
- **Vector Search Optimization**: Efficient pgvector queries with similarity thresholds
- **Persistent Streaming**: Eliminates reconnection overhead and lost responses
- **Service Worker Caching**: Intelligent caching of frequently accessed content
- **Lazy Loading**: Dynamic imports and component-level code splitting

## Deployment Architecture

### Cloudflare Workers Platform

- **Global Edge Network**: 180+ locations worldwide for optimal performance
- **Automatic Scaling**: Handle traffic spikes without infrastructure management
- **Worker-to-Worker Communication**: Direct service bindings between applications
- **KV Storage Integration**: Fast key-value storage for caching and configuration
- **Built-in Analytics**: Performance monitoring and error tracking

### Deployment Commands & Processes

#### Web Application Deployment

```bash
cd apps/web
pnpm build:cloudflare      # OpenNext.js build for Cloudflare Pages
pnpm deploy               # Deploy to Cloudflare Pages
```

#### Assistant Worker Deployment

```bash
cd workers/assistant
pnpm build                # Custom build script with env isolation
pnpm deploy               # Deploy to Cloudflare Workers via Mastra
```

#### Environment-Specific Deployments

- **Development**: Local Wrangler development with `.dev.vars`
- **Staging**: Preview deployments with environment-specific secrets
- **Production**: Full Cloudflare deployment with optimized configuration

### Infrastructure Monitoring

- **Cloudflare Analytics**: Built-in performance and error monitoring
- **Supabase Monitoring**: Database performance and query optimization
- **Custom Logging**: Structured logging with Pino for debugging and analysis
- **MCP Integration**: Use memory server to track deployment history and issues

## Architecture Design Principles

### Function-First Architecture Benefits

- **Testability**: Pure functions enable comprehensive unit testing
- **Maintainability**: Clear separation of concerns and minimal side effects
- **Scalability**: Stateless functions scale horizontally on edge infrastructure
- **Debugging**: Easier to trace issues and understand data flow

### Anti-Patterns Eliminated

- ❌ **Singleton Abuse**: No more singleton classes for stateless operations
- ❌ **Unnecessary Abstraction**: Removed wrapper classes around simple operations
- ❌ **Mixed Responsibilities**: Clear separation between database, business logic, and presentation layers
- ❌ **Direct Client Imports**: All AI integrations go through service layer abstraction

### Current Best Practices

- ✅ **Feature-Driven Organization**: Domain-specific code in `features/` directories
- ✅ **Clear Separation of Concerns**: Operations, services, utils, and components have distinct roles
- ✅ **Testable Architecture**: Pure functions and modular design enable comprehensive testing
- ✅ **Type Safety**: Strong TypeScript throughout with minimal `any` usage
- ✅ **Service Layer Abstraction**: Consolidated AI services with consistent interfaces
- ✅ **Persistent Streaming**: Revolutionary architecture solving client disconnection problems
- ✅ **MCP Integration**: Enhanced development workflow with multiple context protocol servers

## Development Workflow Optimization

### Recommended Development Flow

1. **Environment Setup**: Configure all required environment variables
2. **MCP Server Verification**: Ensure all six MCP servers are connected (`claude mcp list`)
3. **Concurrent Development**: Start both applications with `pnpm dev`
4. **Memory Context**: Use MCP memory server to maintain session context
5. **Iterative Testing**: Use Mastra playground and Playwright for comprehensive testing
6. **Type Safety**: Leverage TypeScript MCP server for enhanced development experience

### Common Development Tasks

- **Adding New Features**: Follow feature-first architecture in appropriate domain directory
- **Database Changes**: Update both type definitions and service layer implementations
- **AI Prompt Tuning**: Modify centralized prompt configurations in `config/prompt-configs/`
- **Streaming Modifications**: Work with persistent stream manager for real-time features
- **UI Components**: Use shadcn MCP server for consistent component installation
- **Performance Optimization**: Monitor Cloudflare analytics and optimize edge performance

### Troubleshooting & Debugging

- **MCP Server Issues**: Use `claude mcp list` to verify server health
- **Database Connection**: Check Supabase service layer for connection issues
- **Streaming Problems**: Monitor persistent stream manager logs and status endpoints
- **Build Issues**: Review custom build scripts and environment variable isolation
- **Deployment Failures**: Check Cloudflare Workers logs and secret configuration

This comprehensive guide ensures future Claude instances can effectively navigate and contribute to the StudySpot codebase while following established architectural patterns and leveraging the full MCP server ecosystem.