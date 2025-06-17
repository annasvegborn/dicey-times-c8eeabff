
import { supabase } from '@/integrations/supabase/client';

export const saveQuestProgress = async (questId: string, status: string, progress: number, userId: string) => {
  if (!userId) return;

  try {
    await supabase
      .from('user_quest_progress')
      .upsert({
        user_id: userId,
        quest_id: questId,
        status,
        progress,
        updated_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to save quest progress:', error);
  }
};

export const saveObjectiveProgress = async (questId: string, objectiveId: string, completed: boolean, userId: string, progress?: number) => {
  if (!userId) return;

  try {
    await supabase
      .from('user_objective_progress')
      .upsert({
        user_id: userId,
        quest_id: questId,
        objective_id: objectiveId,
        completed,
        progress: progress || 0,
        updated_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to save objective progress:', error);
  }
};

export const loadQuestProgress = async (userId: string) => {
  if (!userId) return { questProgress: null, objectiveProgress: null };

  try {
    // Fetch user's quest progress
    const { data: questProgress } = await supabase
      .from('user_quest_progress')
      .select('*')
      .eq('user_id', userId);

    // Fetch user's objective progress
    const { data: objectiveProgress } = await supabase
      .from('user_objective_progress')
      .select('*')
      .eq('user_id', userId);

    return { questProgress, objectiveProgress };
  } catch (error) {
    console.error('Failed to load quest progress:', error);
    return { questProgress: null, objectiveProgress: null };
  }
};
