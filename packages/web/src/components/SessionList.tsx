/**
 * Session list component
 */

import { useSessions } from '../hooks/useSession';
import { formatTimestamp, formatDuration } from '@claude-viz/shared';
import { Link } from 'react-router-dom';

export function SessionList() {
  const { sessions, loading, error } = useSessions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading sessions: {error.message}</div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">No sessions found</p>
          <p className="text-gray-400 text-sm">
            Start using Claude CLI to see sessions here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Sessions</h2>
      <div className="grid gap-4">
        {sessions.map((session) => {
          const duration = session.endTime
            ? session.endTime - session.startTime
            : Date.now() - session.startTime;

          return (
            <Link
              key={session.id}
              to={`/session/${session.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {session.gitRepo ? (
                        <span>{session.gitRepo.split('/').pop()?.replace('.git', '')}</span>
                      ) : (
                        <span>{session.workingDir.split('/').pop() || 'Session'}</span>
                      )}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
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
                    {session.gitBranch && (
                      <div>🌿 {session.gitBranch}</div>
                    )}
                    <div>🕐 Started {formatTimestamp(session.startTime)}</div>
                    <div>⏱️ Duration: {formatDuration(duration)}</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
