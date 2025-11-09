/**
 * Database management using SQLite
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import {
  SCHEMA_SQL,
  QUERIES,
  Session,
  Message,
  ToolUse,
  FileChange,
  SessionStats,
  safeJsonStringify,
  safeJsonParse,
} from '@claude-viz/shared';

export class DatabaseManager {
  private db: Database.Database;

  constructor(dataDir: string) {
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'claude-viz.db');
    this.db = new Database(dbPath);

    // Enable WAL mode for better concurrent access
    this.db.pragma('journal_mode = WAL');

    // Initialize schema
    this.initSchema();
  }

  /**
   * Initialize database schema
   */
  private initSchema(): void {
    this.db.exec(SCHEMA_SQL);
  }

  /**
   * Insert a new session
   */
  insertSession(session: Session): void {
    const stmt = this.db.prepare(QUERIES.insertSession);
    stmt.run(
      session.id,
      session.startTime,
      session.workingDir,
      session.gitRepo || null,
      session.gitBranch || null,
      session.status,
      safeJsonStringify(session.metadata || {})
    );
  }

  /**
   * Update session status and end time
   */
  updateSession(sessionId: string, endTime: number, status: string): void {
    const stmt = this.db.prepare(QUERIES.updateSession);
    stmt.run(endTime, status, sessionId);
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): Session | undefined {
    const stmt = this.db.prepare(QUERIES.getSession);
    const row = stmt.get(sessionId) as any;

    if (!row) return undefined;

    return {
      id: row.id,
      startTime: row.start_time,
      endTime: row.end_time,
      workingDir: row.working_dir,
      gitRepo: row.git_repo,
      gitBranch: row.git_branch,
      status: row.status,
      metadata: safeJsonParse(row.metadata, {}),
    };
  }

  /**
   * Get all sessions
   */
  getAllSessions(): Session[] {
    const stmt = this.db.prepare(QUERIES.getAllSessions);
    const rows = stmt.all() as any[];

    return rows.map(row => ({
      id: row.id,
      startTime: row.start_time,
      endTime: row.end_time,
      workingDir: row.working_dir,
      gitRepo: row.git_repo,
      gitBranch: row.git_branch,
      status: row.status,
      metadata: safeJsonParse(row.metadata, {}),
    }));
  }

  /**
   * Get active sessions
   */
  getActiveSessions(): Session[] {
    const stmt = this.db.prepare(QUERIES.getActiveSessions);
    const rows = stmt.all() as any[];

    return rows.map(row => ({
      id: row.id,
      startTime: row.start_time,
      endTime: row.end_time,
      workingDir: row.working_dir,
      gitRepo: row.git_repo,
      gitBranch: row.git_branch,
      status: row.status,
      metadata: safeJsonParse(row.metadata, {}),
    }));
  }

  /**
   * Insert a message
   */
  insertMessage(message: Message): void {
    const stmt = this.db.prepare(QUERIES.insertMessage);
    stmt.run(
      message.id,
      message.sessionId,
      message.timestamp,
      message.role,
      message.content,
      message.tokensInput || null,
      message.tokensOutput || null,
      safeJsonStringify(message.metadata || {})
    );
  }

  /**
   * Get messages by session
   */
  getMessagesBySession(sessionId: string): Message[] {
    const stmt = this.db.prepare(QUERIES.getMessagesBySession);
    const rows = stmt.all(sessionId) as any[];

    return rows.map(row => ({
      id: row.id,
      sessionId: row.session_id,
      timestamp: row.timestamp,
      role: row.role,
      content: row.content,
      tokensInput: row.tokens_input,
      tokensOutput: row.tokens_output,
      metadata: safeJsonParse(row.metadata, {}),
    }));
  }

  /**
   * Insert a tool use
   */
  insertToolUse(toolUse: ToolUse): void {
    const stmt = this.db.prepare(QUERIES.insertToolUse);
    stmt.run(
      toolUse.id,
      toolUse.messageId,
      toolUse.sessionId,
      toolUse.timestamp,
      toolUse.toolName,
      safeJsonStringify(toolUse.parameters),
      toolUse.result ? safeJsonStringify(toolUse.result) : null,
      toolUse.error || null,
      toolUse.durationMs || null,
      toolUse.status
    );
  }

  /**
   * Update tool use result
   */
  updateToolUseResult(
    toolUseId: string,
    result: any,
    error: string | undefined,
    durationMs: number,
    status: string
  ): void {
    const stmt = this.db.prepare(QUERIES.updateToolUseResult);
    stmt.run(
      result ? safeJsonStringify(result) : null,
      error || null,
      durationMs,
      status,
      toolUseId
    );
  }

  /**
   * Get tool uses by session
   */
  getToolUsesBySession(sessionId: string): ToolUse[] {
    const stmt = this.db.prepare(QUERIES.getToolUsesBySession);
    const rows = stmt.all(sessionId) as any[];

    return rows.map(row => ({
      id: row.id,
      messageId: row.message_id,
      sessionId: row.session_id,
      timestamp: row.timestamp,
      toolName: row.tool_name,
      parameters: safeJsonParse(row.parameters, {}),
      result: safeJsonParse(row.result, undefined),
      error: row.error,
      durationMs: row.duration_ms,
      status: row.status,
    }));
  }

  /**
   * Insert a file change
   */
  insertFileChange(fileChange: Omit<FileChange, 'id'>): void {
    const stmt = this.db.prepare(QUERIES.insertFileChange);
    stmt.run(
      fileChange.sessionId,
      fileChange.toolUseId || null,
      fileChange.timestamp,
      fileChange.filePath,
      fileChange.changeType,
      fileChange.linesAdded || 0,
      fileChange.linesRemoved || 0,
      fileChange.content || null
    );
  }

  /**
   * Get file changes by session
   */
  getFileChangesBySession(sessionId: string): FileChange[] {
    const stmt = this.db.prepare(QUERIES.getFileChangesBySession);
    const rows = stmt.all(sessionId) as any[];

    return rows.map(row => ({
      id: row.id,
      sessionId: row.session_id,
      toolUseId: row.tool_use_id,
      timestamp: row.timestamp,
      filePath: row.file_path,
      changeType: row.change_type,
      linesAdded: row.lines_added,
      linesRemoved: row.lines_removed,
      content: row.content,
    }));
  }

  /**
   * Get session statistics
   */
  getSessionStats(sessionId: string): SessionStats | undefined {
    const stmt = this.db.prepare(QUERIES.getSessionStats);
    const row = stmt.get(sessionId) as any;

    if (!row) return undefined;

    // Get tool usage counts
    const toolStmt = this.db.prepare(QUERIES.getToolUsageCounts);
    const toolRows = toolStmt.all(sessionId) as any[];
    const toolUsageCount: Record<string, number> = {};
    toolRows.forEach(r => {
      toolUsageCount[r.tool_name] = r.count;
    });

    // Get file change type counts
    const fileStmt = this.db.prepare(QUERIES.getFileChangeTypeCounts);
    const fileRows = fileStmt.all(sessionId) as any[];
    const fileChangeCount: Record<string, number> = {};
    fileRows.forEach(r => {
      fileChangeCount[r.change_type] = r.count;
    });

    return {
      sessionId: row.id,
      totalMessages: row.total_messages,
      totalToolUses: row.total_tool_uses,
      totalTokensInput: row.total_tokens_input,
      totalTokensOutput: row.total_tokens_output,
      totalDurationMs: row.total_duration_ms,
      toolUsageCount,
      fileChangeCount,
    };
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
  }
}
