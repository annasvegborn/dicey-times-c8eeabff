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
      <div className="min-h-screen bg-[#ecd4ab] flex items-center justify-center">
        <div className="text-[#422e18] font-serif text-xl">Loading quest details...</div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-[#ecd4ab] flex items-center justify-center">
        <div className="text-[#422e18] font-serif text-xl">Quest not found</div>
      </div>
    );
  }

  if (inBattle && battleEnemy) {
    return (
      <div className="min-h-screen bg-[#ecd4ab] flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-[#ecd4ab] pb-16">
      {/* Header */}
      <div className="bg-[#422e18] text-[#ecd4ab] px-4 py-3 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/quests")}
          className="text-[#ecd4ab] hover:bg-[#997752] mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold font-serif">{quest.title}</h1>
      </div>
      
      {/* Quest content */}
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-[#ecd4ab] rounded-3xl p-6 border-4 border-[#422e18] mb-4 shadow-2xl">
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full ${quest.difficulty === 'easy' ? 'bg-green-600' : 
              quest.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'}`} />
            <span className="text-sm ml-2 text-[#997752] capitalize font-serif">{quest.difficulty || 'normal'} difficulty</span>
          </div>
          
          <h2 className="text-[#422e18] text-lg font-medium font-serif">{quest.location}</h2>
          <p className="text-[#997752] mt-2 mb-4 font-serif">{quest.description}</p>
          
          <h3 className="text-[#422e18] font-medium flex items-center gap-1 mb-3 font-serif">
            <Clock size={16} />
            <span>Objectives</span>
          </h3>
          
          <div className="space-y-4 mb-6">
            {quest.objectives.map((objective) => (
              <div 
                key={objective.id} 
                className={`border-2 ${objective.completed ? 'border-green-600 bg-green-50' : 'border-[#997752] bg-[#ecd4ab]'} 
                  rounded-2xl p-4 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${objective.completed ? 'text-green-600' : 'text-[#422e18]'}`}>
                    {objective.completed ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <div className="w-5 h-5 border-2 rounded-full border-current" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-serif ${objective.completed ? 'text-[#997752] line-through' : 'text-[#422e18]'}`}>
                      {objective.text}
                    </p>
                    
                    {objective.activityType === 'walk' && objective.target && !objective.completed && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-[#997752] mb-1 font-serif">
                          <span>{objective.progress || 0}m / {objective.target}m</span>
                          <span>{Math.round(((objective.progress || 0) / objective.target) * 100)}%</span>
                        </div>
                        <Progress 
                          value={((objective.progress || 0) / objective.target) * 100} 
                          className="h-2 bg-[#997752]"
                        />
                      </div>
                    )}
                    
                    {!objective.completed && (
                      <div className="mt-3">
                        {objective.id === "fight-1" ? (
                          <Button 
                            size="sm" 
                            className="text-xs py-1 bg-red-700 border-2 border-[#422e18] text-[#ecd4ab] hover:bg-red-800 font-serif rounded-xl"
                            onClick={() => startBattle("Bandit Leader", "🗡️")}
                          >
                            Start Battle
                          </Button>
                        ) : objective.target ? (
                          <div className="grid grid-cols-3 gap-2">
                            <Button 
                              size="sm" 
                              className="text-xs py-1 bg-[#997752] text-[#ecd4ab] border-2 border-[#422e18] hover:bg-[#422e18] font-serif rounded-xl"
                              onClick={() => trackProgress(objective.id, Math.round(objective.target! * 0.25))}
                            >
                              +25%
                            </Button>
                            <Button 
                              size="sm" 
                              className="text-xs py-1 bg-[#997752] text-[#ecd4ab] border-2 border-[#422e18] hover:bg-[#422e18] font-serif rounded-xl"
                              onClick={() => trackProgress(objective.id, Math.round(objective.target! * 0.5))}
                            >
                              +50%
                            </Button>
                            <Button 
                              size="sm" 
                              className="text-xs py-1 bg-[#997752] text-[#ecd4ab] border-2 border-[#422e18] hover:bg-[#422e18] font-serif rounded-xl"
                              onClick={() => trackProgress(objective.id, objective.target!)}
                            >
                              Complete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            className="text-xs py-1 bg-[#997752] text-[#ecd4ab] border-2 border-[#422e18] hover:bg-[#422e18] font-serif rounded-xl"
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
          
          <h3 className="text-[#422e18] font-medium flex items-center gap-1 mb-3 font-serif">
            <Trophy size={16} />
            <span>Rewards</span>
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {quest.rewards.map((reward, idx) => (
              <span 
                key={idx} 
                className="bg-[#997752] text-[#ecd4ab] px-3 py-1 rounded-full text-sm font-serif"
              >
                {reward}
              </span>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="border-2 border-[#422e18] text-[#422e18] bg-[#ecd4ab] hover:bg-[#997752] hover:text-[#ecd4ab] font-serif rounded-xl"
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
