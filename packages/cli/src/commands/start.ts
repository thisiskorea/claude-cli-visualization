/**
 * Start command - starts the daemon
 */

import { spawn } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { isDaemonRunning, writePidFile, loadConfig } from '../config';

export async function startCommand(options: { detach?: boolean } = {}) {
  // Check if already running
  if (isDaemonRunning()) {
    console.log(chalk.yellow('⚠️  Daemon is already running'));
    return;
  }

  const spinner = ora('Starting daemon...').start();

  try {
    const config = loadConfig();

    // Find daemon executable
    const daemonPath = require.resolve('@claude-viz/daemon');

    // Start daemon process
    const daemon = spawn('node', [daemonPath], {
      detached: options.detach !== false,
      stdio: options.detach !== false ? 'ignore' : 'inherit',
      env: {
        ...process.env,
        CLAUDE_VIZ_DATA_DIR: config.dataDir,
        CLAUDE_VIZ_PORT: config.daemonPort.toString(),
      },
    });

    if (options.detach !== false) {
      daemon.unref();
      writePidFile(daemon.pid!);

      // Wait a bit to ensure it started
      await new Promise((resolve) => setTimeout(resolve, 1000));

      spinner.succeed('Daemon started successfully');
      console.log(chalk.gray(`PID: ${daemon.pid}`));
      console.log(chalk.gray(`Data directory: ${config.dataDir}`));
      console.log(chalk.gray(`API: http://localhost:${config.daemonPort}`));
    } else {
      spinner.stop();
      console.log(chalk.cyan('Running daemon in foreground...'));
      console.log(chalk.gray('Press Ctrl+C to stop\n'));

      // Wait for process
      await new Promise((resolve) => {
        daemon.on('exit', resolve);
      });
    }
  } catch (error) {
    spinner.fail('Failed to start daemon');
    console.error(chalk.red(error));
    process.exit(1);
  }
}
