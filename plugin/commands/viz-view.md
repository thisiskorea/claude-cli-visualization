---
description: Open the visualization web viewer in browser
---

# Open Visualization Viewer

Open the web interface to view and analyze Claude CLI sessions.

## Instructions

1. Check if the daemon is running using `claude-viz status`
2. If not running, inform the user to run `/viz-start` first
3. If running, execute: `claude-viz view`
4. Inform the user that the web viewer is opening at http://localhost:3456
5. Explain what they'll see:
   - List of all sessions
   - Session details with timeline
   - Tool usage statistics and charts
   - File change visualization
   - Export options

If the browser doesn't open automatically, provide the URL they can visit manually.
