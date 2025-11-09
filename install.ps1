# Claude CLI Visualizer - Windows installer
# Usage: iwr -useb https://raw.githubusercontent.com/thisiskorea/claude-cli-visualization/main/install.ps1 | iex

$ErrorActionPreference = "Stop"

Write-Host "🚀 Installing Claude CLI Visualizer..." -ForegroundColor Cyan

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

$nodeVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$nodeVersion -lt 18) {
    Write-Host "❌ Node.js version must be 18 or higher. Current: $(node -v)" -ForegroundColor Red
    exit 1
}

# Install directory
$installDir = if ($env:CLAUDE_VIZ_INSTALL_DIR) { $env:CLAUDE_VIZ_INSTALL_DIR } else { "$HOME\.claude-viz-install" }

# Clone repository
Write-Host "📦 Downloading..." -ForegroundColor Cyan
if (Test-Path $installDir) {
    Write-Host "Removing existing installation..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $installDir
}

git clone https://github.com/thisiskorea/claude-cli-visualization.git $installDir

# Install and build
Set-Location $installDir
Write-Host "📚 Installing dependencies..." -ForegroundColor Cyan
npm install --silent

Write-Host "🔨 Building packages..." -ForegroundColor Cyan
npm run build --silent

# Link CLI
Set-Location packages\cli
npm link

# Success message
Write-Host ""
Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: claude-viz init"
Write-Host "  2. Add hooks to your Claude CLI config"
Write-Host "  3. Run: claude-viz start"
Write-Host "  4. Run: claude-viz view"
Write-Host ""
Write-Host "📖 Documentation: https://github.com/thisiskorea/claude-cli-visualization" -ForegroundColor Cyan
Write-Host ""
