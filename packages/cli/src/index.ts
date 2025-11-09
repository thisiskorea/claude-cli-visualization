#!/usr/bin/env node

/**
 * Main CLI entry point
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { startCommand } from './commands/start';
import { stopCommand } from './commands/stop';
import { viewCommand } from './commands/view';
import { statusCommand } from './commands/status';
import { exportCommand } from './commands/export';

const program = new Command();

program
  .name('claude-viz')
  .description('CLI tool for visualizing Claude CLI sessions')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize Claude CLI hooks')
  .action(async () => {
    try {
      await initCommand();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('start')
  .description('Start the daemon')
  .option('-f, --foreground', 'Run in foreground')
  .action(async (options) => {
    try {
      await startCommand({ detach: !options.foreground });
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('stop')
  .description('Stop the daemon')
  .action(async () => {
    try {
      await stopCommand();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show daemon status')
  .action(async () => {
    try {
      await statusCommand();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('view')
  .description('Open web viewer in browser')
  .action(async () => {
    try {
      await viewCommand();
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('export')
  .description('Export session data')
  .argument('<session-id>', 'Session ID to export')
  .option('-f, --format <format>', 'Export format (json, html, markdown)', 'html')
  .option('-o, --output <path>', 'Output file path')
  .action(async (sessionId, options) => {
    try {
      await exportCommand(sessionId, options);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program.parse();
