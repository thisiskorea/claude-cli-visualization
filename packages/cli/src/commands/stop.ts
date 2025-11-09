/**
 * Stop command - stops the daemon
 */

import fs from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import { isDaemonRunning, getPidFile, removePidFile } from '../config';

export async function stopCommand() {
  if (!isDaemonRunning()) {
    console.log(chalk.yellow('⚠️  Daemon is not running'));
    return;
  }

  const spinner = ora('Stopping daemon...').start();

  try {
    const pidFile = getPidFile();
    const pid = parseInt(fs.readFileSync(pidFile, 'utf8').trim(), 10);

    // Send SIGTERM
    process.kill(pid, 'SIGTERM');

    // Wait for process to exit
    let attempts = 0;
    while (attempts < 50) {
      try {
        process.kill(pid, 0);
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      } catch {
        // Process has exited
        break;
      }
    }

    if (attempts >= 50) {
      spinner.warn('Daemon did not stop gracefully, forcing...');
      process.kill(pid, 'SIGKILL');
    }

    removePidFile();
    spinner.succeed('Daemon stopped successfully');
  } catch (error) {
    spinner.fail('Failed to stop daemon');
    console.error(chalk.red(error));
    process.exit(1);
  }
}
