import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Trophy, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import InteractiveBattleScene from "@/components/combat/InteractiveBattleScene";

// Types for our quest data
interface QuestObjective {
  id: string;
  text: string;
  completed: boolean;
  activityType: "walk" | "strength" | "cardio" | "stretch" | "other";
  target?: number;
  progress?: number;
}

interface Quest {
  id: string;
  title: string;
  location: string;
  description: string;
  objectives: QuestObjective[];
  rewards: string[];
  background?: string;
  difficulty?: "easy" | "medium" | "hard";
}

// Mock data repository - in a real app this would come from a database
const questRepository: Record<string, Quest> = {
  "village-siege": {
    id: "village-siege",
    title: "Village Under Siege",
    location: "Oakvale Village",
    description: "Defend the village from an attack by mysterious bandits who appeared from the western mountains. The village elder has called upon you for help.",
    background: "bg-amber-900",
    difficulty: "medium",
    objectives: [
      { id: "train-1", text: "Complete a strength training workout", completed: true, activityType: "strength" },
      { id: "walk-1", text: "Walk 1km to patrol the village", completed: false, activityType: "walk", target: 1000, progress: 0 },
      { id: "fight-1", text: "Defeat the bandit leader (complete workout)", completed: false, activityType: "strength" }
    ],
    rewards: ["Silver Sword", "50 XP", "Village Hero title"]
  },
  "forest-disturbance": {
    id: "forest-disturbance",
    title: "Strange Disturbance",
    location: "Whisperwind Forest",
    description: "Something is causing animals to flee from the forest. The local druids are concerned about an unknown dark presence.",
    background: "bg-green-900",
    difficulty: "easy",
    objectives: [
      { id: "walk-2", text: "Walk 2km to search the forest", completed: false, activityType: "walk", target: 2000, progress: 0 },
      { id: "find-1", text: "Find evidence of disturbance (10 min cardio)", completed: false, activityType: "cardio" },
      { id: "report-1", text: "Return to the village elder (stretch session)", completed: false, activityType: "stretch" }
    ],
    rewards: ["Forest Map", "40 XP", "Nature's Friend trait"]
  },
};

