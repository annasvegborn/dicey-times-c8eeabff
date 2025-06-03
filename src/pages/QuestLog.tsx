
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Sword, Book, Backpack, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuestLog = () => {
  const navigate = useNavigate();

  const activeQuests = [
    {
      id: "village-siege",
      title: "Village Under Siege",
      location: "Oakvale Village",
      description: "Defend the village from an attack by mysterious bandits.",
      objectives: [
        { id: "train-1", text: "Complete a strength training workout", completed: true },
        { id: "walk-1", text: "Walk 1km to patrol the village", completed: false },
        { id: "fight-1", text: "Defeat the bandit leader (complete workout)", completed: false }
      ],
      rewards: ["Silver Sword", "50 XP", "Village Hero title"]
    },
    {
      id: "forest-disturbance",
      title: "Strange Disturbance",
      location: "Whisperwind Forest",
      description: "Investigate what's causing animals to flee from the forest.",
      objectives: [
        { id: "walk-2", text: "Walk 2km to search the forest", completed: false },
        { id: "find-1", text: "Find evidence of disturbance (10 min cardio)", completed: false },
        { id: "report-1", text: "Return to the village elder (stretch session)", completed: false }
      ],
      rewards: ["Forest Map", "40 XP", "Nature's Friend trait"]
    }
  ];
  
  const completedQuests = [
    {
      id: "tutorial",
      title: "Welcome to Eldoria",
      location: "Oakvale Village",
      description: "Learn the basics of your adventure.",
      objectives: [
        { id: "intro-1", text: "Create your character", completed: true },
        { id: "intro-2", text: "Visit the Village Elder", completed: true },
        { id: "intro-3", text: "Equip your starter gear", completed: true }
      ],
      rewards: ["Adventurer's Pack", "10 XP", "Beginner's Luck trait"]
    }
  ];

  return (
    <div className="min-h-screen bg-parchment-100 pb-16">
      <div className="bg-parchment-500 text-white px-4 py-3 flex justify-between items-center border-b-4 border-parchment-900">
        <h1 className="text-xl font-bold font-serif">Quest Log</h1>
        <Button 
          variant="outline" 
          size="sm"
          className="border-white text-white hover:bg-parchment-600 font-serif"
          onClick={() => navigate("/daily-challenges")}
        >
          Daily Challenges
        </Button>
      </div>

      <div className="p-4">
        <Tabs defaultValue="active" className="mb-4">
          <TabsList className="w-full bg-parchment-200 p-1 rounded-lg border-2 border-parchment-500">
            <TabsTrigger value="active" className="w-1/2 relative font-serif data-[state=active]:bg-parchment-500 data-[state=active]:text-white">
              Active
              <span className="absolute top-0 right-1 bg-parchment-700 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                {activeQuests.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="w-1/2 relative font-serif data-[state=active]:bg-parchment-500 data-[state=active]:text-white">
              Completed
              <span className="absolute top-0 right-1 bg-green-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                {completedQuests.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4 space-y-4">
            {activeQuests.map(quest => (
              <div 
                key={quest.id} 
                className="bg-parchment-50 rounded-lg p-4 border-2 border-parchment-500"
              >
                <h2 className="text-lg font-bold text-parchment-900 font-serif">{quest.title}</h2>
                <div className="text-sm text-parchment-700 mb-2 font-serif">{quest.location}</div>
                <p className="text-parchment-800 mb-4 font-serif">{quest.description}</p>
                
                <h3 className="font-medium mb-2 font-serif text-parchment-900">Objectives:</h3>
                <div className="space-y-2 mb-4">
                  {quest.objectives.map(objective => (
                    <div 
                      key={objective.id} 
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        objective.completed ? "bg-green-50" : "bg-parchment-200"
                      }`}
                    >
                      <div className={`rounded-full p-0.5 ${
                        objective.completed ? "text-green-600" : "text-parchment-700"
                      }`}>
                        {objective.completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-current rounded-full" />
                        )}
                      </div>
                      <span className={`font-serif ${objective.completed ? "line-through text-gray-400" : "text-parchment-900"}`}>
                        {objective.text}
                      </span>
                    </div>
                  ))}
                </div>
                
                <h3 className="font-medium mb-2 font-serif text-parchment-900">Rewards:</h3>
                <div className="flex flex-wrap gap-2">
                  {quest.rewards.map((reward, idx) => (
                    <span 
                      key={idx} 
                      className="bg-parchment-200 text-parchment-900 px-2 py-1 rounded-full text-xs font-serif"
                    >
                      {reward}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    className="bg-parchment-500 hover:bg-parchment-600 text-white font-serif"
                    onClick={() => navigate(`/quest/${quest.id}`)}
                  >
                    Continue Quest
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4 space-y-4">
            {completedQuests.map(quest => (
              <div 
                key={quest.id} 
                className="bg-parchment-50 rounded-lg p-4 border-2 border-green-700 opacity-80"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-bold text-green-800 font-serif">{quest.title}</h2>
                </div>
                <div className="text-sm text-green-700 mb-2 font-serif">{quest.location}</div>
                <p className="text-parchment-800 mb-4 font-serif">{quest.description}</p>
                
                <h3 className="font-medium mb-2 font-serif text-parchment-900">Rewards Earned:</h3>
                <div className="flex flex-wrap gap-2">
                  {quest.rewards.map((reward, idx) => (
                    <span 
                      key={idx} 
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-serif"
                    >
                      {reward}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Navigation footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-parchment-500 border-t-4 border-parchment-900">
        <div className="max-w-md mx-auto flex justify-around">
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-white hover:bg-parchment-600 rounded-none"
            onClick={() => navigate("/character-sheet")}
          >
            <Book size={20} />
            <span className="text-xs mt-1 font-serif">Character</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-white hover:bg-parchment-600 rounded-none"
            onClick={() => navigate("/world-map")}
          >
            <MapPin size={20} />
            <span className="text-xs mt-1 font-serif">World</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-white hover:bg-parchment-600 rounded-none bg-parchment-600"
            onClick={() => navigate("/quests")}
          >
            <Sword size={20} />
            <span className="text-xs mt-1 font-serif">Quests</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-white hover:bg-parchment-600 rounded-none"
            onClick={() => navigate("/inventory")}
          >
            <Backpack size={20} />
            <span className="text-xs mt-1 font-serif">Inventory</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestLog;
