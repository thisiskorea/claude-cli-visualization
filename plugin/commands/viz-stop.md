---
description: Stop the visualization daemon
---

# Stop Visualization Daemon

Stop the background daemon that's collecting session data.

## Prerequisites Check

First, verify that claude-viz is installed by checking if the command exists.

If not installed, inform the user that they need to install it first.

## If Installed

1. Check if the daemon is running: `claude-viz status`
2. If running, execute: `claude-viz stop`
3. Confirm the daemon stopped successfully
4. Inform the user that session tracking is now paused

The user can restart anytime with `/viz-start`.
