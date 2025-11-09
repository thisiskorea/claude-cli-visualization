/**
 * Configuration management
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { getDefaultDataDir, getDefaultClaudeConfigPath } from '@claude-viz/shared';

export interface Config {
  dataDir: string;
  daemonPort: number;
  webPort: number;
  claudeConfigPath: string;
  autoStart: boolean;
}

const CONFIG_FILE = path.join(getDefaultDataDir(), 'config.json');

const DEFAULT_CONFIG: Config = {
  dataDir: getDefaultDataDir(),
  daemonPort: 3456,
  webPort: 3000,
  claudeConfigPath: getDefaultClaudeConfigPath(),
  autoStart: false,
};

/**
 * Load configuration
 */
export function loadConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(content) };
    }
  } catch (error) {
    console.warn('Failed to load config, using defaults');
  }

  return DEFAULT_CONFIG;
}

/**
 * Save configuration
 */
export function saveConfig(config: Partial<Config>): void {
  const current = loadConfig();
  const updated = { ...current, ...config };

  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf8');
}

/**
 * Get PID file path
 */
export function getPidFile(): string {
  return path.join(getDefaultDataDir(), 'daemon.pid');
}

/**
 * Check if daemon is running
 */
export function isDaemonRunning(): boolean {
  const pidFile = getPidFile();

  if (!fs.existsSync(pidFile)) {
    return false;
  }

  try {
    const pid = parseInt(fs.readFileSync(pidFile, 'utf8').trim(), 10);
    // Check if process is running
    process.kill(pid, 0);
    return true;
  } catch {
    // Process not running, clean up stale PID file
    fs.unlinkSync(pidFile);
    return false;
  }
}

/**
 * Write PID file
 */
export function writePidFile(pid: number): void {
  const pidFile = getPidFile();
  fs.writeFileSync(pidFile, pid.toString(), 'utf8');
}

/**
 * Remove PID file
 */
export function removePidFile(): void {
  const pidFile = getPidFile();
  if (fs.existsSync(pidFile)) {
    fs.unlinkSync(pidFile);
  }
}
