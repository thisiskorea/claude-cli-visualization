/**
 * File changes tree component
 */

import { useMemo } from 'react';
import type { FileChange } from '@claude-viz/shared';

interface FileTreeProps {
  fileChanges: FileChange[];
}

type TreeNode = {
  name: string;
  path: string;
  children: Map<string, TreeNode>;
  changes: FileChange[];
};

export function FileTree({ fileChanges }: FileTreeProps) {
  const tree = useMemo(() => buildTree(fileChanges), [fileChanges]);

  if (fileChanges.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No file changes in this session
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">File Changes</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <TreeNodeComponent node={tree} level={0} />
      </div>
    </div>
  );
}

function buildTree(fileChanges: FileChange[]): TreeNode {
  const root: TreeNode = {
    name: '',
    path: '',
    children: new Map(),
    changes: [],
  };

  for (const change of fileChanges) {
    const parts = change.filePath.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          path: parts.slice(0, i + 1).join('/'),
          children: new Map(),
          changes: [],
        });
      }
      current = current.children.get(part)!;
    }

    current.changes.push(change);
  }

  return root;
}

interface TreeNodeComponentProps {
  node: TreeNode;
  level: number;
}

function TreeNodeComponent({ node, level }: TreeNodeComponentProps) {
  const hasChildren = node.children.size > 0;
  const isFile = node.changes.length > 0;

  const getChangeIcon = () => {
    if (!isFile) return '📁';
    const changeType = node.changes[0].changeType;
    switch (changeType) {
      case 'created':
        return '📄';
      case 'modified':
        return '✏️';
      case 'deleted':
        return '🗑️';
      case 'renamed':
        return '📝';
      default:
        return '📄';
    }
  };

  const getChangeSummary = () => {
    if (!isFile) return null;
    const totalAdded = node.changes.reduce((sum, c) => sum + (c.linesAdded || 0), 0);
    const totalRemoved = node.changes.reduce((sum, c) => sum + (c.linesRemoved || 0), 0);

    return (
      <span className="text-xs text-gray-500 ml-2">
        {totalAdded > 0 && <span className="text-green-600">+{totalAdded}</span>}
        {totalAdded > 0 && totalRemoved > 0 && ' / '}
        {totalRemoved > 0 && <span className="text-red-600">-{totalRemoved}</span>}
      </span>
    );
  };

  return (
    <div>
      {node.name && (
        <div
          className="flex items-center py-1 hover:bg-gray-50 rounded px-2"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          <span className="mr-2">{getChangeIcon()}</span>
          <span className={isFile ? 'font-mono text-sm' : 'font-medium'}>
            {node.name}
          </span>
          {getChangeSummary()}
          {node.changes.length > 1 && (
            <span className="text-xs text-gray-400 ml-2">
              ({node.changes.length} changes)
            </span>
          )}
        </div>
      )}
      {hasChildren && (
        <div>
          {Array.from(node.children.values())
            .sort((a, b) => {
              // Directories first, then files
              const aIsDir = a.children.size > 0;
              const bIsDir = b.children.size > 0;
              if (aIsDir && !bIsDir) return -1;
              if (!aIsDir && bIsDir) return 1;
              return a.name.localeCompare(b.name);
            })
            .map((child) => (
              <TreeNodeComponent
                key={child.path}
                node={child}
                level={level + 1}
              />
            ))}
        </div>
      )}
    </div>
  );
}
