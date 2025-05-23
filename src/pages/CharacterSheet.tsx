
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Sword, Book, Backpack } from "lucide-react";

const CharacterSheet = () => {
  const navigate = useNavigate();
  // In a real app, we would fetch this from a database
  const [character] = useState({
    name: "Adventurer",
    level: 1,
    race: "Human",
    class: "Warrior",
    xp: 30,
    xpToNextLevel: 100,
    stats: {
      strength: { value: 12, progress: 25 },
      dexterity: { value: 10, progress: 15 },
      constitution: { value: 14, progress: 30 },
      intelligence: { value: 8, progress: 10 },
      wisdom: { value: 10, progress: 20 },
      charisma: { value: 9, progress: 5 }
    },
    traits: ["Determined", "Cautious"],
    features: ["Basic Attack", "Shield Block"]
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 p-4">
      <div className="max-w-md mx-auto">
        {/* Character header */}
        <div className="bg-stone-100 rounded-lg shadow-lg p-6 border-2 border-amber-700 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center border-2 border-amber-600 text-3xl">
              {character.class === "Warrior" ? "⚔️" : 
               character.class === "Rogue" ? "🏹" :
               character.class === "Mage" ? "🧙" : "🛡️"}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-amber-800">{character.name}</h1>
              <div className="text-sm text-gray-600">
                Level {character.level} {character.race} {character.class}
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-amber-700 mb-1">
                  <span>XP: {character.xp}/{character.xpToNextLevel}</span>
                  <span>{Math.round(character.xp/character.xpToNextLevel*100)}%</span>
                </div>
                <Progress value={(character.xp/character.xpToNextLevel)*100} className="h-2 bg-amber-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Main character tabs */}
        <Tabs defaultValue="stats" className="mb-4">
          <TabsList className="w-full bg-stone-200 p-1 rounded-lg">
            <TabsTrigger value="stats" className="w-1/2">Stats</TabsTrigger>
            <TabsTrigger value="features" className="w-1/2">Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="bg-stone-100 rounded-lg p-6 border-2 border-amber-700 mt-4">
            <h2 className="text-lg font-medium text-amber-800 mb-4">Ability Scores</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(character.stats).map(([statName, stat]) => (
                <div key={statName} className="bg-stone-200 p-4 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium capitalize">{statName}</span>
                    <span className="text-amber-700 font-bold">{stat.value}</span>
                  </div>
                  <Progress value={stat.progress} className="h-2 bg-stone-300" />
                  <div className="text-xs text-right mt-1 text-gray-600">+{Math.floor((stat.value - 10) / 2)} modifier</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-amber-800 mb-2">Traits</h3>
              <div className="flex flex-wrap gap-2">
                {character.traits.map((trait) => (
                  <span key={trait} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="bg-stone-100 rounded-lg p-6 border-2 border-amber-700 mt-4">
            <h2 className="text-lg font-medium text-amber-800 mb-4">Class Features</h2>
            
            <div className="space-y-4">
              {character.features.map((feature) => (
                <div key={feature} className="bg-stone-200 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-700">{feature}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {feature === "Basic Attack" 
                      ? "A simple attack using your main weapon. Deals 1d6 + STR modifier damage." 
                      : "Use your shield to block incoming attacks. Reduces damage by 1d4 + CON modifier."}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="text-amber-700 font-medium">Unlock More Features</h3>
              <p className="text-sm text-gray-600 mt-1">Complete fitness activities to level up and unlock new abilities!</p>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Navigation footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-stone-800 border-t border-amber-900">
          <div className="max-w-md mx-auto flex justify-around">
            <Button 
              variant="ghost" 
              className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none bg-stone-700"
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
              className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none"
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
    </div>
  );
};

export default CharacterSheet;
