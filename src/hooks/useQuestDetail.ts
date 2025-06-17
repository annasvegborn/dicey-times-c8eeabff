
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useQuests } from "@/contexts/QuestContext";

export const useQuestDetail = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const { getQuestById, updateQuestObjective, completeObjective } = useQuests();
  const [loading, setLoading] = useState(true);
  const [inBattle, setInBattle] = useState(false);
  const [battleEnemy, setBattleEnemy] = useState<{ name: string; image: string } | null>(null);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);

  const quest = questId ? getQuestById(questId) : null;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (!quest && questId) {
        toast({
          title: "Quest not found",
          description: "This adventure doesn't exist in our records.",
          variant: "destructive"
        });
        navigate("/quests");
      }
      setLoading(false);
    }, 500);
  }, [questId, navigate, quest]);

  const handleCompleteObjective = (objectiveId: string) => {
    if (!questId) return;
    
    completeObjective(questId, objectiveId);
    
    const updatedQuest = getQuestById(questId);
    const allCompleted = updatedQuest?.objectives.every(obj => obj.completed);
    
    if (allCompleted) {
      toast({
        title: "Quest Completed!",
        description: `You've completed "${updatedQuest?.title}"!`,
      });
    } else {
      toast({
        title: "Objective Completed",
        description: "Progress saved!",
      });
    }
  };

  const trackProgress = (objectiveId: string, newProgress: number) => {
    if (!questId) return;
    
    const objective = quest?.objectives.find(obj => obj.id === objectiveId);
    if (!objective) return;
    
    const updatedProgress = Math.min((objective.progress || 0) + newProgress, objective.target || 0);
    const completed = updatedProgress >= (objective.target || 0);
    
    updateQuestObjective(questId, objectiveId, { 
      progress: updatedProgress,
      completed: completed 
    });
    
    if (completed && !objective.completed) {
      toast({
        title: "Objective Completed!",
        description: objective.text,
      });
    }
  };

  const startBattle = (enemyName: string, enemyImage: string) => {
    setBattleEnemy({ name: enemyName, image: enemyImage });
    setInBattle(true);
  };

  const startConversation = (conversationKey: string) => {
    setCurrentConversation(conversationKey);
  };

  const handleBattleVictory = () => {
    setInBattle(false);
    setBattleEnemy(null);
    
    const fightObjective = quest?.objectives.find(obj => obj.id === "fight-1" || obj.id === "confront-presence");
    if (fightObjective && questId) {
      handleCompleteObjective(fightObjective.id);
      toast({
        title: "Victory!",
        description: "You defeated the enemy!",
      });
    }
  };

  const handleBattleDefeat = () => {
    setInBattle(false);
    setBattleEnemy(null);
    toast({
      title: "Defeat",
      description: "You were defeated. Try again when you're stronger!",
      variant: "destructive"
    });
  };

  return {
    quest,
    questId,
    loading,
    inBattle,
    battleEnemy,
    currentConversation,
    navigate,
    handleCompleteObjective,
    trackProgress,
    startBattle,
    startConversation,
    handleBattleVictory,
    handleBattleDefeat,
    setCurrentConversation
  };
};
