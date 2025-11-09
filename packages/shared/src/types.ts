/**
 * Core types for Claude CLI Visualization
 */

// Session status
export type SessionStatus = 'active' | 'completed' | 'error';

// Message role
export type MessageRole = 'user' | 'assistant' | 'system';

// Tool status
export type ToolStatus = 'pending' | 'running' | 'success' | 'error';

// File change types
export type FileChangeType = 'created' | 'modified' | 'deleted' | 'renamed';

/**
 * Session represents a single Claude CLI session
 */
export interface Session {
  id: string;
  startTime: number;
  endTime?: number;
  workingDir: string;
  gitRepo?: string;
  gitBranch?: string;
  status: SessionStatus;
  metadata?: Record<string, any>;
}

/**
 * Message represents a single message in the conversation
 */
export interface Message {
  id: string;
  sessionId: string;
  timestamp: number;
  role: MessageRole;
  content: string;
  tokensInput?: number;
  tokensOutput?: number;
  metadata?: Record<string, any>;
}

/**
 * ToolUse represents a single tool invocation
 */
export interface ToolUse {
  id: string;
  messageId: string;
  sessionId: string;
  timestamp: number;
  toolName: string;
  parameters: Record<string, any>;
  result?: any;
  error?: string;
  durationMs?: number;
  status: ToolStatus;
}

/**
 * FileChange represents a file modification
 */
export interface FileChange {
  id: number;
  sessionId: string;
  toolUseId?: string;
  timestamp: number;
  filePath: string;
  changeType: FileChangeType;
  linesAdded?: number;
  linesRemoved?: number;
  content?: string;
}

/**
 * Hook event from Claude CLI
 */
export interface HookEvent {
  type: 'tool-use' | 'prompt-submit' | 'message';
  sessionId: string;
  timestamp: number;
  data: any;
}

/**
 * Statistics for a session
 */
export interface SessionStats {
  sessionId: string;
  totalMessages: number;
  totalToolUses: number;
  totalTokensInput: number;
  totalTokensOutput: number;
  totalDurationMs: number;
  toolUsageCount: Record<string, number>;
  fileChangeCount: Record<FileChangeType, number>;
  estimatedCost?: number;
}

/**
 * Configuration for the visualizer
 */
export interface VisualizerConfig {
  dataDir: string;
  hookScriptsDir: string;
  webPort: number;
  autoStart: boolean;
  claudeConfigPath?: string;
}

/**
 * Export options
 */
export interface ExportOptions {
  sessionId: string;
  format: 'html' | 'json' | 'markdown';
  includeContent: boolean;
  outputPath: string;
}
