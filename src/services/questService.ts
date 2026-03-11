
const QUEST_PROGRESS_KEY = 'dicey-times-quest-progress';
const OBJECTIVE_PROGRESS_KEY = 'dicey-times-objective-progress';

export const saveQuestProgress = async (questId: string, status: string, progress: number, userId: string) => {
  try {
    const existing = JSON.parse(localStorage.getItem(QUEST_PROGRESS_KEY) || '[]');
    const index = existing.findIndex((qp: any) => qp.quest_id === questId && qp.user_id === userId);
    const entry = { user_id: userId, quest_id: questId, status, progress, updated_at: new Date().toISOString() };
    if (index >= 0) existing[index] = entry;
    else existing.push(entry);
    localStorage.setItem(QUEST_PROGRESS_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to save quest progress:', error);
  }
};

export const saveObjectiveProgress = async (questId: string, objectiveId: string, completed: boolean, userId: string, progress?: number) => {
  try {
    const existing = JSON.parse(localStorage.getItem(OBJECTIVE_PROGRESS_KEY) || '[]');
    const index = existing.findIndex((op: any) => op.quest_id === questId && op.objective_id === objectiveId && op.user_id === userId);
    const entry = { user_id: userId, quest_id: questId, objective_id: objectiveId, completed, progress: progress || 0, updated_at: new Date().toISOString() };
    if (index >= 0) existing[index] = entry;
    else existing.push(entry);
    localStorage.setItem(OBJECTIVE_PROGRESS_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Failed to save objective progress:', error);
  }
};

export const loadQuestProgress = async (userId: string) => {
  if (!userId) return { questProgress: null, objectiveProgress: null };
  try {
    const questProgress = JSON.parse(localStorage.getItem(QUEST_PROGRESS_KEY) || '[]').filter((qp: any) => qp.user_id === userId);
    const objectiveProgress = JSON.parse(localStorage.getItem(OBJECTIVE_PROGRESS_KEY) || '[]').filter((op: any) => op.user_id === userId);
    return { questProgress, objectiveProgress };
  } catch (error) {
    console.error('Failed to load quest progress:', error);
    return { questProgress: null, objectiveProgress: null };
  }
};
