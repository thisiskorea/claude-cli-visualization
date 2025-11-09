# 🔌 Claude CLI Plugin Installation Guide

## Installation Methods

### Method 1: MCP Server (Recommended)

Add to your Claude CLI config (`~/.claude/config.json`):

```json
{
  "mcpServers": {
    "claude-viz": {
      "command": "npx",
      "args": ["-y", "@claude-viz/mcp-server"]
    }
  }
}
```

Or use the Claude CLI command:
```bash
claude mcp add claude-viz npx -y @claude-viz/mcp-server
```

### Method 2: Quick Install Script

```bash
# Linux/macOS
curl -fsSL https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.sh | bash

# Windows
iwr -useb https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.ps1 | iex
```

### Method 3: npm Global Install

```bash
npm install -g claude-cli-viz
```

## Using as MCP Server

Once installed, Claude can use these tools:

### 1. Start Visualization
```
Can you start the visualization daemon?
```

Claude will use the `claude_viz_start` tool.

### 2. View Sessions
```
Show me my recent Claude CLI sessions
```

Claude will use `claude_viz_get_sessions` and display them.

### 3. Get Statistics
```
What's the status of my visualization daemon?
```

Claude will use `claude_viz_status`.

### 4. Export Session
```
Export session abc123 as HTML
```

Claude will use `claude_viz_export_session`.

## Manual Setup (Traditional)

If you prefer the traditional CLI approach:

```bash
# Install
npm install -g claude-cli-viz

# Initialize hooks
claude-viz init

# Add hooks to ~/.claude/config.json
{
  "hooks": {
    "tool-use": "/path/to/.claude-viz/hooks/tool-use.js",
    "prompt-submit": "/path/to/.claude-viz/hooks/prompt-submit.js"
  }
}

# Start daemon
claude-viz start

# View in browser
claude-viz view
```

## Available MCP Tools

When installed as MCP server, Claude can use:

- `claude_viz_start` - Start the daemon
- `claude_viz_stop` - Stop the daemon
- `claude_viz_status` - Check status
- `claude_viz_get_sessions` - List sessions
- `claude_viz_export_session` - Export a session
- `claude_viz_view` - Get viewer URL

## Available MCP Resources

- `claude-viz://sessions` - Recent sessions data
- `claude-viz://config` - Current configuration

## Example Conversations

### With MCP Server Installed

**You:** "Start my visualization daemon"

**Claude:** "I'll start the visualization daemon for you."
*Uses claude_viz_start tool*
"✅ Daemon started on port 3456. You can view your sessions at http://localhost:3456"

---

**You:** "Show me my session statistics"

**Claude:** *Uses claude_viz_status tool*
"Here are your current statistics:
- Daemon: Running
- Total Sessions: 5
- Queue: 0 pending events
- Database: 2.5 MB"

---

**You:** "Export my last session as HTML"

**Claude:** *Uses claude_viz_get_sessions to find latest, then claude_viz_export_session*
"I've exported your session to session-abc123.html"

## Configuration

The MCP server respects your existing `~/.claude-viz/config.json`:

```json
{
  "dataDir": "~/.claude-viz",
  "daemonPort": 3456,
  "webPort": 3000,
  "autoStart": false
}
```

## Troubleshooting

### MCP Server Not Found

```bash
# Ensure npx can find it
npx @claude-viz/mcp-server

# Or install globally first
npm install -g @claude-viz/mcp-server
```

### Tools Not Available in Claude

Check your `~/.claude/config.json` has the MCP server configured:
```bash
cat ~/.claude/config.json | grep claude-viz
```

### Daemon Won't Start

```bash
# Check manually
claude-viz status

# Try starting manually first
claude-viz start

# Check logs
tail -f ~/.claude-viz/daemon.log
```

## Uninstalling

```bash
# Remove from Claude config
# Edit ~/.claude/config.json and remove claude-viz from mcpServers

# Uninstall npm package
npm uninstall -g claude-cli-viz

# Remove data
rm -rf ~/.claude-viz
```
