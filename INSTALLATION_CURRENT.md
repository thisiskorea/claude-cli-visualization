# 📦 Current Installation Guide (Pre-npm Publish)

## ⚠️ Important Note

The npm packages are not yet published. You must install via Git clone first.

## Installation Steps

### Step 1: Install Core Package (Required!)

Choose one method:

**Method A: One-line installer (Recommended)**
```bash
curl -fsSL https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.sh | bash
```

**Method B: Manual Git clone**
```bash
git clone https://github.com/thisiskorea/claude-cli-visualization.git
cd claude-cli-visualization
npm install
npm run build
cd packages/cli && npm link
```

**Method C: Clone specific branch**
```bash
git clone -b claude/local-cli-project-011CUxJWzt2xeAw4Vnfa4cNu \
  https://github.com/thisiskorea/claude-cli-visualization.git
cd claude-cli-visualization
npm install && npm run build
cd packages/cli && npm link
```

### Step 2: Verify Installation

```bash
claude-viz --version
# Should show: 0.1.0
```

### Step 3: Install Claude Code Plugin (Optional)

```bash
# In Claude Code
/plugin marketplace add thisiskorea/claude-cli-visualization
/plugin install claude-viz
```

### Step 4: Initialize and Start

```bash
# Initialize hooks
claude-viz init

# Start daemon
claude-viz start

# Open viewer
claude-viz view
```

## Usage

### Via CLI Commands

```bash
claude-viz start     # Start daemon
claude-viz stop      # Stop daemon
claude-viz status    # Check status
claude-viz view      # Open viewer
claude-viz export <session-id> -f html
```

### Via Plugin Slash Commands

```bash
/viz-start
/viz-stop
/viz-status
/viz-view
/viz-export <session-id> html
```

### Via Natural Language

Ask Claude:
- "Start my visualization daemon"
- "Show me my sessions"
- "Export my last session as HTML"

## Troubleshooting

### "claude-viz: command not found"

You skipped Step 1! Install the core package first.

### "Unknown slash command: viz-start"

1. Make sure you completed Step 1
2. Restart Claude Code
3. Run: `/plugin list` to verify installation

### Plugin installation fails

```bash
# Update marketplace
/plugin marketplace update claude-cli-visualization

# Reinstall
/plugin uninstall claude-viz
/plugin install claude-viz
```

## After npm Publish

Once packages are published to npm, installation will be simpler:

```bash
# Just one command!
npm install -g claude-cli-viz

# Or via plugin only
/plugin install claude-viz
# Everything auto-installs!
```

## What Gets Installed

**Core packages (via install.sh):**
- `claude-cli-viz` - CLI tool
- `@claude-viz/shared` - Common utilities
- `@claude-viz/hooks` - Hook scripts
- `@claude-viz/daemon` - Background service
- `@claude-viz/web` - Web viewer
- `@claude-viz/mcp-server` - MCP integration

**Plugin adds:**
- Slash commands integration
- MCP tools for Claude
- Hook auto-configuration

## File Locations

```
~/.claude-viz/              # Data directory
  ├── claude-viz.db         # Session database
  ├── config.json           # Configuration
  ├── queue/                # Event queue
  └── hooks/                # Hook scripts

~/.claude/config.json       # Claude config (add hooks here)
```

## Next Steps

1. ✅ Install core package
2. ✅ Verify with `claude-viz --version`
3. ✅ Run `claude-viz init`
4. ✅ Start with `claude-viz start` or `/viz-start`
5. ✅ View at http://localhost:3456

Enjoy visualizing your Claude CLI sessions! 🎉
