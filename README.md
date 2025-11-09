# 🎨 Claude CLI Visualizer

> Visualize, analyze, and share your Claude CLI sessions with beautiful insights

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)

## ✨ Features

- 📊 **Real-time Session Tracking** - Monitor Claude CLI usage as it happens
- 🎯 **Tool Usage Analytics** - See which tools are used most frequently
- 📈 **Token & Cost Tracking** - Track API usage and estimated costs
- 🌳 **File Change Visualization** - Beautiful tree view of modified files
- ⏱️ **Timeline View** - Interactive timeline of all session events
- 🔄 **Agent Call Tree** - Visualize subagent and task hierarchies
- 📤 **Export & Share** - Export sessions as standalone HTML files
- 🪶 **Lightweight** - Minimal overhead on Claude CLI performance

## 🚀 Quick Start

### Method 1: Claude CLI Plugin (Easiest!)

Add to your `~/.claude/config.json`:
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

Then ask Claude: *"Start my visualization daemon"*

### Method 2: One-Line Install

**Linux / macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iwr -useb https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.ps1 | iex
```

### Method 3: npm Install

```bash
# Install globally
npm install -g claude-cli-viz

# Or use npx (no installation needed)
npx claude-cli-viz init
```

### Quick Setup

```bash
# Initialize (sets up Claude CLI hooks)
claude-viz init

# Start the background daemon
claude-viz start

# Open web viewer
claude-viz view
```

## 📦 Architecture

This project uses a lightweight hook-based approach:

1. **Hooks** - Minimal scripts that capture Claude CLI events
2. **Daemon** - Background process that collects and stores data
3. **Web Viewer** - Beautiful React interface for visualization
4. **Export** - Share sessions as standalone HTML

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build all packages
npm run build
```

## 📁 Project Structure

```
packages/
├── shared/     # Common types and utilities
├── hooks/      # Claude CLI hook scripts
├── daemon/     # Background logger service
├── web/        # React web viewer
└── cli/        # Main CLI tool
```

## 🎯 Captured Data

- Tool uses (Bash, Read, Write, Edit, etc.)
- User prompts and assistant responses
- File modifications
- Task and agent invocations
- Token usage and timing
- Git repository context

## 📊 Visualizations

- **Timeline** - Chronological view of session events
- **Tool Stats** - Usage frequency and success rates
- **File Tree** - Modified files in tree structure
- **Token Graph** - Usage over time
- **Cost Tracker** - API cost estimation
- **Agent Tree** - Hierarchical task/agent calls

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🙏 Acknowledgments

Built for the Claude CLI community by passionate developers.
