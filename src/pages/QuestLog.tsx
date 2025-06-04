
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Trophy, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuestLog = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const quests = [
    {
      id: "village-siege",
      title: "Defend Oakvale Village",
      description: "The village is under attack by bandits. Help defend the innocent villagers.",
      status: "active",
      difficulty: "Medium",
      location: "Oakvale Village",
      xpReward: 150,
      timeEstimate: "15-20 min"
    },
    {
      id: "forest-disturbance",
      title: "Investigate the Forest Disturbance",
      description: "Strange noises have been coming from Whisperwind Forest. Find the source.",
      status: "available",
      difficulty: "Easy",
      location: "Whisperwind Forest",
      xpReward: 100,
      timeEstimate: "10-15 min"
    },
    {
      id: "dragon-peak",
      title: "Scale Dragon's Peak",
      description: "A legendary challenge awaits at the highest mountain in the realm.",
      status: "locked",
      difficulty: "Hard",
      location: "Dragon's Peak",
      xpReward: 300,
      timeEstimate: "30-45 min"
    }
  ];

  const filteredQuests = activeFilter === "all" 
    ? quests 
    : quests.filter(quest => quest.status === activeFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "available": return "bg-[#997752]";
      case "locked": return "bg-gray-400";
      case "completed": return "bg-blue-500";
      default: return "bg-[#997752]";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-[#997752] text-[#ecd4ab]";
    }
  };

  return (
    <div className="min-h-screen bg-[#ecd4ab]">
      {/* Header */}
      <div className="bg-[#422e18] text-[#ecd4ab] px-4 py-3 flex items-center shadow-lg">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/character-sheet")}
          className="text-[#ecd4ab] hover:bg-[#997752] mr-2 rounded-xl"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold font-serif">Quest Log</h1>
      </div>

      {/* Filter Tabs */}
      <div className="p-4">
        <div className="flex bg-[#997752] rounded-3xl p-1 mb-4 shadow-lg">
          <Button
            variant={activeFilter === "all" ? "default" : "ghost"}
            onClick={() => setActiveFilter("all")}
            className={`flex-1 font-serif rounded-2xl ${
              activeFilter === "all" 
                ? "bg-[#422e18] text-[#ecd4ab] shadow-md" 
                : "text-[#ecd4ab] hover:bg-[#422e18]"
            }`}
          >
            All
          </Button>
          <Button
            variant={activeFilter === "active" ? "default" : "ghost"}
            onClick={() => setActiveFilter("active")}
            className={`flex-1 font-serif rounded-2xl ${
              activeFilter === "active" 
                ? "bg-[#422e18] text-[#ecd4ab] shadow-md" 
                : "text-[#ecd4ab] hover:bg-[#422e18]"
            }`}
          >
            Active
          </Button>
          <Button
            variant={activeFilter === "available" ? "default" : "ghost"}
            onClick={() => setActiveFilter("available")}
            className={`flex-1 font-serif rounded-2xl ${
              activeFilter === "available" 
                ? "bg-[#422e18] text-[#ecd4ab] shadow-md" 
                : "text-[#ecd4ab] hover:bg-[#422e18]"
            }`}
          >
            Available
          </Button>
        </div>

        {/* Quest List */}
        <div className="space-y-4">
          {filteredQuests.map((quest) => (
            <div key={quest.id} className="bg-[#ecd4ab] rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-[#422e18] font-serif">{quest.title}</h3>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(quest.status)} shadow-sm`}></div>
                  </div>
                  <p className="text-[#997752] mb-3 font-serif">{quest.description}</p>
                </div>
              </div>

              {/* Quest Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="text-[#997752]" size={16} />
                  <span className="text-sm text-[#422e18] font-serif">{quest.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-[#997752]" size={16} />
                  <span className="text-sm text-[#422e18] font-serif">{quest.timeEstimate}</span>
                </div>
              </div>

              {/* Badges and Rewards */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge className={`font-serif shadow-md ${getDifficultyColor(quest.difficulty)}`}>
                    {quest.difficulty}
                  </Badge>
                  <Badge className="bg-[#997752] text-[#ecd4ab] font-serif shadow-md">
                    <Trophy size={12} className="mr-1" />
                    {quest.xpReward} XP
                  </Badge>
                </div>
                
                <Button
                  onClick={() => navigate(`/quest/${quest.id}`)}
                  disabled={quest.status === "locked"}
                  className={`font-serif rounded-2xl shadow-lg hover:shadow-xl transition-shadow ${
                    quest.status === "locked" 
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                      : "bg-[#997752] hover:bg-[#422e18] text-[#ecd4ab]"
                  }`}
                >
                  {quest.status === "active" ? "Continue" : quest.status === "locked" ? "Locked" : "Start Quest"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestLog;
