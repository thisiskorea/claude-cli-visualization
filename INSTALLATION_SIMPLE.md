# 🚀 Quick Installation

## One-Line Install

### Linux / macOS

```bash
curl -fsSL https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
iwr -useb https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.ps1 | iex
```

## Using npm (when published)

```bash
npm install -g claude-cli-viz
```

## Using npx (no installation)

```bash
npx claude-cli-viz init
npx claude-cli-viz start
```

## Manual Install

```bash
# Clone
git clone https://github.com/thisiskorea/claude-cli-visualization.git
cd claude-cli-visualization

# Install & Build
npm install
npm run build

# Link CLI
cd packages/cli
npm link
```

## Quick Start

```bash
# 1. Initialize
claude-viz init

# 2. Start daemon
claude-viz start

# 3. Open viewer
claude-viz view
```

## Verify Installation

```bash
claude-viz --version
claude-viz status
```

## Troubleshooting

### "turbo: not found"

```bash
npm install
npm run build
```

### "command not found: claude-viz"

```bash
# Add npm global bin to PATH
export PATH=$(npm bin -g):$PATH
```

### Permission errors

```bash
# Use npm global without sudo
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Uninstall

```bash
npm uninstall -g claude-cli-viz
rm -rf ~/.claude-viz
```
