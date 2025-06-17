
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { QuestObjective } from "@/types/quest";

interface QuestObjectiveItemProps {
  objective: QuestObjective;
  onComplete: (objectiveId: string) => void;
  onTrackProgress: (objectiveId: string, progress: number) => void;
  onStartConversation: (objectiveId: string) => void;
  onStartBattle: (enemyName: string, enemyImage: string) => void;
}

const QuestObjectiveItem = ({ 
  objective, 
  onComplete, 
  onTrackProgress, 
  onStartConversation, 
  onStartBattle 
}: QuestObjectiveItemProps) => {
  const renderObjectiveActions = () => {
    if (objective.completed) return null;

    if (objective.activityType === 'conversation') {
      return (
        <Button 
          size="sm" 
          className="text-xs py-1 bg-blue-600 hover:bg-blue-700 text-white font-serif rounded-xl shadow-sm flex items-center gap-1"
          onClick={() => onStartConversation(objective.id)}
        >
          <MessageCircle size={12} />
          Start Conversation
        </Button>
      );
    }

    if (objective.id === "fight-1" || objective.id === "confront-presence") {
      return (
        <Button 
          size="sm" 
          className="text-xs py-1 bg-red-600 hover:bg-red-700 text-white font-serif rounded-xl shadow-sm"
          onClick={() => onStartBattle(
            objective.id === "fight-1" ? "Bandit Leader" : "Dark Presence", 
            objective.id === "fight-1" ? "⚔️" : "👻"
          )}
        >
          Start Battle
        </Button>
      );
    }

    if (objective.target) {
      return (
        <div className="grid grid-cols-3 gap-2">
          <Button 
            size="sm" 
            className="text-xs py-1 bg-slate-600 hover:bg-slate-700 text-white font-serif rounded-xl shadow-sm"
            onClick={() => onTrackProgress(objective.id, Math.round(objective.target! * 0.25))}
          >
            +25%
          </Button>
          <Button 
            size="sm" 
            className="text-xs py-1 bg-slate-600 hover:bg-slate-700 text-white font-serif rounded-xl shadow-sm"
            onClick={() => onTrackProgress(objective.id, Math.round(objective.target! * 0.5))}
          >
            +50%
          </Button>
          <Button 
            size="sm" 
            className="text-xs py-1 bg-slate-600 hover:bg-slate-700 text-white font-serif rounded-xl shadow-sm"
            onClick={() => onTrackProgress(objective.id, objective.target!)}
          >
            Complete
          </Button>
        </div>
      );
    }

    return (
      <Button 
        size="sm" 
        className="text-xs py-1 bg-slate-600 hover:bg-slate-700 text-white font-serif rounded-xl shadow-sm"
        onClick={() => onComplete(objective.id)}
      >
        Mark as Complete
      </Button>
    );
  };

  return (
    <div 
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
              {renderObjectiveActions()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestObjectiveItem;
