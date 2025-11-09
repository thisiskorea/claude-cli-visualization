/**
 * Timeline component - shows chronological events
 */

import { useMemo } from 'react';
import type { Message, ToolUse, FileChange } from '@claude-viz/shared';
import { formatTimestamp } from '@claude-viz/shared';

interface TimelineProps {
  messages: Message[];
  toolUses: ToolUse[];
  fileChanges: FileChange[];
}

type TimelineEvent = {
  type: 'message' | 'tool' | 'file';
  timestamp: number;
  data: Message | ToolUse | FileChange;
};

export function Timeline({ messages, toolUses, fileChanges }: TimelineProps) {
  const events = useMemo(() => {
    const all: TimelineEvent[] = [
      ...messages.map(m => ({ type: 'message' as const, timestamp: m.timestamp, data: m })),
      ...toolUses.map(t => ({ type: 'tool' as const, timestamp: t.timestamp, data: t })),
      ...fileChanges.map(f => ({ type: 'file' as const, timestamp: f.timestamp, data: f })),
    ];

    return all.sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, toolUses, fileChanges]);

  if (events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No events in this session yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Timeline</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Events */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <TimelineItem key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ event }: { event: TimelineEvent }) {
  const getIcon = () => {
    switch (event.type) {
      case 'message':
        return (event.data as Message).role === 'user' ? '👤' : '🤖';
      case 'tool':
        return '🛠️';
      case 'file':
        return '📄';
    }
  };

  const getColor = () => {
    switch (event.type) {
      case 'message':
        return (event.data as Message).role === 'user'
          ? 'bg-blue-100 border-blue-300'
          : 'bg-purple-100 border-purple-300';
      case 'tool':
        return 'bg-green-100 border-green-300';
      case 'file':
        return 'bg-yellow-100 border-yellow-300';
    }
  };

  const renderContent = () => {
    if (event.type === 'message') {
      const msg = event.data as Message;
      return (
        <div>
          <div className="font-medium capitalize">{msg.role}</div>
          <div className="text-sm text-gray-600 mt-1 line-clamp-3">
            {msg.content}
          </div>
          {msg.tokensInput && (
            <div className="text-xs text-gray-500 mt-2">
              Tokens: {msg.tokensInput} in / {msg.tokensOutput} out
            </div>
          )}
        </div>
      );
    }

    if (event.type === 'tool') {
      const tool = event.data as ToolUse;
      return (
        <div>
          <div className="font-medium">{tool.toolName}</div>
          <div className="text-sm text-gray-600 mt-1">
            Status: <span className={tool.status === 'success' ? 'text-green-600' : 'text-red-600'}>
              {tool.status}
            </span>
          </div>
          {tool.durationMs && (
            <div className="text-xs text-gray-500 mt-1">
              Duration: {tool.durationMs}ms
            </div>
          )}
        </div>
      );
    }

    if (event.type === 'file') {
      const file = event.data as FileChange;
      return (
        <div>
          <div className="font-medium">{file.changeType}</div>
          <div className="text-sm text-gray-600 mt-1 font-mono">
            {file.filePath}
          </div>
          {(file.linesAdded || file.linesRemoved) ? (
            <div className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+{file.linesAdded}</span>
              {' / '}
              <span className="text-red-600">-{file.linesRemoved}</span>
            </div>
          ) : null}
        </div>
      );
    }
  };

  return (
    <div className="relative pl-12">
      {/* Icon */}
      <div className="absolute left-2 top-2 w-6 h-6 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center text-sm">
        {getIcon()}
      </div>

      {/* Card */}
      <div className={`border-2 rounded-lg p-4 ${getColor()}`}>
        <div className="text-xs text-gray-500 mb-2">
          {formatTimestamp(event.timestamp)}
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
