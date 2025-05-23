
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 pb-16">
      <div className="bg-amber-800 text-amber-50 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold font-serif">Quest Log</h1>
        <Button 
          variant="outline" 
          size="sm"
          className="border-amber-200 text-amber-50 hover:bg-amber-700"
          onClick={() => navigate("/daily-challenges")}
        >
          Daily Challenges
        </Button>
      </div>

      <div className="p-4">
        <Tabs defaultValue="active" className="mb-4">
          <TabsList className="w-full bg-stone-200 p-1 rounded-lg">
            <TabsTrigger value="active" className="w-1/2 relative">
              Active
              <span className="absolute top-0 right-1 bg-amber-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                {activeQuests.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="w-1/2 relative">
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
                className="bg-stone-100 rounded-lg p-4 border-2 border-amber-700"
              >
                <h2 className="text-lg font-bold text-amber-800">{quest.title}</h2>
                <div className="text-sm text-amber-700 mb-2">{quest.location}</div>
                <p className="text-gray-600 mb-4">{quest.description}</p>
                
                <h3 className="font-medium mb-2">Objectives:</h3>
                <div className="space-y-2 mb-4">
                  {quest.objectives.map(objective => (
                    <div 
                      key={objective.id} 
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        objective.completed ? "bg-green-50" : "bg-stone-50"
                      }`}
                    >
                      <div className={`rounded-full p-0.5 ${
                        objective.completed ? "text-green-600" : "text-amber-600"
                      }`}>
                        {objective.completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-current rounded-full" />
                        )}
                      </div>
                      <span className={objective.completed ? "line-through text-gray-400" : ""}>
                        {objective.text}
                      </span>
                    </div>
                  ))}
                </div>
                
                <h3 className="font-medium mb-2">Rewards:</h3>
                <div className="flex flex-wrap gap-2">
                  {quest.rewards.map((reward, idx) => (
                    <span 
                      key={idx} 
                      className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs"
                    >
                      {reward}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700"
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
                className="bg-stone-100 rounded-lg p-4 border-2 border-green-700 opacity-80"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-bold text-green-800">{quest.title}</h2>
                </div>
                <div className="text-sm text-green-700 mb-2">{quest.location}</div>
                <p className="text-gray-600 mb-4">{quest.description}</p>
                
                <h3 className="font-medium mb-2">Rewards Earned:</h3>
                <div className="flex flex-wrap gap-2">
                  {quest.rewards.map((reward, idx) => (
                    <span 
                      key={idx} 
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
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
      <div className="fixed bottom-0 left-0 right-0 bg-stone-800 border-t border-amber-900">
        <div className="max-w-md mx-auto flex justify-around">
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none"
            onClick={() => navigate("/character-sheet")}
          >
            <Book size={20} />
            <span className="text-xs mt-1">Character</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none"
            onClick={() => navigate("/world-map")}
          >
            <MapPin size={20} />
            <span className="text-xs mt-1">World</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none bg-stone-700"
            onClick={() => navigate("/quests")}
          >
            <Sword size={20} />
            <span className="text-xs mt-1">Quests</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none"
            onClick={() => navigate("/inventory")}
          >
            <Backpack size={20} />
            <span className="text-xs mt-1">Inventory</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestLog;
