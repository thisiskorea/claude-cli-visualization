/**
 * React hooks for session data
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { Session, Message, ToolUse, FileChange, SessionStats } from '@claude-viz/shared';

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await apiClient.getSessions();
        if (mounted) {
          setSessions(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  return { sessions, loading, error };
}

export function useSession(sessionId: string | undefined) {
  const [session, setSession] = useState<Session | null>(null);
  const [stats, setStats] = useState<(SessionStats & { estimatedCost: number }) | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [toolUses, setToolUses] = useState<ToolUse[]>([]);
  const [fileChanges, setFileChanges] = useState<FileChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function load() {
      if (!sessionId) return;

      try {
        const [sessionData, statsData, messagesData, toolsData, filesData] = await Promise.all([
          apiClient.getSession(sessionId),
          apiClient.getSessionStats(sessionId),
          apiClient.getMessages(sessionId),
          apiClient.getToolUses(sessionId),
          apiClient.getFileChanges(sessionId),
        ]);

        if (mounted) {
          setSession(sessionData);
          setStats(statsData);
          setMessages(messagesData);
          setToolUses(toolsData);
          setFileChanges(filesData);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    }

    load();
    return () => { mounted = false; };
  }, [sessionId]);

  return { session, stats, messages, toolUses, fileChanges, loading, error };
}
