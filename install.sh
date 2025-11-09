#!/bin/bash

# Claude CLI Visualizer - One-line installer
# Usage: curl -fsSL https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.sh | bash

set -e

echo "🚀 Installing Claude CLI Visualizer..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

# Install directory
INSTALL_DIR="${CLAUDE_VIZ_INSTALL_DIR:-$HOME/.claude-viz-install}"

# Clone repository
echo "📦 Downloading..."
if [ -d "$INSTALL_DIR" ]; then
    echo "Removing existing installation..."
    rm -rf "$INSTALL_DIR"
fi

git clone https://github.com/thisiskorea/claude-cli-visualization.git "$INSTALL_DIR"

# Install and build
cd "$INSTALL_DIR"
echo "📚 Installing dependencies..."
npm install --silent

echo "🔨 Building packages..."
npm run build --silent

# Link CLI
cd packages/cli
npm link

# Success message
echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Run: claude-viz init"
echo "  2. Add hooks to your Claude CLI config"
echo "  3. Run: claude-viz start"
echo "  4. Run: claude-viz view"
echo ""
echo "📖 Documentation: https://github.com/thisiskorea/claude-cli-visualization"
echo ""
