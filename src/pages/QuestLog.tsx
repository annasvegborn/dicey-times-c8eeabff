import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Scroll, MapPin, Clock, Sword, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuests } from "@/contexts/QuestContext";

const QuestLog = () => {
  const navigate = useNavigate();
  const { quests, loading } = useQuests();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800";
      case "available": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-slate-600 text-white";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-slate-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="text-blue-600" size={16} />;
      case "available": return <Scroll className="text-green-600" size={16} />;
      case "completed": return <CheckCircle className="text-gray-600" size={16} />;
      default: return <Scroll className="text-slate-600" size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-slate-700 font-serif text-xl">Loading quest log...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-4 flex items-center shadow-lg">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/character-sheet")}
          className="text-white hover:bg-slate-500 mr-2 rounded-xl"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold font-serif">Quest Log</h1>
      </div>

      <div className="p-4">
        {/* Quest Summary */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800 font-serif">
                {quests.filter(q => q.status === "active").length}
              </div>
              <div className="text-gray-600 text-sm font-serif">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 font-serif">
                {quests.filter(q => q.status === "available").length}
              </div>
              <div className="text-gray-600 text-sm font-serif">Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 font-serif">
                {quests.filter(q => q.status === "completed").length}
              </div>
              <div className="text-gray-600 text-sm font-serif">Completed</div>
            </div>
          </div>
        </div>

        {/* Quest List */}
        <div className="space-y-4">
          {quests.map((quest) => (
            <div key={quest.id} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 font-serif mb-1">{quest.title}</h3>
                  <p className="text-gray-600 text-sm font-serif mb-2">{quest.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="text-gray-600" size={14} />
                    <span className="text-gray-600 text-sm font-serif">{quest.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {getStatusIcon(quest.status)}
                <Badge className={`font-serif shadow-sm capitalize ${getStatusColor(quest.status)}`}>
                  {quest.status}
                </Badge>
                <Badge className={`font-serif shadow-sm ${getDifficultyColor(quest.difficulty)}`}>
                  {quest.difficulty}
                </Badge>
                <span className="text-gray-600 text-sm font-serif ml-auto">{quest.xpReward} XP</span>
              </div>

              {/* Progress Bar */}
              {quest.status !== "available" && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1 font-serif">
                    <span>Progress</span>
                    <span>{quest.progress}/{quest.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 shadow-inner">
                    <div 
                      className="bg-slate-600 h-2 rounded-full" 
                      style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Objectives */}
              <div className="space-y-1">
                {quest.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      objective.completed ? "bg-green-500" : "bg-gray-300"
                    }`}></div>
                    <span className={`text-sm font-serif ${
                      objective.completed ? "text-gray-500 line-through" : "text-gray-700"
                    }`}>
                      {objective.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-4 flex justify-end">
                {quest.status === "available" && (
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/quest/${quest.id}`)}
                    className="bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-serif shadow-lg hover:shadow-xl transition-all"
                  >
                    Start Quest
                  </Button>
                )}
                {quest.status === "active" && (
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/quest/${quest.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-serif shadow-lg hover:shadow-xl transition-all"
                  >
                    Continue
                  </Button>
                )}
                {quest.status === "completed" && (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/quest/${quest.id}`)}
                    className="text-gray-800 hover:bg-slate-600 hover:text-white rounded-xl font-serif shadow-sm hover:shadow-lg transition-all"
                  >
                    View Details
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestLog;
