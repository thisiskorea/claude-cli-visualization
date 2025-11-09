#!/usr/bin/env node

/**
 * Main daemon entry point
 */

import path from 'path';
import os from 'os';
import { DatabaseManager } from './database';
import { EventCollector } from './collector';
import { WebServer } from './server';
import { getDefaultDataDir } from '@claude-viz/shared';

const DATA_DIR = getDefaultDataDir();
const PORT = 3456;

let db: DatabaseManager;
let collector: EventCollector;
let server: WebServer;

/**
 * Start the daemon
 */
async function start() {
  console.log('🚀 Starting Claude CLI Visualizer Daemon...');
  console.log(`📁 Data directory: ${DATA_DIR}`);

  try {
    // Initialize database
    db = new DatabaseManager(DATA_DIR);
    console.log('✓ Database initialized');

    // Start event collector
    collector = new EventCollector(DATA_DIR, db);
    collector.start();
    console.log('✓ Event collector started');

    // Start web server
    server = new WebServer(db, PORT);
    await server.start();
    console.log('✓ Web server started');

    console.log('\n✨ Daemon is running!');
    console.log(`🌐 Open http://localhost:${PORT} to view sessions\n`);
  } catch (error) {
    console.error('❌ Failed to start daemon:', error);
    process.exit(1);
  }
}

/**
 * Stop the daemon
 */
async function stop() {
  console.log('\n🛑 Stopping daemon...');

  try {
    if (collector) {
      await collector.stop();
      console.log('✓ Event collector stopped');
    }

    if (server) {
      await server.stop();
      console.log('✓ Web server stopped');
    }

    if (db) {
      db.close();
      console.log('✓ Database closed');
    }

    console.log('👋 Daemon stopped successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error stopping daemon:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

// Start if called directly
if (require.main === module) {
  start();
}

export { start, stop };
