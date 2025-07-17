# StudySpot

**The AI Study Assistant That Transforms College Learning**

StudySpot is an intelligent study platform that revolutionizes how college students learn by creating collaborative course knowledge bases powered by advanced AI. Students upload course materials to shared databases, enabling our AI to deliver precise, contextual answers about exams, assignments, and course content—far more accurate than generic AI tools.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-2.51.0-green?logo=supabase)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

## 🌟 Features

### 🎓 **Intelligent Course Management**
- **School Integration**: Connect with universities and join course communities
- **Course Verification**: AI-powered validation of course codes and information
- **Collaborative Knowledge Bases**: Students contribute to shared course material repositories

### 🤖 **Advanced AI Assistant**
- **Multi-Provider AI**: Leverages OpenAI GPT-4, Anthropic Claude, and Google Gemini for optimal responses
- **Retrieval-Augmented Generation (RAG)**: Contextual answers using actual course materials
- **Streaming Responses**: Real-time AI interactions with tool-calling capabilities
- **Mathematical Support**: Comprehensive LaTeX rendering for complex equations

### 📚 **Document Processing Pipeline**
- **Multi-Format Support**: PDF, DOCX, TXT, MD, CSV, HTML, and image files
- **Smart Content Extraction**: Automated text extraction and preprocessing
- **Vector Embeddings**: Semantic search using OpenAI's text-embedding-3-small
- **Relevance Filtering**: AI-powered content validation to ensure course relevance

### 💬 **Interactive Chat System**
- **Persistent Conversations**: Save and resume study sessions
- **Course-Specific Context**: Conversations tied to specific courses and materials
- **Real-time Suggestions**: AI-generated query suggestions based on course content

### 🔒 **Security & Authentication**
- **Clerk Integration**: Secure user authentication and authorization
- **Row-Level Security**: Database-level access controls via Supabase RLS
- **File Validation**: Comprehensive security checks for uploaded documents

## 🛠 Technology Stack

### **Frontend**
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS 4.0 + Radix UI components
- **State Management**: TanStack Query (React Query) v5
- **Authentication**: Clerk v6.25.0

### **Backend & AI**
- **Database**: Supabase (PostgreSQL with vector extensions)
- **AI Orchestration**: LlamaIndex v0.11.17
- **AI Providers**: 
  - OpenAI GPT-4 & Embeddings
  - Anthropic Claude 3.5 Sonnet
  - Google Gemini Pro
- **Document Processing**: pdf2json, file-type validation
- **File Uploads**: UploadThing v7.7.3

### **Development Tools**
- **Package Manager**: pnpm
- **Linting**: ESLint 9 with Next.js config
- **Logging**: Pino with development-friendly formatting

## 🏗 Architecture Overview

StudySpot follows a **feature-first architecture** with clear separation of concerns:

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # Backend API endpoints
│   ├── (main)/            # Protected application routes
│   └── onboarding/        # User onboarding flow
├── components/            # Reusable UI components
├── features/             # Feature-based modules
│   ├── assistant/        # AI chat and RAG functionality
│   ├── auth/            # Authentication logic
│   ├── chat/            # Chat management
│   ├── courses/         # Course operations
│   └── document/        # Document processing pipeline
├── hooks/               # Custom React hooks and API clients
└── lib/                 # Shared utilities and services
```

### **Key Services**

- **AssistantService**: Orchestrates AI interactions and RAG workflows
- **DocumentService**: Handles file upload, processing, and embeddings
- **CourseService**: Manages course creation, verification, and enrollment
- **ChatService**: Handles conversation persistence and management
- **AuthService**: Manages authentication and authorization logic

## 📡 API Reference

### **Core Endpoints**

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/assistant` | POST | Stream AI responses with RAG |
| `/api/courses` | GET/POST | Fetch or create courses |
| `/api/courses/verify` | POST | Verify course codes |
| `/api/docs` | GET | Retrieve course documents |
| `/api/chats` | GET/POST | Manage chat conversations |
| `/api/suggested-queries` | GET | Get AI-generated query suggestions |
| `/api/user/selected-course` | GET/POST/DELETE | Manage user's selected course |

### **Authentication Endpoints**

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/user/onboarding` | POST | Complete user onboarding |
| `/api/user/onboarding-status` | GET | Check onboarding completion |
| `/api/schools` | GET | Fetch available schools |

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

## 🔧 Development

### **Available Scripts**

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint
```

### **Code Quality**

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Configured with Next.js recommended rules
- **Logging**: Structured logging with Pino for development and production
- **Error Handling**: Centralized error management with custom error types

---

**Built with ❤️ for students, by students. Making AI-powered learning accessible to everyone.**
