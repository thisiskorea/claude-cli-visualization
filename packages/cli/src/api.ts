/**
 * Simple API client for CLI
 */

import { loadConfig } from './config';

const config = loadConfig();
const API_BASE = `http://localhost:${config.daemonPort}/api`;

class ApiClient {
  private async fetch<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  async getSession(id: string) {
    return this.fetch(`/sessions/${id}`);
  }

  async getSessionStats(id: string) {
    return this.fetch(`/sessions/${id}/stats`);
  }

  async getMessages(sessionId: string) {
    return this.fetch(`/sessions/${sessionId}/messages`);
  }

  async getToolUses(sessionId: string) {
    return this.fetch(`/sessions/${sessionId}/tools`);
  }

  async getFileChanges(sessionId: string) {
    return this.fetch(`/sessions/${sessionId}/files`);
  }
}

export const apiClient = new ApiClient();
