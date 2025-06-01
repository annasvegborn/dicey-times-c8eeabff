import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { MapPin, Sword, Book, Backpack, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacter } from "@/hooks/useCharacter";
import CharacterRenderer from "@/components/character/CharacterRenderer";
import CharacterCustomizationSheet from "@/components/character/CharacterCustomizationSheet";

const CharacterSheet = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { character, stats, traits, features, loading, updateCharacterAppearance } = useCharacter();
  const [customizationOpen, setCustomizationOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleAppearanceUpdate = async (newAppearance: {
    race: string;
    bodyShape: string;
    hairStyle: string;
    skinTone: string;
  }) => {
    if (character) {
      console.log('Updating character appearance:', newAppearance);
      await updateCharacterAppearance(character.id, newAppearance);
      setCustomizationOpen(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading your character...</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-stone-100 rounded-lg shadow-lg p-8 text-center border-2 border-amber-700">
          <h2 className="text-xl font-bold text-amber-800 mb-4">No Character Found</h2>
          <p className="text-gray-600 mb-6">You haven't created a character yet. Let's begin your adventure!</p>
          <Button 
            onClick={() => navigate("/character-creation")}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Create Character
          </Button>
        </div>
      </div>
    );
  }

  const getClassEmoji = (characterClass: string) => {
    switch(characterClass) {
      case "warrior": return "⚔️";
      case "rogue": return "🏹";
      case "mage": return "🧙";
      case "cleric": return "🛡️";
      default: return "🛡️";
    }
  };

  // Ensure we have a valid skin tone, with proper fallback
  const currentSkinTone = character?.avatar_skin_tone || 'light';

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 p-4">
      <div className="max-w-md mx-auto">
        {/* Character header */}
        <div className="bg-stone-100 rounded-lg shadow-lg p-6 border-2 border-amber-700 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Sheet open={customizationOpen} onOpenChange={setCustomizationOpen}>
                <SheetTrigger asChild>
                  <div className="cursor-pointer hover:scale-105 transition-transform">
                    <CharacterRenderer
                      race={character.avatar_race}
                      bodyShape={character.avatar_body_shape}
                      hairStyle={character.avatar_hair_style}
                      characterClass={character.class}
                      skinTone={currentSkinTone as 'light' | 'dark'}
                      size={64}
                    />
                  </div>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Customize Appearance</SheetTitle>
                  </SheetHeader>
                  <CharacterCustomizationSheet
                    currentAppearance={{
                      race: character.avatar_race,
                      bodyShape: character.avatar_body_shape,
                      hairStyle: character.avatar_hair_style,
                      skinTone: currentSkinTone
                    }}
                    characterClass={character.class}
                    onSave={handleAppearanceUpdate}
                    onCancel={() => setCustomizationOpen(false)}
                  />
                </SheetContent>
              </Sheet>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-amber-800">{character.name}</h1>
                <div className="text-sm text-gray-600">
                  Level {character.level} {character.race} {character.class}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut size={16} />
            </Button>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-xs text-amber-700 mb-1">
              <span>XP: {character.xp}/{character.xp_to_next_level}</span>
              <span>{Math.round(character.xp/character.xp_to_next_level*100)}%</span>
            </div>
            <Progress value={(character.xp/character.xp_to_next_level)*100} className="h-2 bg-amber-100" />
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
            
            {stats && (
              <div className="grid grid-cols-2 gap-6">
                {Object.entries({
                  strength: { value: stats.strength_value, progress: stats.strength_progress },
                  dexterity: { value: stats.dexterity_value, progress: stats.dexterity_progress },
                  constitution: { value: stats.constitution_value, progress: stats.constitution_progress },
                  intelligence: { value: stats.intelligence_value, progress: stats.intelligence_progress },
                  wisdom: { value: stats.wisdom_value, progress: stats.wisdom_progress },
                  charisma: { value: stats.charisma_value, progress: stats.charisma_progress }
                }).map(([statName, stat]) => (
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
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-amber-800 mb-2">Traits</h3>
              <div className="flex flex-wrap gap-2">
                {traits.map((trait) => (
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
              {features.map((feature) => (
                <div key={feature.name} className="bg-stone-200 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-700">{feature.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
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
