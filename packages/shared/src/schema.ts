/**
 * Database schema definitions
 */

export const SCHEMA_VERSION = 1;

export const SCHEMA_SQL = `
-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  working_dir TEXT NOT NULL,
  git_repo TEXT,
  git_branch TEXT,
  status TEXT DEFAULT 'active',
  metadata TEXT
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
  content TEXT,
  tokens_input INTEGER,
  tokens_output INTEGER,
  metadata TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Tool uses table
CREATE TABLE IF NOT EXISTS tool_uses (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  tool_name TEXT NOT NULL,
  parameters TEXT,
  result TEXT,
  error TEXT,
  duration_ms INTEGER,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'success', 'error')),
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- File changes table
CREATE TABLE IF NOT EXISTS file_changes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  tool_use_id TEXT,
  timestamp INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  change_type TEXT NOT NULL CHECK(change_type IN ('created', 'modified', 'deleted', 'renamed')),
  lines_added INTEGER DEFAULT 0,
  lines_removed INTEGER DEFAULT 0,
  content TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (tool_use_id) REFERENCES tool_uses(id) ON DELETE SET NULL
);

-- Schema version table
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at INTEGER NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_tool_uses_session ON tool_uses(session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_tool_uses_message ON tool_uses(message_id);
CREATE INDEX IF NOT EXISTS idx_tool_uses_timestamp ON tool_uses(timestamp);
CREATE INDEX IF NOT EXISTS idx_file_changes_session ON file_changes(session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_file_changes_tool ON file_changes(tool_use_id);

-- Insert schema version
INSERT OR IGNORE INTO schema_version (version, applied_at) VALUES (${SCHEMA_VERSION}, ${Date.now()});
`;

/**
 * Query helpers
 */
export const QUERIES = {
  // Sessions
  insertSession: `
    INSERT INTO sessions (id, start_time, working_dir, git_repo, git_branch, status, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  updateSession: `
    UPDATE sessions
    SET end_time = ?, status = ?
    WHERE id = ?
  `,
  getSession: `
    SELECT * FROM sessions WHERE id = ?
  `,
  getAllSessions: `
    SELECT * FROM sessions ORDER BY start_time DESC
  `,
  getActiveSessions: `
    SELECT * FROM sessions WHERE status = 'active' ORDER BY start_time DESC
  `,

  // Messages
  insertMessage: `
    INSERT INTO messages (id, session_id, timestamp, role, content, tokens_input, tokens_output, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  getMessagesBySession: `
    SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp ASC
  `,

  // Tool uses
  insertToolUse: `
    INSERT INTO tool_uses (id, message_id, session_id, timestamp, tool_name, parameters, result, error, duration_ms, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  updateToolUseResult: `
    UPDATE tool_uses
    SET result = ?, error = ?, duration_ms = ?, status = ?
    WHERE id = ?
  `,
  getToolUsesBySession: `
    SELECT * FROM tool_uses WHERE session_id = ? ORDER BY timestamp ASC
  `,

  // File changes
  insertFileChange: `
    INSERT INTO file_changes (session_id, tool_use_id, timestamp, file_path, change_type, lines_added, lines_removed, content)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  getFileChangesBySession: `
    SELECT * FROM file_changes WHERE session_id = ? ORDER BY timestamp ASC
  `,

  // Statistics
  getSessionStats: `
    SELECT
      s.id,
      s.start_time,
      s.end_time,
      COUNT(DISTINCT m.id) as total_messages,
      COUNT(DISTINCT t.id) as total_tool_uses,
      COALESCE(SUM(m.tokens_input), 0) as total_tokens_input,
      COALESCE(SUM(m.tokens_output), 0) as total_tokens_output,
      COALESCE(MAX(t.timestamp) - MIN(t.timestamp), 0) as total_duration_ms
    FROM sessions s
    LEFT JOIN messages m ON m.session_id = s.id
    LEFT JOIN tool_uses t ON t.session_id = s.id
    WHERE s.id = ?
    GROUP BY s.id
  `,
  getToolUsageCounts: `
    SELECT tool_name, COUNT(*) as count
    FROM tool_uses
    WHERE session_id = ?
    GROUP BY tool_name
    ORDER BY count DESC
  `,
  getFileChangeTypeCounts: `
    SELECT change_type, COUNT(*) as count
    FROM file_changes
    WHERE session_id = ?
    GROUP BY change_type
  `,
};
