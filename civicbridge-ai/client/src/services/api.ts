import { CivicCase, ClaimVerification, ActionTask, CommunityResource, ImpactMetrics } from '../types/index';

const BASE_URL = '/api';

export const api = {
  // Cases
  async getCases(params?: { category?: string; status?: string; search?: string }): Promise<CivicCase[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${BASE_URL}/cases?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch cases');
    const data = await res.json();
    return data.cases;
  },

  async getCaseById(id: string): Promise<CivicCase> {
    const res = await fetch(`${BASE_URL}/cases/${id}`);
    if (!res.ok) throw new Error('Case not found');
    const data = await res.json();
    return data.case;
  },

  async createCase(payload: {
    userReport: string;
    locationHint?: string;
    attachments?: Array<{
      id: string;
      name: string;
      type: 'IMAGE' | 'DOCUMENT' | 'AUDIO';
      url: string;
      size: number;
      summary?: string;
    }>;
  }): Promise<CivicCase> {
    const res = await fetch(`${BASE_URL}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze and create case');
    }
    const data = await res.json();
    return data.case;
  },

  async updateTaskStatus(
    caseId: string,
    taskId: string,
    status: string,
    proofText?: string,
    proofFileUrl?: string
  ): Promise<{ case: CivicCase; updatedTask: ActionTask }> {
    const res = await fetch(`${BASE_URL}/cases/${caseId}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, proofText, proofFileUrl }),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return await res.json();
  },

  async reverifyClaim(caseId: string, claimId: string): Promise<{ case: CivicCase; updatedClaim: ClaimVerification }> {
    const res = await fetch(`${BASE_URL}/cases/${caseId}/verify-claim/${claimId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to re-verify claim');
    return await res.json();
  },

  async recordOutcome(
    caseId: string,
    payload: { title: string; description: string; recordedBy?: string; proofUrl?: string }
  ): Promise<{ case: CivicCase }> {
    const res = await fetch(`${BASE_URL}/cases/${caseId}/outcomes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to record outcome');
    return await res.json();
  },

  async resetDemoData(): Promise<CivicCase[]> {
    const res = await fetch(`${BASE_URL}/cases/reset-demo`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo dataset');
    const data = await res.json();
    return data.cases;
  },

  // Claims
  async getAllClaims(params?: { status?: string; search?: string }): Promise<{ counts: any; claims: any[] }> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${BASE_URL}/claims?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch claims');
    return await res.json();
  },

  // Actions
  async getAllActions(params?: { priority?: string; status?: string; search?: string }): Promise<{ counts: any; actions: any[] }> {
    const query = new URLSearchParams();
    if (params?.priority) query.append('priority', params.priority);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${BASE_URL}/actions?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch actions');
    return await res.json();
  },

  // Resources
  async getResources(category?: string, search?: string): Promise<CommunityResource[]> {
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    if (search) query.append('search', search);

    const res = await fetch(`${BASE_URL}/resources?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    const data = await res.json();
    return data.resources;
  },

  // Impact
  async getImpactMetrics(): Promise<ImpactMetrics> {
    const res = await fetch(`${BASE_URL}/impact`);
    if (!res.ok) throw new Error('Failed to fetch impact metrics');
    const data = await res.json();
    return data.metrics;
  },

  // Settings
  async getSettings(): Promise<{ gemini: any; system: any }> {
    const res = await fetch(`${BASE_URL}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  },

  // Upload file
  async uploadFile(file: File): Promise<{
    id: string;
    name: string;
    type: 'IMAGE' | 'DOCUMENT' | 'AUDIO';
    url: string;
    size: number;
    uploadedAt: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Upload failed');
    }
    const data = await res.json();
    return data.file;
  },
};
