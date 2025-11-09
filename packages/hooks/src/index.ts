#!/usr/bin/env node

/**
 * Claude CLI Hook Entry Point
 *
 * This script is called by Claude CLI hooks with minimal overhead.
 * It quickly writes event data to a local queue file for the daemon to process.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { HookEvent } from '@claude-viz/shared';

const DATA_DIR = path.join(os.homedir(), '.claude-viz');
const QUEUE_DIR = path.join(DATA_DIR, 'queue');
const SESSION_FILE = path.join(DATA_DIR, 'current-session.txt');

// Ensure queue directory exists
if (!fs.existsSync(QUEUE_DIR)) {
  fs.mkdirSync(QUEUE_DIR, { recursive: true });
}

/**
 * Get or create current session ID
 */
function getCurrentSessionId(): string {
  try {
    if (fs.existsSync(SESSION_FILE)) {
      const sessionId = fs.readFileSync(SESSION_FILE, 'utf8').trim();
      if (sessionId) return sessionId;
    }
  } catch {
    // Ignore errors
  }

  // Generate new session ID
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  fs.writeFileSync(SESSION_FILE, sessionId, 'utf8');
  return sessionId;
}

/**
 * Write event to queue
 */
function writeEvent(event: HookEvent): void {
  const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.json`;
  const filepath = path.join(QUEUE_DIR, filename);

  try {
    fs.writeFileSync(filepath, JSON.stringify(event), 'utf8');
  } catch (error) {
    // Silent fail - we don't want to break Claude CLI
    console.error('[claude-viz] Failed to write event:', error);
  }
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);
  const hookType = args[0];

  if (!hookType) {
    console.error('Usage: claude-viz-hook <type> [data]');
    process.exit(1);
  }

  const sessionId = getCurrentSessionId();
  const timestamp = Date.now();

  let eventType: HookEvent['type'];
  let data: any = {};

  // Parse hook type and stdin data
  switch (hookType) {
    case 'tool-use':
      eventType = 'tool-use';
      // Read tool use data from stdin
      if (process.stdin.isTTY) {
        // If running in terminal, try to parse from args
        data = args[1] ? JSON.parse(args[1]) : {};
      } else {
        // Read from stdin (preferred)
        const chunks: Buffer[] = [];
        process.stdin.on('data', chunk => chunks.push(chunk));
        process.stdin.on('end', () => {
          try {
            const input = Buffer.concat(chunks).toString('utf8');
            data = input ? JSON.parse(input) : {};

            const event: HookEvent = {
              type: eventType,
              sessionId,
              timestamp,
              data,
            };

            writeEvent(event);
          } catch (error) {
            console.error('[claude-viz] Failed to parse stdin:', error);
          }
        });
        return; // Wait for stdin
      }
      break;

    case 'prompt-submit':
      eventType = 'prompt-submit';
      data = { prompt: args.slice(1).join(' ') };
      break;

    case 'message':
      eventType = 'message';
      data = args[1] ? JSON.parse(args[1]) : {};
      break;

    default:
      console.error(`Unknown hook type: ${hookType}`);
      process.exit(1);
  }

  const event: HookEvent = {
    type: eventType,
    sessionId,
    timestamp,
    data,
  };

  writeEvent(event);
}

// Only run if called directly
if (require.main === module) {
  main();
}

export { getCurrentSessionId, writeEvent };
