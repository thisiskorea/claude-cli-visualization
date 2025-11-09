/**
 * Event collector - watches queue directory and processes events
 */

import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { DatabaseManager } from './database';
import {
  HookEvent,
  generateId,
  getCurrentGitBranch,
  getGitRepoUrl,
  isGitRepo,
} from '@claude-viz/shared';

export class EventCollector {
  private db: DatabaseManager;
  private queueDir: string;
  private sessionFile: string;
  private watcher?: chokidar.FSWatcher;
  private currentSessionId?: string;

  constructor(dataDir: string, db: DatabaseManager) {
    this.db = db;
    this.queueDir = path.join(dataDir, 'queue');
    this.sessionFile = path.join(dataDir, 'current-session.txt');

    // Ensure queue directory exists
    if (!fs.existsSync(this.queueDir)) {
      fs.mkdirSync(this.queueDir, { recursive: true });
    }

    // Load current session
    this.loadCurrentSession();
  }

  /**
   * Load current session ID
   */
  private loadCurrentSession(): void {
    try {
      if (fs.existsSync(this.sessionFile)) {
        this.currentSessionId = fs.readFileSync(this.sessionFile, 'utf8').trim();
      }
    } catch (error) {
      console.error('Failed to load current session:', error);
    }
  }

  /**
   * Start watching queue directory
   */
  start(): void {
    console.log(`[Collector] Watching queue directory: ${this.queueDir}`);

    this.watcher = chokidar.watch(this.queueDir, {
      ignored: /^\./,
      persistent: true,
      ignoreInitial: false,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50,
      },
    });

    this.watcher.on('add', (filepath) => {
      if (filepath.endsWith('.json')) {
        this.processEvent(filepath);
      }
    });

    this.watcher.on('error', (error) => {
      console.error('[Collector] Watcher error:', error);
    });

    // Process existing files
    const files = fs.readdirSync(this.queueDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        this.processEvent(path.join(this.queueDir, file));
      }
    }
  }

  /**
   * Stop watching
   */
  async stop(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
    }
  }

  /**
   * Process a single event file
   */
  private async processEvent(filepath: string): Promise<void> {
    try {
      // Read event file
      const content = fs.readFileSync(filepath, 'utf8');
      const event: HookEvent = JSON.parse(content);

      // Ensure session exists
      await this.ensureSession(event.sessionId);

      // Process based on event type
      switch (event.type) {
        case 'tool-use':
          await this.processToolUse(event);
          break;
        case 'prompt-submit':
          await this.processPromptSubmit(event);
          break;
        case 'message':
          await this.processMessage(event);
          break;
      }

      // Delete processed file
      fs.unlinkSync(filepath);
    } catch (error) {
      console.error(`[Collector] Failed to process event ${filepath}:`, error);
      // Move to failed directory
      const failedDir = path.join(path.dirname(this.queueDir), 'failed');
      if (!fs.existsSync(failedDir)) {
        fs.mkdirSync(failedDir, { recursive: true });
      }
      fs.renameSync(filepath, path.join(failedDir, path.basename(filepath)));
    }
  }

  /**
   * Ensure session exists in database
   */
  private async ensureSession(sessionId: string): Promise<void> {
    const existing = this.db.getSession(sessionId);
    if (existing) return;

    // Create new session
    const workingDir = process.cwd();
    let gitRepo: string | undefined;
    let gitBranch: string | undefined;

    if (await isGitRepo(workingDir)) {
      gitRepo = await getGitRepoUrl(workingDir);
      gitBranch = await getCurrentGitBranch(workingDir);
    }

    this.db.insertSession({
      id: sessionId,
      startTime: Date.now(),
      workingDir,
      gitRepo,
      gitBranch,
      status: 'active',
    });

    console.log(`[Collector] Created new session: ${sessionId}`);
  }

  /**
   * Process tool use event
   */
  private async processToolUse(event: HookEvent): Promise<void> {
    const { toolName, parameters, result, error } = event.data;

    const toolUseId = generateId();
    const messageId = generateId(); // In real scenario, this would be passed from hook

    this.db.insertToolUse({
      id: toolUseId,
      messageId,
      sessionId: event.sessionId,
      timestamp: event.timestamp,
      toolName,
      parameters,
      result,
      error,
      status: error ? 'error' : 'success',
    });

    // Detect file changes from tool use
    if (['Write', 'Edit', 'NotebookEdit'].includes(toolName) && parameters.file_path) {
      this.db.insertFileChange({
        sessionId: event.sessionId,
        toolUseId,
        timestamp: event.timestamp,
        filePath: parameters.file_path,
        changeType: toolName === 'Write' ? 'created' : 'modified',
      });
    }
  }

  /**
   * Process prompt submit event
   */
  private async processPromptSubmit(event: HookEvent): Promise<void> {
    const { prompt } = event.data;

    this.db.insertMessage({
      id: generateId(),
      sessionId: event.sessionId,
      timestamp: event.timestamp,
      role: 'user',
      content: prompt,
    });
  }

  /**
   * Process message event
   */
  private async processMessage(event: HookEvent): Promise<void> {
    const { role, content, tokensInput, tokensOutput } = event.data;

    this.db.insertMessage({
      id: generateId(),
      sessionId: event.sessionId,
      timestamp: event.timestamp,
      role,
      content,
      tokensInput,
      tokensOutput,
    });
  }
}
