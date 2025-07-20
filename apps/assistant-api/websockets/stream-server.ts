import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import logger from '../lib/utils/logger';

interface StreamSession {
  id: string;
  userId?: string;
  courseId?: string;
  connection: WebSocket;
  activeStreams: Map<string, any>;
  createdAt: Date;
  lastActivity: Date;
}

class StreamManager {
  private sessions = new Map<string, StreamSession>();
  private wss: WebSocketServer;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, req: any) => {
      const sessionId = uuidv4();
      const session: StreamSession = {
        id: sessionId,
        connection: ws,
        activeStreams: new Map(),
        createdAt: new Date(),
        lastActivity: new Date()
      };

      this.sessions.set(sessionId, session);
      logger.info({ sessionId }, '[StreamManager] New WebSocket connection established');

      // Send connection confirmation
      ws.send(JSON.stringify({
        type: 'connection',
        sessionId,
        message: 'Connected to StudySpot Assistant API'
      }));

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(sessionId, message);
        } catch (error) {
          logger.error({ error, sessionId }, '[StreamManager] Error handling message');
          ws.send(JSON.stringify({
            type: 'error',
            error: 'Invalid message format'
          }));
        }
      });

      ws.on('close', () => {
        this.sessions.delete(sessionId);
        logger.info({ sessionId }, '[StreamManager] WebSocket connection closed');
      });

      ws.on('error', (error) => {
        logger.error({ error, sessionId }, '[StreamManager] WebSocket error');
        this.sessions.delete(sessionId);
      });
    });
  }

  private async handleMessage(sessionId: string, message: any) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    session.lastActivity = new Date();

    switch (message.type) {
      case 'stream_request':
        await this.handleStreamRequest(session, message);
        break;
      case 'ping':
        session.connection.send(JSON.stringify({ type: 'pong' }));
        break;
      default:
        session.connection.send(JSON.stringify({
          type: 'error',
          error: 'Unknown message type'
        }));
    }
  }

  private async handleStreamRequest(session: StreamSession, message: any) {
    const streamId = message.streamId || uuidv4();
    
    try {
      // Here we would integrate with the RAG service
      // For now, send a placeholder response
      session.connection.send(JSON.stringify({
        type: 'stream_start',
        streamId,
        message: 'Stream processing started'
      }));

      // Simulate streaming response
      const chunks = ['Hello', ' there!', ' This', ' is', ' a', ' streaming', ' response.'];
      
      for (const chunk of chunks) {
        await new Promise(resolve => setTimeout(resolve, 500));
        session.connection.send(JSON.stringify({
          type: 'stream_chunk',
          streamId,
          chunk
        }));
      }

      session.connection.send(JSON.stringify({
        type: 'stream_complete',
        streamId,
        linkedDocumentIds: []
      }));

    } catch (error) {
      logger.error({ error, sessionId: session.id }, '[StreamManager] Error in stream request');
      session.connection.send(JSON.stringify({
        type: 'stream_error',
        streamId,
        error: 'Stream processing failed'
      }));
    }
  }

  public getSessionCount(): number {
    return this.sessions.size;
  }

  public cleanupSessions() {
    const now = new Date();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.sessions) {
      const timeSinceActivity = now.getTime() - session.lastActivity.getTime();
      if (timeSinceActivity > 30 * 60 * 1000) { // 30 minutes
        expiredSessions.push(sessionId);
      }
    }

    for (const sessionId of expiredSessions) {
      const session = this.sessions.get(sessionId);
      if (session) {
        session.connection.close();
        this.sessions.delete(sessionId);
        logger.info({ sessionId }, '[StreamManager] Cleaned up expired session');
      }
    }
  }
}

// For local development
if (require.main === module) {
  const server = createServer();
  const wss = new WebSocketServer({ server });
  
  const streamManager = new StreamManager(wss);
  
  // Cleanup expired sessions every 5 minutes
  setInterval(() => {
    streamManager.cleanupSessions();
  }, 5 * 60 * 1000);

  const PORT = process.env.WS_PORT || 8080;
  server.listen(PORT, () => {
    logger.info({ port: PORT }, '[StreamServer] WebSocket server started');
  });
}

export { StreamManager };