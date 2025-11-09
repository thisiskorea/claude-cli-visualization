/**
 * Utility functions
 */

import crypto from 'crypto';
import path from 'path';
import os from 'os';

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Get the default data directory
 */
export function getDefaultDataDir(): string {
  return path.join(os.homedir(), '.claude-viz');
}

/**
 * Get the default Claude CLI config path
 */
export function getDefaultClaudeConfigPath(): string {
  return path.join(os.homedir(), '.claude', 'config.json');
}

/**
 * Format timestamp to human-readable string
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/**
 * Calculate duration in a human-readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

/**
 * Estimate cost based on token usage (Claude 3.5 Sonnet pricing)
 */
export function estimateCost(tokensInput: number, tokensOutput: number): number {
  const INPUT_COST_PER_1M = 3.0; // $3 per million input tokens
  const OUTPUT_COST_PER_1M = 15.0; // $15 per million output tokens

  const inputCost = (tokensInput / 1_000_000) * INPUT_COST_PER_1M;
  const outputCost = (tokensOutput / 1_000_000) * OUTPUT_COST_PER_1M;

  return inputCost + outputCost;
}

/**
 * Truncate string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string | null | undefined, defaultValue: T): T {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
}

/**
 * Stringify JSON safely
 */
export function safeJsonStringify(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return '{}';
  }
}

/**
 * Get current Git branch
 */
export async function getCurrentGitBranch(cwd: string): Promise<string | undefined> {
  try {
    const { execSync } = await import('child_process');
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd, encoding: 'utf8' }).trim();
    return branch;
  } catch {
    return undefined;
  }
}

/**
 * Get Git repository URL
 */
export async function getGitRepoUrl(cwd: string): Promise<string | undefined> {
  try {
    const { execSync } = await import('child_process');
    const url = execSync('git config --get remote.origin.url', { cwd, encoding: 'utf8' }).trim();
    return url;
  } catch {
    return undefined;
  }
}

/**
 * Check if path is a Git repository
 */
export async function isGitRepo(cwd: string): Promise<boolean> {
  try {
    const { execSync } = await import('child_process');
    execSync('git rev-parse --git-dir', { cwd, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}
