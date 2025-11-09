/**
 * Main App component
 */

import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { SessionList } from './components/SessionList';
import { Timeline } from './components/Timeline';
import { ToolStats } from './components/ToolStats';
import { FileTree } from './components/FileTree';
import { useSession } from './hooks/useSession';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🎨 Claude CLI Visualizer
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<SessionList />} />
            <Route path="/session/:id" element={<SessionDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const { session, stats, messages, toolUses, fileChanges, loading, error } = useSession(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading session...</div>
      </div>
    );
  }

  if (error || !session || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Error loading session: {error?.message || 'Session not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Session header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {session.gitRepo ? (
              <span>{session.gitRepo.split('/').pop()?.replace('.git', '')}</span>
            ) : (
              <span>{session.workingDir.split('/').pop() || 'Session'}</span>
            )}
          </h2>
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              session.status === 'active'
                ? 'bg-green-100 text-green-800'
                : session.status === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {session.status}
          </span>
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <div>📁 {session.workingDir}</div>
          {session.gitBranch && <div>🌿 {session.gitBranch}</div>}
          {session.gitRepo && (
            <div className="font-mono text-xs">{session.gitRepo}</div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <ToolStats stats={stats} />

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <Timeline
          messages={messages}
          toolUses={toolUses}
          fileChanges={fileChanges}
        />
      </div>

      {/* File tree */}
      <FileTree fileChanges={fileChanges} />
    </div>
  );
}

export default App;
