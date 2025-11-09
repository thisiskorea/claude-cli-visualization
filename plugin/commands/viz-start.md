---
description: Start the Claude CLI visualization daemon
---

# Start Visualization Daemon

Start the background daemon that collects and visualizes Claude CLI session data.

## Prerequisites Check

First, verify that claude-viz is installed:

```bash
which claude-viz || npm list -g claude-cli-viz
```

If not installed, inform the user:
```
⚠️  claude-viz is not installed!

Install it with one of these methods:

Method 1 (recommended):
  curl -fsSL https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.sh | bash

Method 2:
  npm install -g claude-cli-viz

Then run /viz-start again.
```

## If Installed

1. Check if the daemon is already running: `claude-viz status`
2. If not running, execute: `claude-viz start`
3. Confirm the daemon started successfully
4. Display the web viewer URL: http://localhost:3456

After starting, inform the user they can:
- Use `/viz-view` to open the web interface
- Use `/viz-status` to check daemon status
- Continue using Claude CLI normally - all sessions will be tracked
