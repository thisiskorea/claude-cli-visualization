#!/usr/bin/env node

/**
 * MCP Server for Claude CLI Visualization
 *
 * This MCP server provides tools and resources for visualizing
 * Claude CLI sessions directly from within Claude conversations.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  CallToolResult,
  TextContent,
} from '@modelcontextprotocol/sdk/types.js';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const DATA_DIR = path.join(os.homedir(), '.claude-viz');

/**
 * Create MCP server instance
 */
const server = new Server(
  {
    name: 'claude-viz',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'claude_viz_start',
        description: 'Start the Claude CLI visualization daemon',
        inputSchema: {
          type: 'object',
          properties: {
            port: {
              type: 'number',
              description: 'Port for the web server (default: 3456)',
            },
          },
        },
      },
      {
        name: 'claude_viz_stop',
        description: 'Stop the visualization daemon',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'claude_viz_status',
        description: 'Check daemon status and get statistics',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'claude_viz_get_sessions',
        description: 'Get list of all recorded sessions',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Maximum number of sessions to return',
            },
          },
        },
      },
      {
        name: 'claude_viz_export_session',
        description: 'Export a session to HTML, JSON, or Markdown',
        inputSchema: {
          type: 'object',
          properties: {
            sessionId: {
              type: 'string',
              description: 'Session ID to export',
            },
            format: {
              type: 'string',
              enum: ['html', 'json', 'markdown'],
              description: 'Export format',
            },
            outputPath: {
              type: 'string',
              description: 'Output file path',
            },
          },
          required: ['sessionId'],
        },
      },
      {
        name: 'claude_viz_view',
        description: 'Get the URL to view sessions in browser',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'claude_viz_start': {
      const port = (args as any).port || 3456;
      return await startDaemon(port);
    }

    case 'claude_viz_stop': {
      return await stopDaemon();
    }

    case 'claude_viz_status': {
      return await getStatus();
    }

    case 'claude_viz_get_sessions': {
      const limit = (args as any).limit || 10;
      return await getSessions(limit);
    }

    case 'claude_viz_export_session': {
      const { sessionId, format, outputPath } = args as any;
      return await exportSession(sessionId, format, outputPath);
    }

    case 'claude_viz_view': {
      return await getViewUrl();
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

/**
 * List available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'claude-viz://sessions',
        name: 'Recent Sessions',
        description: 'List of recent Claude CLI sessions',
        mimeType: 'application/json',
      },
      {
        uri: 'claude-viz://config',
        name: 'Configuration',
        description: 'Current visualization configuration',
        mimeType: 'application/json',
      },
    ],
  };
});

/**
 * Read resource content
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'claude-viz://sessions') {
    const sessions = await getSessions(10);
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(sessions, null, 2),
        },
      ],
    };
  }

  if (uri === 'claude-viz://config') {
    const configPath = path.join(DATA_DIR, 'config.json');
    try {
      const config = await fs.readFile(configPath, 'utf8');
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: config,
          },
        ],
      };
    } catch {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({ error: 'Config not found' }, null, 2),
          },
        ],
      };
    }
  }

  throw new Error(`Unknown resource: ${uri}`);
});

/**
 * Tool implementations
 */

async function startDaemon(port: number): Promise<CallToolResult> {
  return new Promise((resolve) => {
    const child = spawn('claude-viz', ['start'], {
      detached: true,
      stdio: 'ignore',
      env: { ...process.env, CLAUDE_VIZ_PORT: port.toString() },
    });

    child.unref();

    setTimeout(() => {
      resolve({
        content: [
          {
            type: 'text',
            text: `✅ Daemon started on port ${port}\n🌐 View at: http://localhost:${port}`,
          },
        ],
      });
    }, 1000);
  });
}

async function stopDaemon(): Promise<CallToolResult> {
  return new Promise((resolve) => {
    const child = spawn('claude-viz', ['stop'], {
      stdio: 'pipe',
    });

    let output = '';
    child.stdout?.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', () => {
      resolve({
        content: [
          {
            type: 'text',
            text: output || '✅ Daemon stopped',
          },
        ],
      });
    });
  });
}

async function getStatus(): Promise<CallToolResult> {
  return new Promise((resolve) => {
    const child = spawn('claude-viz', ['status'], {
      stdio: 'pipe',
    });

    let output = '';
    child.stdout?.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', () => {
      resolve({
        content: [
          {
            type: 'text',
            text: output || 'Unable to get status',
          },
        ],
      });
    });
  });
}

async function getSessions(limit: number): Promise<CallToolResult> {
  // This would call the daemon API
  // For now, return mock data
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            sessions: [],
            message: 'Connect to daemon API to get actual sessions',
          },
          null,
          2
        ),
      },
    ],
  };
}

async function exportSession(sessionId: string, format?: string, outputPath?: string): Promise<CallToolResult> {
  return new Promise((resolve) => {
    const args = ['export', sessionId];
    if (format) args.push('-f', format);
    if (outputPath) args.push('-o', outputPath);

    const child = spawn('claude-viz', args, {
      stdio: 'pipe',
    });

    let output = '';
    child.stdout?.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', () => {
      resolve({
        content: [
          {
            type: 'text',
            text: output || `✅ Exported session ${sessionId}`,
          },
        ],
      });
    });
  });
}

async function getViewUrl(): Promise<CallToolResult> {
  return {
    content: [
      {
        type: 'text',
        text: '🌐 View your sessions at: http://localhost:3456',
      },
    ],
  };
}

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Claude Visualization MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
