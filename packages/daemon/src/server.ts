/**
 * Web server for API and WebSocket
 */

import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { DatabaseManager } from './database';
import { estimateCost } from '@claude-viz/shared';

export class WebServer {
  private app: express.Application;
  private db: DatabaseManager;
  private port: number;
  private server?: any;
  private wss?: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(db: DatabaseManager, port: number = 3456) {
    this.db = db;
    this.port = port;
    this.app = express();

    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());

    // Logging middleware
    this.app.use((req, res, next) => {
      console.log(`[API] ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: Date.now() });
    });

    // Get all sessions
    this.app.get('/api/sessions', (req, res) => {
      try {
        const sessions = this.db.getAllSessions();
        res.json(sessions);
      } catch (error) {
        console.error('Failed to get sessions:', error);
        res.status(500).json({ error: 'Failed to get sessions' });
      }
    });

    // Get session by ID
    this.app.get('/api/sessions/:id', (req, res) => {
      try {
        const session = this.db.getSession(req.params.id);
        if (!session) {
          res.status(404).json({ error: 'Session not found' });
          return;
        }
        res.json(session);
      } catch (error) {
        console.error('Failed to get session:', error);
        res.status(500).json({ error: 'Failed to get session' });
      }
    });

    // Get session statistics
    this.app.get('/api/sessions/:id/stats', (req, res) => {
      try {
        const stats = this.db.getSessionStats(req.params.id);
        if (!stats) {
          res.status(404).json({ error: 'Session not found' });
          return;
        }

        // Add estimated cost
        const estimatedCost = estimateCost(stats.totalTokensInput, stats.totalTokensOutput);
        res.json({ ...stats, estimatedCost });
      } catch (error) {
        console.error('Failed to get session stats:', error);
        res.status(500).json({ error: 'Failed to get session stats' });
      }
    });

    // Get messages for a session
    this.app.get('/api/sessions/:id/messages', (req, res) => {
      try {
        const messages = this.db.getMessagesBySession(req.params.id);
        res.json(messages);
      } catch (error) {
        console.error('Failed to get messages:', error);
        res.status(500).json({ error: 'Failed to get messages' });
      }
    });

    // Get tool uses for a session
    this.app.get('/api/sessions/:id/tools', (req, res) => {
      try {
        const toolUses = this.db.getToolUsesBySession(req.params.id);
        res.json(toolUses);
      } catch (error) {
        console.error('Failed to get tool uses:', error);
        res.status(500).json({ error: 'Failed to get tool uses' });
      }
    });

    // Get file changes for a session
    this.app.get('/api/sessions/:id/files', (req, res) => {
      try {
        const fileChanges = this.db.getFileChangesBySession(req.params.id);
        res.json(fileChanges);
      } catch (error) {
        console.error('Failed to get file changes:', error);
        res.status(500).json({ error: 'Failed to get file changes' });
      }
    });

    // Get active sessions
    this.app.get('/api/sessions/active/list', (req, res) => {
      try {
        const sessions = this.db.getActiveSessions();
        res.json(sessions);
      } catch (error) {
        console.error('Failed to get active sessions:', error);
        res.status(500).json({ error: 'Failed to get active sessions' });
      }
    });
  }

  /**
   * Start the server
   */
  start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`[Server] API server listening on http://localhost:${this.port}`);
        this.setupWebSocket();
        resolve();
      });
    });
  }

  /**
   * Setup WebSocket server
   */
  private setupWebSocket(): void {
    this.wss = new WebSocketServer({ server: this.server });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('[WebSocket] Client connected');
      this.clients.add(ws);

      ws.on('close', () => {
        console.log('[WebSocket] Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('[WebSocket] Error:', error);
        this.clients.delete(ws);
      });
    });

    console.log('[Server] WebSocket server ready');
  }

  /**
   * Broadcast update to all connected clients
   */
  broadcast(event: any): void {
    const message = JSON.stringify(event);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  /**
   * Stop the server
   */
  stop(): Promise<void> {
    return new Promise((resolve) => {
      // Close WebSocket connections
      this.clients.forEach((client) => client.close());
      this.clients.clear();

      if (this.wss) {
        this.wss.close();
      }

      if (this.server) {
        this.server.close(() => {
          console.log('[Server] Server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
