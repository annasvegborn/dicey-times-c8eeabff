
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
      <div className="min-h-screen bg-parchment-100 flex items-center justify-center">
        <div className="text-parchment-700 text-xl font-serif">Loading your character...</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-parchment-100 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-parchment-50 rounded-3xl shadow-2xl p-8 text-center border-4 border-parchment-500">
          <h2 className="text-2xl font-bold text-parchment-700 mb-4 font-serif">No Character Found</h2>
          <p className="text-parchment-600 mb-6 font-serif">You haven't created a character yet. Let's begin your adventure!</p>
          <Button 
            onClick={() => navigate("/character-creation")}
            className="bg-parchment-500 hover:bg-parchment-600 text-parchment-50 font-serif text-lg py-3 px-6 rounded-2xl border-2 border-parchment-700"
          >
            Create Character
          </Button>
        </div>
      </div>
    );
  }

  // Ensure we have a valid skin tone, with proper fallback
  const currentSkinTone = character?.avatar_skin_tone || 'light';

  return (
    <div className="min-h-screen bg-parchment-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Character header */}
        <div className="bg-parchment-50 rounded-3xl shadow-2xl p-6 border-4 border-parchment-500 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Sheet open={customizationOpen} onOpenChange={setCustomizationOpen}>
                <SheetTrigger asChild>
                  <div className="cursor-pointer hover:scale-105 transition-transform bg-parchment-200 rounded-full p-2 border-2 border-parchment-500">
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
                <SheetContent side="bottom" className="h-[80vh] bg-parchment-100">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-parchment-700">Customize Appearance</SheetTitle>
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
                <h1 className="text-2xl font-bold text-parchment-700 font-serif">{character.name}</h1>
                <div className="text-parchment-600 font-serif">
                  Level {character.level} {character.race} {character.class}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-parchment-600 hover:text-parchment-700 hover:bg-parchment-200"
            >
              <LogOut size={16} />
            </Button>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-sm text-parchment-600 mb-2 font-serif">
              <span>XP: {character.xp}/{character.xp_to_next_level}</span>
              <span>{Math.round(character.xp/character.xp_to_next_level*100)}%</span>
            </div>
            <Progress value={(character.xp/character.xp_to_next_level)*100} className="h-3 bg-parchment-200" />
          </div>
        </div>

        {/* Main character tabs */}
        <Tabs defaultValue="stats" className="mb-4">
          <TabsList className="w-full bg-parchment-200 p-1 rounded-2xl border-2 border-parchment-500">
            <TabsTrigger 
              value="stats" 
              className="w-1/2 font-serif data-[state=active]:bg-parchment-500 data-[state=active]:text-parchment-50 rounded-xl"
            >
              Stats
            </TabsTrigger>
            <TabsTrigger 
              value="features" 
              className="w-1/2 font-serif data-[state=active]:bg-parchment-500 data-[state=active]:text-parchment-50 rounded-xl"
            >
              Features
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="bg-parchment-50 rounded-3xl p-6 border-4 border-parchment-500 mt-4 shadow-xl">
            <h2 className="text-xl font-bold text-parchment-700 mb-4 font-serif">Ability Scores</h2>
            
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
                  <div key={statName} className="bg-parchment-200 p-4 rounded-2xl border-2 border-parchment-500">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold capitalize font-serif text-parchment-700">{statName}</span>
                      <span className="text-parchment-700 font-bold text-lg">{stat.value}</span>
                    </div>
                    <Progress value={stat.progress} className="h-2 bg-parchment-300" />
                    <div className="text-xs text-right mt-1 text-parchment-600 font-serif">+{Math.floor((stat.value - 10) / 2)} modifier</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-parchment-700 mb-3 font-serif">Traits</h3>
              <div className="flex flex-wrap gap-2">
                {traits.map((trait) => (
                  <span key={trait} className="bg-parchment-300 text-parchment-700 px-3 py-1 rounded-full text-sm font-serif border border-parchment-500">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="bg-parchment-50 rounded-3xl p-6 border-4 border-parchment-500 mt-4 shadow-xl">
            <h2 className="text-xl font-bold text-parchment-700 mb-4 font-serif">Class Features</h2>
            
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.name} className="bg-parchment-200 p-4 rounded-2xl border-2 border-parchment-500">
                  <h3 className="font-semibold text-parchment-700 font-serif text-lg">{feature.name}</h3>
                  <p className="text-parchment-600 mt-2 font-serif">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-parchment-200 border-2 border-parchment-400 rounded-2xl">
              <h3 className="text-parchment-700 font-semibold font-serif">Unlock More Features</h3>
              <p className="text-parchment-600 mt-1 font-serif">Complete fitness activities to level up and unlock new abilities!</p>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Navigation footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-parchment-500 border-t-4 border-parchment-700">
          <div className="max-w-md mx-auto flex justify-around">
            <Button 
              variant="ghost" 
              className="flex-1 flex flex-col items-center py-3 text-parchment-200 hover:bg-parchment-600 rounded-none bg-parchment-600"
              onClick={() => navigate("/character-sheet")}
            >
              <Book size={20} />
              <span className="text-xs mt-1 font-serif">Character</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 flex flex-col items-center py-3 text-parchment-200 hover:bg-parchment-600 rounded-none"
              onClick={() => navigate("/world-map")}
            >
              <MapPin size={20} />
              <span className="text-xs mt-1 font-serif">World</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 flex flex-col items-center py-3 text-parchment-200 hover:bg-parchment-600 rounded-none"
              onClick={() => navigate("/quests")}
            >
              <Sword size={20} />
              <span className="text-xs mt-1 font-serif">Quests</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 flex flex-col items-center py-3 text-parchment-200 hover:bg-parchment-600 rounded-none"
              onClick={() => navigate("/inventory")}
            >
              <Backpack size={20} />
              <span className="text-xs mt-1 font-serif">Inventory</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
