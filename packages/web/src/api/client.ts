/**
 * API client for communicating with daemon
 */

import type { Session, Message, ToolUse, FileChange, SessionStats } from '@claude-viz/shared';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  // Sessions
  async getSessions(): Promise<Session[]> {
    return this.fetch<Session[]>('/sessions');
  }

  async getSession(id: string): Promise<Session> {
    return this.fetch<Session>(`/sessions/${id}`);
  }

  async getActiveSessions(): Promise<Session[]> {
    return this.fetch<Session[]>('/sessions/active/list');
  }

  async getSessionStats(id: string): Promise<SessionStats & { estimatedCost: number }> {
    return this.fetch(`/sessions/${id}/stats`);
  }

  // Messages
  async getMessages(sessionId: string): Promise<Message[]> {
    return this.fetch<Message[]>(`/sessions/${sessionId}/messages`);
  }

  // Tool uses
  async getToolUses(sessionId: string): Promise<ToolUse[]> {
    return this.fetch<ToolUse[]>(`/sessions/${sessionId}/tools`);
  }

  // File changes
  async getFileChanges(sessionId: string): Promise<FileChange[]> {
    return this.fetch<FileChange[]>(`/sessions/${sessionId}/files`);
  }
}

export const apiClient = new ApiClient();