const QuestDetail = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [inBattle, setInBattle] = useState(false);
  const [battleEnemy, setBattleEnemy] = useState<{ name: string; image: string } | null>(null);

  useEffect(() => {
    // Simulate loading data from an API
    setLoading(true);
    setTimeout(() => {
      if (questId && questRepository[questId]) {
        setQuest(questRepository[questId]);
      } else {
        toast({
          title: "Quest not found",
          description: "This adventure doesn't exist in our records.",
          variant: "destructive"
        });
        navigate("/quests");
      }
      setLoading(false);
    }, 500);
  }, [questId, navigate]);

  const completeObjective = (objectiveId: string) => {
    if (!quest) return;
    
    setQuest(prev => {
      if (!prev) return prev;
      
      const updatedObjectives = prev.objectives.map(obj => 
        obj.id === objectiveId ? { ...obj, completed: true } : obj
      );
      
      // Check if all objectives are completed
      const allCompleted = updatedObjectives.every(obj => obj.completed);
      
      if (allCompleted) {
        toast({
          title: "Quest Completed!",
          description: `You've completed "${prev.title}"!`,
        });
      } else {
        toast({
          title: "Objective Completed",
          description: "Progress saved!",
        });
      }
      
      return { ...prev, objectives: updatedObjectives };
    });
  };

  const trackProgress = (objectiveId: string, newProgress: number) => {
    if (!quest) return;
    
    setQuest(prev => {
      if (!prev) return prev;
      
      const updatedObjectives = prev.objectives.map(obj => {
        if (obj.id === objectiveId) {
          const updatedProgress = Math.min((obj.progress || 0) + newProgress, obj.target || 0);
          const completed = updatedProgress >= (obj.target || 0);
          
          if (completed && !obj.completed) {
            toast({
              title: "Objective Completed!",
              description: obj.text,
            });
          }
          
          return { 
            ...obj, 
            progress: updatedProgress,
            completed: completed 
          };
        }
        return obj;
      });
      
      return { ...prev, objectives: updatedObjectives };
    });
  };

  const startBattle = (enemyName: string, enemyImage: string) => {
    setBattleEnemy({ name: enemyName, image: enemyImage });
    setInBattle(true);
  };

  const handleBattleVictory = () => {
    setInBattle(false);
    setBattleEnemy(null);
    
    // Find and complete the fight objective
    const fightObjective = quest?.objectives.find(obj => obj.id === "fight-1");
    if (fightObjective) {
      completeObjective("fight-1");
      toast({
        title: "Victory!",
        description: "You defeated the bandit leader!",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
        <div className="text-white">Loading quest details...</div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
        <div className="text-white">Quest not found</div>
      </div>
    );
  }

  if (inBattle && battleEnemy) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
        <InteractiveBattleScene
          enemyName={battleEnemy.name}
          enemyImage={battleEnemy.image}
          onVictory={handleBattleVictory}
          onDefeat={handleBattleDefeat}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 pb-16">
      {/* Header */}
      <div className={`${quest.background || 'bg-amber-800'} text-amber-50 px-4 py-3 flex items-center`}>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/quests")}
          className="text-amber-50 hover:bg-amber-700 mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold font-serif">{quest.title}</h1>
      </div>
      
      {/* Quest content */}
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-stone-100 rounded-lg p-6 border-2 border-amber-700 mb-4">
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full ${quest.difficulty === 'easy' ? 'bg-green-500' : 
              quest.difficulty === 'medium' ? 'bg-amber-500' : 'bg-red-500'}`} />
            <span className="text-sm ml-2 text-gray-500 capitalize">{quest.difficulty || 'normal'} difficulty</span>
          </div>
          
          <h2 className="text-amber-800 text-lg font-medium">{quest.location}</h2>
          <p className="text-gray-700 mt-2 mb-4">{quest.description}</p>
          
          <h3 className="text-amber-800 font-medium flex items-center gap-1 mb-3">
            <Clock size={16} />
            <span>Objectives</span>
          </h3>
          
          <div className="space-y-4 mb-6">
            {quest.objectives.map((objective) => (
              <div 
                key={objective.id} 
                className={`border ${objective.completed ? 'border-green-200 bg-green-50' : 'border-stone-200 bg-stone-50'} 
                  rounded-lg p-4 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${objective.completed ? 'text-green-600' : 'text-amber-600'}`}>
                    {objective.completed ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <div className="w-5 h-5 border-2 rounded-full border-current" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`${objective.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {objective.text}
                    </p>
                    
                    {objective.activityType === 'walk' && objective.target && !objective.completed && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{objective.progress || 0}m / {objective.target}m</span>
                          <span>{Math.round(((objective.progress || 0) / objective.target) * 100)}%</span>
                        </div>
                        <Progress 
                          value={((objective.progress || 0) / objective.target) * 100} 
                          className="h-2 bg-stone-200"
                        />
                      </div>
                    )}
                    
                    {!objective.completed && (
                      <div className="mt-3">
                        {objective.id === "fight-1" ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs py-1 bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
                            onClick={() => startBattle("Bandit Leader", "🗡️")}
                          >
                            Start Battle
                          </Button>
                        ) : objective.target ? (
                          <div className="grid grid-cols-3 gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs py-1"
                              onClick={() => trackProgress(objective.id, Math.round(objective.target! * 0.25))}
                            >
                              +25%
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs py-1"
                              onClick={() => trackProgress(objective.id, Math.round(objective.target! * 0.5))}
                            >
                              +50%
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs py-1"
                              onClick={() => trackProgress(objective.id, objective.target!)}
                            >
                              Complete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs py-1"
                            onClick={() => completeObjective(objective.id)}
                          >
                            Mark as Complete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <h3 className="text-amber-800 font-medium flex items-center gap-1 mb-3">
            <Trophy size={16} />
            <span>Rewards</span>
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {quest.rewards.map((reward, idx) => (
              <span 
                key={idx} 
                className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
              >
                {reward}
              </span>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              variant="outline"
              className="border-amber-600 text-amber-700"
              onClick={() => navigate("/world-map")}
            >
              View on Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestDetail;
