# Claude CLI Visualization Plugin

Visualize, analyze, and share your Claude CLI sessions with beautiful insights.

## ⚠️ Prerequisites

This plugin requires `claude-cli-viz` to be installed on your system.

### Install Prerequisites First

**Option 1: One-line installer (Recommended)**
```bash
curl -fsSL https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.sh | bash
```

**Option 2: npm global install**
```bash
npm install -g claude-cli-viz
```

**Option 3: Manual installation**
```bash
git clone https://github.com/thisiskorea/claude-cli-visualization.git
cd claude-cli-visualization
npm install && npm run build
cd packages/cli && npm link
```

## Installation

After installing the prerequisites:

```bash
# Add marketplace
/plugin marketplace add thisiskorea/claude-cli-visualization

# Install plugin
/plugin install claude-viz
```

The plugin will:
1. Verify claude-cli-viz is installed
2. Set up integration with Claude Code
3. Enable slash commands and MCP tools

## Features

- 📊 **Real-time Session Tracking** - Monitor Claude CLI usage as it happens
- 🎯 **Tool Usage Analytics** - See which tools are used most frequently
- 📈 **Token & Cost Tracking** - Track API usage and estimated costs
- 🌳 **File Change Visualization** - Beautiful tree view of modified files
- ⏱️ **Timeline View** - Interactive timeline of all session events
- 📤 **Export & Share** - Export sessions as standalone HTML files
- 🪶 **Lightweight** - Minimal overhead on Claude CLI performance

## Slash Commands

After installation, you can use:

- `/viz-start` - Start the visualization daemon
- `/viz-stop` - Stop the daemon
- `/viz-status` - Check daemon status
- `/viz-view` - Open web viewer in browser
- `/viz-export <session-id> [format]` - Export a session

## MCP Tools

The plugin also provides MCP tools that Claude can use:

- `claude_viz_start` - Start daemon
- `claude_viz_stop` - Stop daemon
- `claude_viz_status` - Get status
- `claude_viz_get_sessions` - List sessions
- `claude_viz_export_session` - Export sessions
- `claude_viz_view` - Get viewer URL

## Natural Language Usage

Once installed, you can ask Claude:

- "Start my visualization daemon"
- "Show me my recent Claude sessions"
- "Export my last session as HTML"
- "What's my tool usage statistics?"

## Quick Start

```bash
# 1. Install prerequisites
curl -fsSL https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.sh | bash

# 2. Install plugin
/plugin marketplace add thisiskorea/claude-cli-visualization
/plugin install claude-viz

# 3. Start daemon
/viz-start

# 4. Open viewer
/viz-view

# 5. Use Claude CLI normally - all sessions are tracked!
```

## Web Interface

The web interface runs at `http://localhost:3456` and shows:

- Session list with status
- Detailed session view
- Tool usage statistics and charts
- Timeline of all events
- File change tree
- Token usage and cost estimates

## Export & Share

Export sessions to share with your team:

```bash
/viz-export <session-id> html  # Standalone HTML
/viz-export <session-id> json  # Raw data
/viz-export <session-id> md    # Markdown report
```

## Configuration

Config file: `~/.claude-viz/config.json`

```json
{
  "dataDir": "~/.claude-viz",
  "daemonPort": 3456,
  "webPort": 3000,
  "autoStart": false
}
```

## Troubleshooting

### "claude-viz: command not found"

The prerequisite package is not installed. Install it using one of the methods above.

### Daemon won't start

```bash
# Check status
/viz-status

# Check logs
tail -f ~/.claude-viz/daemon.log

# Try manual start
claude-viz start -f
```

### MCP tools not available

Ensure the MCP server is configured in your Claude config:

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

### Slash commands don't work

1. Restart Claude Code after installation
2. Verify plugin is installed: `/plugin list`
3. Update marketplace: `/plugin marketplace update`

## Links

- [GitHub](https://github.com/thisiskorea/claude-cli-visualization)
- [Documentation](https://github.com/thisiskorea/claude-cli-visualization/blob/main/README.md)
- [Issues](https://github.com/thisiskorea/claude-cli-visualization/issues)

## License

MIT
