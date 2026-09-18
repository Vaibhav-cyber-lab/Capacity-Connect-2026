const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  health: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  generateSyllabus: async (data: { topic: string; duration?: string; targetAudience?: string }) => {
    const res = await fetch(`${API_BASE}/ai/generate-syllabus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to generate course syllabus');
    return await res.json();
  },

  generateQuiz: async (data: { topic: string; count?: number }) => {
    const res = await fetch(`${API_BASE}/ai/generate-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to generate quiz');
    return await res.json();
  },
};
