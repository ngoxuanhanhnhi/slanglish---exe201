import api from './api';

export interface VocabItem {
  id: string;
  word: string;
  definition_en: string;
  definition_vi: string;
  pronunciation: string | null;
  example: string | null;
  category: string;
  topic_id: string | null;
  difficulty: string;
  created_at: string;
  updated_at: string;
}

export type VocabFormData = {
  word: string;
  definition_en: string;
  definition_vi: string;
  example: string;
  pronunciation: string;
  category: string;
  difficulty: string;
  topic_id?: string;
};

export interface TopicItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  wordCount: number;
  created_at: string;
  updated_at: string;
}

// ─── Vocabulary ───────────────────────────────────────────────────────────────

export const getVocabularyByCategory = async (category: string): Promise<VocabItem[]> => {
  const res = await api.get(`/vocabulary?category=${category}`);
  return res.data.data;
};

export const getCategoryCounts = async (): Promise<Record<string, number>> => {
  const res = await api.get('/vocabulary/counts');
  return res.data.data;
};

export const createVocabulary = async (data: VocabFormData): Promise<VocabItem> => {
  const res = await api.post('/vocabulary', data);
  return res.data.data;
};

export const updateVocabulary = async (id: string, data: Partial<VocabFormData>): Promise<VocabItem> => {
  const res = await api.put(`/vocabulary/${id}`, data);
  return res.data.data;
};

export const deleteVocabulary = async (id: string): Promise<void> => {
  await api.delete(`/vocabulary/${id}`);
};

export const getMyProgress = async (category: string): Promise<string[]> => {
  const res = await api.get(`/vocabulary/my-progress?category=${category}`);
  return res.data.data;
};

export const toggleComplete = async (id: string): Promise<{ completed: boolean }> => {
  const res = await api.post(`/vocabulary/${id}/toggle-complete`);
  return res.data.data;
};

// ─── Topics ───────────────────────────────────────────────────────────────────

export const getTopicsByCategory = async (category: string): Promise<TopicItem[]> => {
  const res = await api.get(`/topics?category=${category}`);
  return res.data.data;
};

export const createTopic = async (data: { name: string; description?: string; category: string }): Promise<TopicItem> => {
  const res = await api.post('/topics', data);
  return res.data.data;
};

export const updateTopic = async (id: string, data: { name?: string; description?: string }): Promise<TopicItem> => {
  const res = await api.put(`/topics/${id}`, data);
  return res.data.data;
};

export const deleteTopic = async (id: string): Promise<void> => {
  await api.delete(`/topics/${id}`);
};

export const getVocabularyByTopic = async (topicId: string): Promise<VocabItem[]> => {
  const res = await api.get(`/topics/${topicId}/vocabulary`);
  return res.data.data;
};

// ─── Grammar ──────────────────────────────────────────────────────────────────

export interface GrammarLevel {
  id: string;
  name: string;
  description: string | null;
  order: number;
  topicCount: number;
  created_at: string;
  updated_at: string;
}

export interface GrammarTopic {
  id: string;
  name: string;
  description: string | null;
  content: string | null;
  content_html: string | null;
  level_id: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface GrammarTopicDetail extends GrammarTopic {
  level: { id: string; name: string; order: number };
}

export const getGrammarLevels = async (): Promise<GrammarLevel[]> => {
  const res = await api.get('/grammar/levels');
  return res.data.data;
};

export const createGrammarLevel = async (data: { name: string; description?: string }): Promise<GrammarLevel> => {
  const res = await api.post('/grammar/levels', data);
  return res.data.data;
};

export const updateGrammarLevel = async (id: string, data: { name?: string; description?: string }): Promise<GrammarLevel> => {
  const res = await api.put(`/grammar/levels/${id}`, data);
  return res.data.data;
};

export const deleteGrammarLevel = async (id: string): Promise<void> => {
  await api.delete(`/grammar/levels/${id}`);
};

export const getGrammarTopic = async (id: string): Promise<GrammarTopicDetail> => {
  const res = await api.get(`/grammar/topics/${id}`);
  return res.data.data;
};

export const getTopicsByLevel = async (levelId: string): Promise<GrammarTopic[]> => {
  const res = await api.get(`/grammar/levels/${levelId}/topics`);
  return res.data.data;
};

export const createGrammarTopic = async (data: { name: string; description?: string; content?: string; level_id: string }): Promise<GrammarTopic> => {
  const res = await api.post('/grammar/topics', data);
  return res.data.data;
};

export const updateGrammarTopic = async (id: string, data: { name?: string; description?: string; content?: string }): Promise<GrammarTopic> => {
  const res = await api.put(`/grammar/topics/${id}`, data);
  return res.data.data;
};

export const deleteGrammarTopic = async (id: string): Promise<void> => {
  await api.delete(`/grammar/topics/${id}`);
};

export const uploadGrammarTopicFile = async (id: string, file: File): Promise<GrammarTopic> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post(`/grammar/topics/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

export const deleteGrammarTopicFile = async (id: string): Promise<GrammarTopic> => {
  const res = await api.delete(`/grammar/topics/${id}/file`);
  return res.data.data;
};
