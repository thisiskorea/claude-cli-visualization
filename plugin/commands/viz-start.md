---
description: Start the Claude CLI visualization daemon
---

# Start Visualization Daemon

Start the background daemon that collects and visualizes Claude CLI session data.

## Instructions

1. Check if the daemon is already running
2. If not running, execute: `claude-viz start`
3. Confirm the daemon started successfully
4. Display the web viewer URL: http://localhost:3456

After starting, inform the user they can:
- Use `/viz-view` to open the web interface
- Use `/viz-status` to check daemon status
- Continue using Claude CLI normally - all sessions will be tracked
