
import { useState, useEffect } from 'react';
import { Quest, QuestObjective } from '@/types/quest';
import { initialQuests } from '@/data/initialQuests';
import { loadQuestProgress, saveQuestProgress, saveObjectiveProgress } from '@/services/questService';

export const useQuestData = (userId: string | undefined) => {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [loading, setLoading] = useState(true);

  // Load quest progress from database when user is authenticated
  useEffect(() => {
    if (userId) {
      loadUserQuestProgress();
    } else {
      // Reset to initial quests when no user is logged in
      setQuests(initialQuests);
      setLoading(false);
    }
  }, [userId]);

  const loadUserQuestProgress = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      const { questProgress, objectiveProgress } = await loadQuestProgress(userId);

      // Merge saved progress with initial quests
      const updatedQuests = initialQuests.map(initialQuest => {
        const savedQuestProgress = questProgress?.find(qp => qp.quest_id === initialQuest.id);
        
        if (savedQuestProgress) {
          // Update quest status and progress
          const updatedObjectives = initialQuest.objectives.map(objective => {
            const savedObjective = objectiveProgress?.find(
              op => op.quest_id === initialQuest.id && op.objective_id === objective.id
            );
            
            if (savedObjective) {
              return {
                ...objective,
                completed: savedObjective.completed,
                progress: savedObjective.progress || objective.progress
              };
            }
            return objective;
          });

          return {
            ...initialQuest,
            status: savedQuestProgress.status as "available" | "active" | "completed",
            progress: savedQuestProgress.progress,
            objectives: updatedObjectives
          };
        }
        
        return initialQuest;
      });

      setQuests(updatedQuests);
    } catch (error) {
      console.error('Failed to load quest progress:', error);
      setQuests(initialQuests);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestObjective = (questId: string, objectiveId: string, updates: Partial<QuestObjective>) => {
    setQuests(prevQuests => 
      prevQuests.map(quest => {
        if (quest.id === questId) {
          const updatedObjectives = quest.objectives.map(obj => 
            obj.id === objectiveId ? { ...obj, ...updates } : obj
          );
          
          const completedObjectives = updatedObjectives.filter(obj => obj.completed).length;
          const newStatus: "available" | "active" | "completed" = completedObjectives === 0 ? "available" : 
                           completedObjectives === updatedObjectives.length ? "completed" : "active";
          
          const updatedQuest = {
            ...quest,
            objectives: updatedObjectives,
            progress: completedObjectives,
            status: newStatus
          };

          // Save to database
          if (userId) {
            saveQuestProgress(questId, newStatus, completedObjectives, userId);
            saveObjectiveProgress(questId, objectiveId, updates.completed || false, userId, updates.progress);
          }
          
          return updatedQuest;
        }
        return quest;
      })
    );
  };

  const completeObjective = (questId: string, objectiveId: string) => {
    updateQuestObjective(questId, objectiveId, { completed: true });
  };

  const getQuestById = (questId: string) => {
    return quests.find(quest => quest.id === questId);
  };

  return {
    quests,
    loading,
    updateQuestObjective,
    completeObjective,
    getQuestById
  };
};
