# Installation Guide

## Quick Install

```bash
npm install -g claude-cli-viz
```

## Setup

1. **Initialize hooks**
   ```bash
   claude-viz init
   ```

   This will create hook scripts and show you the configuration to add to your Claude CLI config.

2. **Add hooks to Claude CLI config**

   Edit `~/.claude/config.json` and add:
   ```json
   {
     "hooks": {
       "tool-use": "/path/to/.claude-viz/hooks/tool-use.js",
       "prompt-submit": "/path/to/.claude-viz/hooks/prompt-submit.js"
     }
   }
   ```

3. **Start the daemon**
   ```bash
   claude-viz start
   ```

4. **Open the viewer**
   ```bash
   claude-viz view
   ```

## Manual Installation (Development)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd claude-cli-visualization
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build all packages**
   ```bash
   npm run build
   ```

4. **Link CLI globally**
   ```bash
   cd packages/cli
   npm link
   ```

Now you can use `claude-viz` from anywhere.

## Verification

Check if everything is working:
```bash
claude-viz status
```

You should see the daemon status and configuration.

## Troubleshooting

### Daemon won't start

- Check if port 3456 is available
- Look for error logs in `~/.claude-viz/`
- Try running in foreground: `claude-viz start -f`

### Hooks not working

- Verify hook paths in Claude config
- Check hook scripts are executable
- Ensure `claude-viz-hook` package is installed

### Web viewer not loading

- Make sure daemon is running: `claude-viz status`
- Check browser console for errors
- Try accessing directly: http://localhost:3456
