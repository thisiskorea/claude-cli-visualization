---
description: Export a session to HTML, JSON, or Markdown
args:
  - name: session_id
    description: "Session ID to export (use 'latest' for most recent)"
    required: true
  - name: format
    description: "Export format: html, json, or markdown (default: html)"
    required: false
---

# Export Session

Export a Claude CLI session for sharing or archival.

## Instructions

Use the provided arguments:
- session_id: $ARGUMENTS[0] (required)
- format: $ARGUMENTS[1] (optional, defaults to html)

1. If session_id is 'latest', first get the most recent session ID
2. Validate the session exists
3. Execute: `claude-viz export {session_id} -f {format}`
4. Confirm the export was successful
5. Display the output file path
6. Explain what the exported file contains:
   - Session metadata
   - Full timeline of events
   - Tool usage statistics
   - File changes
   - Token usage and costs

## Formats

- **html**: Standalone HTML file (best for sharing)
- **json**: Raw data (best for processing)
- **markdown**: Formatted report (best for documentation)
