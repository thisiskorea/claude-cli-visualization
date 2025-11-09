/**
 * View command - opens web viewer
 */

import { exec } from 'child_process';
import chalk from 'chalk';
import { isDaemonRunning, loadConfig } from '../config';

export async function viewCommand() {
  if (!isDaemonRunning()) {
    console.log(
      chalk.yellow('⚠️  Daemon is not running. Start it with: claude-viz start')
    );
    return;
  }

  const config = loadConfig();
  const url = `http://localhost:${config.daemonPort}`;

  console.log(chalk.cyan(`Opening ${url}...`));

  // Open browser based on platform
  const platform = process.platform;
  let command: string;

  switch (platform) {
    case 'darwin':
      command = `open ${url}`;
      break;
    case 'win32':
      command = `start ${url}`;
      break;
    default:
      command = `xdg-open ${url}`;
  }

  exec(command, (error) => {
    if (error) {
      console.error(chalk.red('Failed to open browser'));
      console.log(chalk.gray(`Please open manually: ${url}`));
    }
  });
}
