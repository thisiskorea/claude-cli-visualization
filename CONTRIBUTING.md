# Contributing to Claude CLI Visualizer

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. **Prerequisites**
   - Node.js >= 18
   - npm >= 9

2. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd claude-cli-visualization
   npm install
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Development Mode**
   ```bash
   npm run dev
   ```

## Project Structure

- `packages/shared/` - Common types and utilities
- `packages/hooks/` - Claude CLI hook scripts
- `packages/daemon/` - Background data collection service
- `packages/web/` - React web viewer
- `packages/cli/` - Main CLI tool

## Making Changes

1. Create a new branch for your feature/fix
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Code Style

- Use TypeScript
- Follow existing code style
- Add comments for complex logic
- Write meaningful commit messages

## Testing

Run tests before submitting:
```bash
npm run test
npm run lint
```

## Questions?

Open an issue for any questions or concerns.
