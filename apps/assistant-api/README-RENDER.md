# StudySpot Assistant API - Render Deployment

This directory contains the StudySpot Assistant API, a Node.js microservice that handles RAG (Retrieval-Augmented Generation) and chat streaming functionality.

## Architecture

- **Purpose**: Handles AI chat responses using document retrieval and LLM streaming
- **Framework**: Plain Node.js HTTP server with TypeScript
- **Port**: Configurable via PORT environment variable (Render provides this)
- **Health Check**: `/api/health`
- **Main Endpoint**: `/api/chat/stream` (Server-Sent Events)

## Deployment on Render

### Auto-Deploy Configuration
This service is configured with `render.yaml` for automatic deployment:
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `node server.js`
- **Health Check**: `/api/health`
- **Free Tier**: Configured for Render's free plan

### Required Environment Variables
Set these in your Render service dashboard:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_google_api_key  # for Gemini Flash (query reformulation)
```

### Manual Deployment Steps
1. Create new Web Service in Render
2. Connect to GitHub repository
3. Set root directory to `apps/assistant-api`
4. Render will auto-detect the `render.yaml` configuration
5. Add environment variables in the dashboard
6. Deploy!

## Local Development

```bash
# Install dependencies
pnpm install

# Build TypeScript
pnpm build

# Start server
pnpm start

# Development with auto-rebuild
pnpm dev:render
```

## API Endpoints

### Health Check
```
GET /api/health
Response: {"status": "healthy", "service": "studyspot-assistant-api", ...}
```

### Chat Stream
```
POST /api/chat/stream
Content-Type: application/json

Body:
{
  "question": "What is the homework assignment?",
  "conversationHistory": [...],
  "courseId": "course-123",
  "timeZone": "America/New_York"
}

Response: text/event-stream (Server-Sent Events)
```

## Integration with Web App

The web app should set this environment variable to connect to the deployed API:

```bash
NEXT_PUBLIC_ASSISTANT_API_URL=https://your-app-name.onrender.com
```

## Free Tier Considerations

- **Sleep after inactivity**: Service sleeps after 15 minutes of no requests
- **Cold start time**: ~30-60 seconds to wake up
- **Monthly usage**: 750 hours/month on free tier
- **Upgrade to paid**: $7/month for always-on service