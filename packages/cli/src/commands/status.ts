/**
 * Status command - shows daemon status
 */

import fs from 'fs';
import chalk from 'chalk';
import { isDaemonRunning, getPidFile, loadConfig } from '../config';

export async function statusCommand() {
  const config = loadConfig();
  const running = isDaemonRunning();

  console.log(chalk.bold.cyan('📊 Claude CLI Visualizer Status\n'));

  // Daemon status
  if (running) {
    const pidFile = getPidFile();
    const pid = parseInt(fs.readFileSync(pidFile, 'utf8').trim(), 10);

    console.log(chalk.green('✓ Daemon: Running'));
    console.log(chalk.gray(`  PID: ${pid}`));
  } else {
    console.log(chalk.red('✗ Daemon: Not running'));
  }

  // Configuration
  console.log(chalk.bold('\n⚙️  Configuration:'));
  console.log(chalk.gray(`  Data directory: ${config.dataDir}`));
  console.log(chalk.gray(`  Daemon port: ${config.daemonPort}`));
  console.log(chalk.gray(`  Web port: ${config.webPort}`));

  // URLs
  if (running) {
    console.log(chalk.bold('\n🌐 URLs:'));
    console.log(chalk.cyan(`  API: http://localhost:${config.daemonPort}`));
    console.log(chalk.cyan(`  Viewer: http://localhost:${config.webPort}`));
  }

  // Data directory contents
  console.log(chalk.bold('\n📁 Data:'));
  const queueDir = `${config.dataDir}/queue`;
  if (fs.existsSync(queueDir)) {
    const files = fs.readdirSync(queueDir).filter((f) => f.endsWith('.json'));
    console.log(chalk.gray(`  Queue: ${files.length} pending events`));
  } else {
    console.log(chalk.gray('  Queue: Empty'));
  }

  const dbFile = `${config.dataDir}/claude-viz.db`;
  if (fs.existsSync(dbFile)) {
    const stats = fs.statSync(dbFile);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(chalk.gray(`  Database: ${sizeMB} MB`));
  } else {
    console.log(chalk.gray('  Database: Not created yet'));
  }

  console.log();
}
