
import { Button } from "@/components/ui/button";
import { Trophy, Clock } from "lucide-react";
import InteractiveBattleScene from "@/components/combat/InteractiveBattleScene";
import QuestHeader from "@/components/quest/QuestHeader";
import ConversationView from "@/components/quest/ConversationView";
import QuestObjectiveItem from "@/components/quest/QuestObjectiveItem";
import { useQuestDetail } from "@/hooks/useQuestDetail";

const QuestDetail = () => {
  const {
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
  } = useQuestDetail();

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
      <ConversationView
        conversation={quest.conversations[currentConversation]}
        onBack={() => setCurrentConversation(null)}
        onComplete={() => {
          handleCompleteObjective(currentConversation);
          setCurrentConversation(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <QuestHeader 
        title={quest.title} 
        onBack={() => navigate("/quests")} 
      />
      
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
              <QuestObjectiveItem
                key={objective.id}
                objective={objective}
                onComplete={handleCompleteObjective}
                onTrackProgress={trackProgress}
                onStartConversation={startConversation}
                onStartBattle={startBattle}
              />
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
