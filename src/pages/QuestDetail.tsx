
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Trophy, Clock, MessageCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import InteractiveBattleScene from "@/components/combat/InteractiveBattleScene";
import { useQuests } from "@/contexts/QuestContext";

const QuestDetail = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const { getQuestById, updateQuestObjective, completeObjective } = useQuests();
  const [loading, setLoading] = useState(true);
  const [inBattle, setInBattle] = useState(false);
  const [battleEnemy, setBattleEnemy] = useState<{ name: string; image: string } | null>(null);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);

  const quest = questId ? getQuestById(questId) : null;

  useEffect(() => {
    // Simulate loading data
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
    
    // Find and complete the fight objective
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-700 font-serif text-xl">Loading quest details...</div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-700 font-serif text-xl">Quest not found</div>
      </div>
    );
  }

  if (inBattle && battleEnemy) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <InteractiveBattleScene
          enemyName={battleEnemy.name}
          enemyImage={battleEnemy.image}
          onVictory={handleBattleVictory}
          onDefeat={handleBattleDefeat}
        />
      </div>
    );
  }

  if (currentConversation && quest.conversations?.[currentConversation]) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-3 flex items-center shadow-lg">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCurrentConversation(null)}
            className="text-white hover:bg-slate-500 mr-2 rounded-xl"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold font-serif">Conversation</h1>
        </div>
        
        <div className="p-4 max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <div className="space-y-4">
              {quest.conversations[currentConversation].map((line, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-2xl ${
                    line.startsWith('You:') 
                      ? 'bg-blue-100 text-blue-800 ml-4' 
                      : 'bg-slate-100 text-slate-800 mr-4'
                  }`}
                >
                  <p className="font-serif text-sm">{line}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                onClick={() => setCurrentConversation(null)}
                variant="outline"
                className="font-serif rounded-xl"
              >
                Back
              </Button>
              <Button 
                onClick={() => {
                  handleCompleteObjective(currentConversation);
                  setCurrentConversation(null);
                }}
                className="bg-slate-600 hover:bg-slate-700 text-white font-serif rounded-xl"
              >
                Complete
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-3 flex items-center shadow-lg">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/quests")}
          className="text-white hover:bg-slate-500 mr-2 rounded-xl"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold font-serif">{quest.title}</h1>
      </div>
      
      {/* Quest content */}
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-4">
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full ${quest.difficulty === 'easy' ? 'bg-green-600' : 
              quest.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'}`} />
            <span className="text-sm ml-2 text-slate-600 capitalize font-serif">{quest.difficulty || 'normal'} difficulty</span>
          </div>
          
          <h2 className="text-slate-800 text-lg font-medium font-serif">{quest.location}</h2>
          <p className="text-slate-600 mt-2 mb-4 font-serif">{quest.description}</p>
          
          <h3 className="text-slate-800 font-medium flex items-center gap-1 mb-3 font-serif">
            <Clock size={16} />
            <span>Objectives</span>
          </h3>
          
          <div className="space-y-4 mb-6">
            {quest.objectives.map((objective) => (
              <div 
                key={objective.id} 
                className={`border-2 ${objective.completed ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-white'} 
                  rounded-2xl p-4 transition-colors shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${objective.completed ? 'text-green-600' : 'text-slate-700'}`}>
                    {objective.completed ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <div className="w-5 h-5 border-2 rounded-full border-current" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-serif ${objective.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {objective.text}
                    </p>
                    
                    {objective.activityType === 'walk' && objective.target && !objective.completed && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-slate-600 mb-1 font-serif">
                          <span>{objective.progress || 0}m / {objective.target}m</span>
                          <span>{Math.round(((objective.progress || 0) / objective.target) * 100)}%</span>
                        </div>
                        <Progress 
                          value={((objective.progress || 0) / objective.target) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    {!objective.completed && (
                      <div className="mt-3">
                        {objective.activityType === 'conversation' ? (
                          <Button 
                            size="sm" 
                            className="text-xs py-1 bg-blue-600 hover:bg-blue-700 text-white font-serif rounded-xl shadow-sm flex items-center gap-1"
                            onClick={() => startConversation(objective.id)}
                          >
                            <MessageCircle size={12} />
                            Start Conversation
                          </Button>
                        ) : objective.id === "fight-1" || objective.id === "confront-presence" ? (
                          <Button 
                            size="sm" 
                            className="text-xs py-1 bg-red-600 hover:bg-red-700 text-white font-serif rounded-xl shadow-sm"
                            onClick={() => startBattle(
                              objective.id === "fight-1" ? "Bandit Leader" : "Dark Presence", 
                              objective.id === "fight-1" ? "⚔️" : "👻"
                            )}
                          >
                            Start Battle
                          </Button>
                        ) : objective.target ? (
                          <div className="grid grid-cols-3 gap-2">
                            <Button 
                              size="sm" 
                              className="text-xs py-1 bg-slate-600 hover:bg-slate-700 text-white font-serif rounded-xl shadow-sm"
                              onClick={() => trackProgress(objective.id, Math.round(objective.target! * 0.25))}
                            >
                              +25%
                            </Button>
                            <Button 
                              size="sm" 
                              className="text-xs py-1 bg-slate-600 hover:bg-slate-700 text-white font-serif rounded-xl shadow-sm"
                              onClick={() => trackProgress(objective.id, Math.round(objective.target! * 0.5))}
                            >
                              +50%
                            </Button>
                            <Button 
                              size="sm" 
                              className="text-xs py-1 bg-slate-600 hover:bg-slate-700 text-white font-serif rounded-xl shadow-sm"
                              onClick={() => trackProgress(objective.id, objective.target!)}
                            >
                              Complete
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            className="text-xs py-1 bg-slate-600 hover:bg-slate-700 text-white font-serif rounded-xl shadow-sm"
                            onClick={() => handleCompleteObjective(objective.id)}
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
          
          <h3 className="text-slate-800 font-medium flex items-center gap-1 mb-3 font-serif">
            <Trophy size={16} />
            <span>Rewards</span>
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {quest.rewards.map((reward, idx) => (
              <span 
                key={idx} 
                className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm font-serif shadow-sm"
              >
                {reward}
              </span>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="bg-slate-600 hover:bg-slate-700 text-white font-serif rounded-xl shadow-sm"
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
