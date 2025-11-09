# Usage Guide

## CLI Commands

### `claude-viz init`

Initialize Claude CLI hooks. This sets up the hook scripts and shows you what to add to your Claude config.

```bash
claude-viz init
```

### `claude-viz start`

Start the background daemon that collects session data.

```bash
# Start in background (default)
claude-viz start

# Start in foreground (for debugging)
claude-viz start -f
```

### `claude-viz stop`

Stop the daemon.

```bash
claude-viz stop
```

### `claude-viz status`

Show daemon status and configuration.

```bash
claude-viz status
```

Output includes:
- Daemon running status
- PID if running
- Configuration settings
- Data directory stats

### `claude-viz view`

Open the web viewer in your default browser.

```bash
claude-viz view
```

This opens http://localhost:3456 in your browser.

### `claude-viz export`

Export a session to various formats.

```bash
# Export as HTML (default)
claude-viz export <session-id>

# Export as JSON
claude-viz export <session-id> -f json

# Export as Markdown
claude-viz export <session-id> -f markdown

# Specify output file
claude-viz export <session-id> -o my-session.html
```

## Web Viewer

The web viewer provides several views:

### Session List

Shows all your Claude CLI sessions with:
- Session status (active/completed)
- Working directory
- Git branch
- Start time and duration

Click on any session to view details.

### Session Detail

For each session, you can see:

1. **Statistics**
   - Total messages
   - Tool usage count
   - Token consumption
   - Estimated cost

2. **Tool Usage Chart**
   - Bar chart showing which tools were used most
   - Success/failure rates

3. **Timeline**
   - Chronological view of all events
   - User messages
   - Assistant responses
   - Tool invocations
   - File changes

4. **File Tree**
   - Tree view of all modified files
   - Lines added/removed
   - Change type (created/modified/deleted)

## Typical Workflow

1. **One-time setup**
   ```bash
   npm install -g claude-cli-viz
   claude-viz init
   # Add hooks to Claude config
   ```

2. **Daily usage**
   ```bash
   # Start daemon (if not running)
   claude-viz start

   # Use Claude CLI normally
   # All your sessions are automatically tracked!

   # View sessions
   claude-viz view
   ```

3. **Sharing sessions**
   ```bash
   # Export a session to share with team
   claude-viz export abc123 -f html
   # Share the HTML file
   ```

## Advanced Usage

### Custom Data Directory

Set a custom data directory via environment variable:

```bash
export CLAUDE_VIZ_DATA_DIR=/path/to/data
claude-viz start
```

### Custom Ports

Edit `~/.claude-viz/config.json`:

```json
{
  "daemonPort": 3456,
  "webPort": 3000
}
```

### Running Multiple Instances

You can run multiple daemons on different ports for different projects:

```bash
# Project 1
CLAUDE_VIZ_DATA_DIR=~/project1/.claude-viz \
CLAUDE_VIZ_PORT=3456 \
claude-viz start

# Project 2
CLAUDE_VIZ_DATA_DIR=~/project2/.claude-viz \
CLAUDE_VIZ_PORT=3457 \
claude-viz start
```

## Tips

- Keep the daemon running in the background for continuous tracking
- Export important sessions for documentation
- Use the timeline to understand complex debugging sessions
- Check tool usage stats to optimize your workflow
