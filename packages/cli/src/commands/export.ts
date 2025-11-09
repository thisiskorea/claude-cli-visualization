/**
 * Export command - exports session data
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { apiClient } from '../api';

export async function exportCommand(sessionId: string, options: {
  format?: 'html' | 'json' | 'markdown';
  output?: string;
}) {
  const format = options.format || 'html';
  const spinner = ora(`Exporting session ${sessionId} as ${format}...`).start();

  try {
    // Fetch session data
    const [session, stats, messages, toolUses, fileChanges] = await Promise.all([
      apiClient.getSession(sessionId),
      apiClient.getSessionStats(sessionId),
      apiClient.getMessages(sessionId),
      apiClient.getToolUses(sessionId),
      apiClient.getFileChanges(sessionId),
    ]);

    // Determine output path
    const outputPath = options.output || `session-${sessionId}.${format}`;

    switch (format) {
      case 'json':
        exportJson(outputPath, { session, stats, messages, toolUses, fileChanges });
        break;
      case 'html':
        exportHtml(outputPath, { session, stats, messages, toolUses, fileChanges });
        break;
      case 'markdown':
        exportMarkdown(outputPath, { session, stats, messages, toolUses, fileChanges });
        break;
    }

    spinner.succeed(`Exported to: ${outputPath}`);
  } catch (error) {
    spinner.fail('Export failed');
    console.error(chalk.red(error));
    process.exit(1);
  }
}

function exportJson(outputPath: string, data: any) {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
}

function exportHtml(outputPath: string, data: any) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude CLI Session - ${data.session.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #0ea5e9; }
    .stat { display: inline-block; margin: 10px 20px 10px 0; }
    .stat-value { font-size: 2em; font-weight: bold; color: #0c4a6e; }
    .stat-label { color: #64748b; }
    .timeline { margin-top: 30px; }
    .event { border-left: 3px solid #0ea5e9; padding: 10px 20px; margin: 10px 0; background: #f8fafc; }
    .tool { border-left-color: #10b981; }
    .file { border-left-color: #f59e0b; }
    code { background: #e2e8f0; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>Claude CLI Session</h1>
  <p><strong>ID:</strong> ${data.session.id}</p>
  <p><strong>Directory:</strong> ${data.session.workingDir}</p>
  ${data.session.gitBranch ? `<p><strong>Branch:</strong> ${data.session.gitBranch}</p>` : ''}

  <h2>Statistics</h2>
  <div class="stat">
    <div class="stat-value">${data.stats.totalMessages}</div>
    <div class="stat-label">Messages</div>
  </div>
  <div class="stat">
    <div class="stat-value">${data.stats.totalToolUses}</div>
    <div class="stat-label">Tool Uses</div>
  </div>
  <div class="stat">
    <div class="stat-value">${data.stats.totalTokensInput + data.stats.totalTokensOutput}</div>
    <div class="stat-label">Tokens</div>
  </div>
  <div class="stat">
    <div class="stat-value">$${data.stats.estimatedCost.toFixed(4)}</div>
    <div class="stat-label">Cost</div>
  </div>

  <h2>Timeline</h2>
  <div class="timeline">
    ${[...data.messages, ...data.toolUses, ...data.fileChanges]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(event => {
        if ('role' in event) {
          return `<div class="event"><strong>${event.role}:</strong> ${event.content?.substring(0, 200)}...</div>`;
        } else if ('toolName' in event) {
          return `<div class="event tool"><strong>Tool:</strong> ${event.toolName} (${event.status})</div>`;
        } else {
          return `<div class="event file"><strong>File:</strong> ${event.filePath} (${event.changeType})</div>`;
        }
      })
      .join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(outputPath, html, 'utf8');
}

function exportMarkdown(outputPath: string, data: any) {
  let md = `# Claude CLI Session

**ID:** ${data.session.id}
**Directory:** ${data.session.workingDir}
${data.session.gitBranch ? `**Branch:** ${data.session.gitBranch}\n` : ''}

## Statistics

- **Messages:** ${data.stats.totalMessages}
- **Tool Uses:** ${data.stats.totalToolUses}
- **Tokens:** ${data.stats.totalTokensInput + data.stats.totalTokensOutput}
- **Cost:** $${data.stats.estimatedCost.toFixed(4)}

## Timeline

`;

  const events = [...data.messages, ...data.toolUses, ...data.fileChanges]
    .sort((a, b) => a.timestamp - b.timestamp);

  for (const event of events) {
    if ('role' in event) {
      md += `### ${event.role}\n\n${event.content}\n\n`;
    } else if ('toolName' in event) {
      md += `### Tool: ${event.toolName}\n\nStatus: ${event.status}\n\n`;
    } else {
      md += `### File: ${event.filePath}\n\nChange: ${event.changeType}\n\n`;
    }
  }

  fs.writeFileSync(outputPath, md, 'utf8');
}
