/**
 * Initialize command - sets up Claude CLI hooks
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { loadConfig, saveConfig } from '../config';

export async function initCommand() {
  console.log(chalk.bold.cyan('🚀 Initializing Claude CLI Visualizer...\n'));

  const config = loadConfig();

  // Check if Claude CLI config exists
  if (!fs.existsSync(config.claudeConfigPath)) {
    console.log(
      chalk.yellow(
        `⚠️  Claude CLI config not found at: ${config.claudeConfigPath}\n`
      )
    );
    console.log(
      chalk.gray(
        'The hooks will be configured, but you may need to manually add them to your Claude config.\n'
      )
    );
  }

  // Ensure data directory exists
  if (!fs.existsSync(config.dataDir)) {
    fs.mkdirSync(config.dataDir, { recursive: true });
    console.log(chalk.green(`✓ Created data directory: ${config.dataDir}`));
  }

  // Create hook scripts directory
  const hooksDir = path.join(config.dataDir, 'hooks');
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  // Write hook scripts
  const hookScript = `#!/usr/bin/env node
// Auto-generated hook script for Claude CLI Visualizer
require('claude-viz-hook');
`;

  const toolUseHook = path.join(hooksDir, 'tool-use.js');
  fs.writeFileSync(toolUseHook, hookScript, 'utf8');
  fs.chmodSync(toolUseHook, '755');

  const promptHook = path.join(hooksDir, 'prompt-submit.js');
  fs.writeFileSync(promptHook, hookScript, 'utf8');
  fs.chmodSync(promptHook, '755');

  console.log(chalk.green('✓ Created hook scripts'));

  // Display hook configuration
  console.log(chalk.bold('\n📝 Hook Configuration:\n'));
  console.log(
    chalk.gray(
      'Add the following to your Claude CLI config (~/.claude/config.json):\n'
    )
  );

  const hookConfig = {
    hooks: {
      'tool-use': toolUseHook,
      'prompt-submit': promptHook,
    },
  };

  console.log(chalk.cyan(JSON.stringify(hookConfig, null, 2)));

  console.log(chalk.bold.green('\n✨ Initialization complete!\n'));
  console.log(chalk.gray('Next steps:'));
  console.log(chalk.gray('  1. Add hooks to your Claude config (if not automatic)'));
  console.log(chalk.gray('  2. Run: claude-viz start'));
  console.log(chalk.gray('  3. Run: claude-viz view\n'));
}
