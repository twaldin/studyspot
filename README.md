# StudySpot

**The AI Study Assistant That Transforms College Learning**

StudySpot is an intelligent study platform that revolutionizes how college students learn by creating collaborative course knowledge bases powered by advanced AI. Built on Cloudflare's global edge network, students upload course materials to shared databases, enabling our AI to deliver precise, contextual answers about exams, assignments, and course content—far more accurate than generic AI tools.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-2.52.0-green?logo=supabase)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Mastra](https://img.shields.io/badge/Mastra-0.10.18-purple?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)](https://mastra.ai)
[![Cloudflare](https://img.shields.io/badge/Cloudflare_Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)

## 🌟 Features

### 🎓 **Intelligent Course Management**
- **School Integration**: Connect with universities and join course communities
- **Course Verification**: AI-powered validation of course codes and information
- **Collaborative Knowledge Bases**: Students contribute to shared course material repositories

### 🤖 **Advanced AI Assistant**
- **Multi-Provider AI**: Anthropic Claude 3.5 Sonnet, OpenAI embeddings, and Google Gemini for optimal responses
- **Retrieval-Augmented Generation (RAG)**: Contextual answers using actual course materials with pgvector semantic search
- **Persistent Streaming**: Revolutionary streaming architecture that continues even when clients disconnect
- **Interactive Study Tools**: AI-generated flashcards and quizzes based on course materials
- **Mathematical Support**: Comprehensive LaTeX rendering for complex equations

### 📚 **Document Processing Pipeline**
- **Multi-Format Support**: PDF, DOCX, TXT, MD, CSV, HTML, and image files
- **Smart Content Extraction**: Automated text extraction and preprocessing
- **Vector Embeddings**: Semantic search using OpenAI's text-embedding-3-small
- **Relevance Filtering**: AI-powered content validation to ensure course relevance

### 💬 **Interactive Chat System**
- **Persistent Conversations**: Save and resume study sessions with conversation history
- **Course-Specific Context**: Conversations tied to specific courses and materials with intelligent RAG retrieval
- **Real-time Suggestions**: AI-generated query suggestions based on course content
- **Stream Resumption**: Navigate between chats without losing ongoing AI responses

### 🔒 **Security & Authentication**
- **Clerk Integration**: Secure user authentication and authorization
- **Row-Level Security**: Database-level access controls via Supabase RLS
- **File Validation**: Comprehensive security checks for uploaded documents

## 🛠 Technology Stack

### **Frontend**
- **Framework**: Next.js 15.3.5 with App Router deployed on Cloudflare Workers
- **Language**: TypeScript 5.9.2
- **Styling**: TailwindCSS 4.0 + Radix UI components
- **State Management**: TanStack Query (React Query) v5
- **Authentication**: Clerk v6.25.0 with JWT-based Supabase integration

### **Backend & AI**
- **Infrastructure**: Cloudflare Workers global edge deployment
- **Database**: Supabase (PostgreSQL with pgvector for embeddings)
- **AI Framework**: Mastra v0.10.18 with Cloudflare deployer
- **AI Providers**: 
  - Anthropic Claude 3.5 Sonnet (primary conversational AI)
  - OpenAI text-embedding-3-small (vector embeddings)
  - Google Gemini Pro (optional multi-provider support)
- **Document Processing**: pdf2json, file-type validation, content extraction
- **File Uploads**: UploadThing v7.7.3 with comprehensive security validation
- **Streaming**: Persistent Server-Sent Events with client reconnection

### **Development & Infrastructure**
- **Package Manager**: pnpm workspace monorepo
- **Deployment**: OpenNext.js for Cloudflare Workers integration
- **Linting**: ESLint 9 with Next.js configuration
- **Logging**: Pino with structured development-friendly formatting
- **Build Tools**: Custom build scripts with environment isolation

## 🏗 Architecture Overview

StudySpot is built as a **distributed Cloudflare Workers monorepo** with two main applications:

### **📱 Web Application** (`apps/web/`)
Next.js 15 frontend deployed as Cloudflare Worker with feature-driven architecture:

```
apps/web/
├── app/                    # Next.js App Router with protected routes
├── features/              # Domain-driven feature modules
│   ├── chat/             # Chat with persistent streaming client
│   ├── courses/          # Course management with Canvas integration  
│   ├── flashcards/       # Interactive study tools
│   └── document/         # File processing pipeline
├── components/           # Radix UI design system
├── hooks/api/           # TanStack Query integration
└── lib/services/        # Multi-provider AI and database services
```

### **🤖 Assistant Worker** (`workers/assistant/`)
Mastra-powered AI assistant deployed as Cloudflare Worker with persistent streaming:

```
workers/assistant/
├── src/mastra/
│   ├── agents/          # Claude 3.5 conversational agents
│   ├── tools/           # RAG tools and study material generators
│   ├── workflows/       # Complete AI orchestration pipelines
│   └── index.ts         # API endpoints with streaming architecture
├── src/services/        # Database integration and embedding generation
└── src/streaming/       # Revolutionary persistent stream manager
```

### **🌍 Global Edge Distribution**
- **Cloudflare Workers**: Sub-50ms response times across 180+ locations
- **Service Bindings**: Direct worker-to-worker communication
- **KV Storage**: Caching for suggested queries and configuration
- **Persistent Streaming**: Streams continue even when clients disconnect

## 📡 API Reference

### **Web App Endpoints** (`apps/web/`)

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/courses` | GET/POST | Fetch or create courses |
| `/api/chats` | GET/POST | Manage chat conversations |
| `/api/documents` | GET/POST | Document upload and processing |
| `/api/user/selected-course` | GET/POST/DELETE | Manage user's selected course |
| `/api/schools` | GET | Fetch available schools |

### **Assistant Worker Endpoints** (`workers/assistant/`)

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/chat/stream` | POST | Create or subscribe to persistent AI streams |
| `/chat/stream/subscribe` | POST | Subscribe to existing stream with catch-up |
| `/chat/stream/status` | GET | Monitor stream status and debugging |
| `/courses/verify` | POST | AI-powered course code verification |
| `/documents/ingest-stream` | POST | Streaming document ingestion pipeline |
| `/suggested-queries` | GET | AI-generated query suggestions |

## 🗄 Database Schema

### **Core Tables**

```sql
-- Schools
schools (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  domain TEXT,
  logo_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Courses
courses (
  id UUID PRIMARY KEY,
  code TEXT,
  title TEXT,
  school_id UUID REFERENCES schools(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Documents
docs (
  id UUID PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  course_id UUID REFERENCES courses(id),
  file_hash TEXT,
  course_provided BOOLEAN,
  created_at TIMESTAMP
)

-- Document Chunks (for RAG)
chunks (
  id UUID PRIMARY KEY,
  doc_id UUID REFERENCES docs(id),
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI embedding dimensions
  chunk_count INTEGER,
  created_at TIMESTAMP
)

-- Chat Conversations
chats (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  messages JSONB,
  course_id UUID REFERENCES courses(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 🚀 Development

### **Getting Started**

```bash
# Install dependencies
pnpm install

# Start both applications (recommended)
pnpm dev                    # Web app (port 3000) + Assistant worker (port 8787)

# Or start individually
pnpm dev:web               # Next.js with Turbopack + pino-pretty
pnpm dev:assistant         # Mastra + Wrangler local development
pnpm dev:assistant-remote  # Mastra with remote Cloudflare environment
```

### **Build & Deployment**

```bash
# Build all applications
pnpm build                 # Build web app + assistant worker

# Deploy to Cloudflare
pnpm deploy               # Deploy both applications
pnpm deploy:web           # Deploy web app to Cloudflare Workers
pnpm deploy:assistant     # Deploy assistant worker

# Secrets management
pnpm secrets:set:web      # Set secrets for web app worker  
pnpm secrets:set:assistant # Set secrets for assistant worker
```

### **Development Workflow**

1. **Environment Setup**: Configure required environment variables (see CLAUDE.md)
2. **Concurrent Development**: Both applications run simultaneously during development
3. **Real-time Testing**: Test persistent streaming and RAG workflows locally
4. **Mastra Playground**: Built-in testing interface for AI workflows
5. **Edge Deployment**: Deploy to global Cloudflare Workers network

### **Code Quality & Architecture**

- **Monorepo Structure**: pnpm workspace with feature-driven organization
- **TypeScript**: Comprehensive type safety with 5.9.2
- **Function-First Architecture**: Pure functions for business logic, selective singletons for stateful services
- **Persistent Streaming**: Revolutionary client-server architecture for uninterrupted AI responses
- **Security-First**: Multi-layer file validation, Row-Level Security, JWT authentication

---

**Built with ❤️ for students, by students. Making AI-powered learning accessible to everyone.**
