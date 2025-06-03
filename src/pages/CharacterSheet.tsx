
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-amber-800 text-xl font-serif">Loading your character...</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-amber-100 rounded-3xl shadow-2xl p-8 text-center border-4 border-amber-800">
          <h2 className="text-2xl font-bold text-amber-800 mb-4 font-serif">No Character Found</h2>
          <p className="text-amber-700 mb-6 font-serif">You haven't created a character yet. Let's begin your adventure!</p>
          <Button 
            onClick={() => navigate("/character-creation")}
            className="bg-amber-700 hover:bg-amber-800 text-amber-100 font-serif text-lg py-3 px-6 rounded-2xl border-2 border-amber-900"
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Character header */}
        <div className="bg-amber-100 rounded-3xl shadow-2xl p-6 border-4 border-amber-800 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Sheet open={customizationOpen} onOpenChange={setCustomizationOpen}>
                <SheetTrigger asChild>
                  <div className="cursor-pointer hover:scale-105 transition-transform bg-amber-200 rounded-full p-2 border-2 border-amber-700">
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
                <SheetContent side="bottom" className="h-[80vh] bg-amber-50">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-amber-800">Customize Appearance</SheetTitle>
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
                <h1 className="text-2xl font-bold text-amber-800 font-serif">{character.name}</h1>
                <div className="text-amber-700 font-serif">
                  Level {character.level} {character.race} {character.class}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-amber-600 hover:text-amber-800 hover:bg-amber-200"
            >
              <LogOut size={16} />
            </Button>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-sm text-amber-700 mb-2 font-serif">
              <span>XP: {character.xp}/{character.xp_to_next_level}</span>
              <span>{Math.round(character.xp/character.xp_to_next_level*100)}%</span>
            </div>
            <Progress value={(character.xp/character.xp_to_next_level)*100} className="h-3 bg-amber-200" />
          </div>
        </div>

        {/* Main character tabs */}
        <Tabs defaultValue="stats" className="mb-4">
          <TabsList className="w-full bg-amber-200 p-1 rounded-2xl border-2 border-amber-700">
            <TabsTrigger 
              value="stats" 
              className="w-1/2 font-serif data-[state=active]:bg-amber-700 data-[state=active]:text-amber-100 rounded-xl"
            >
              Stats
            </TabsTrigger>
            <TabsTrigger 
              value="features" 
              className="w-1/2 font-serif data-[state=active]:bg-amber-700 data-[state=active]:text-amber-100 rounded-xl"
            >
              Features
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="bg-amber-100 rounded-3xl p-6 border-4 border-amber-800 mt-4 shadow-xl">
            <h2 className="text-xl font-bold text-amber-800 mb-4 font-serif">Ability Scores</h2>
            
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
                  <div key={statName} className="bg-amber-200 p-4 rounded-2xl border-2 border-amber-700">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold capitalize font-serif text-amber-800">{statName}</span>
                      <span className="text-amber-800 font-bold text-lg">{stat.value}</span>
                    </div>
                    <Progress value={stat.progress} className="h-2 bg-amber-300" />
                    <div className="text-xs text-right mt-1 text-amber-700 font-serif">+{Math.floor((stat.value - 10) / 2)} modifier</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-3 font-serif">Traits</h3>
              <div className="flex flex-wrap gap-2">
                {traits.map((trait) => (
                  <span key={trait} className="bg-amber-300 text-amber-800 px-3 py-1 rounded-full text-sm font-serif border border-amber-600">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="bg-amber-100 rounded-3xl p-6 border-4 border-amber-800 mt-4 shadow-xl">
            <h2 className="text-xl font-bold text-amber-800 mb-4 font-serif">Class Features</h2>
            
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.name} className="bg-amber-200 p-4 rounded-2xl border-2 border-amber-700">
                  <h3 className="font-semibold text-amber-800 font-serif text-lg">{feature.name}</h3>
                  <p className="text-amber-700 mt-2 font-serif">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-amber-200 border-2 border-amber-600 rounded-2xl">
              <h3 className="text-amber-800 font-semibold font-serif">Unlock More Features</h3>
              <p className="text-amber-700 mt-1 font-serif">Complete fitness activities to level up and unlock new abilities!</p>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Navigation footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-amber-800 border-t-4 border-amber-900">
          <div className="max-w-md mx-auto flex justify-around">
            <Button 
              variant="ghost" 
              className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-amber-700 rounded-none bg-amber-700"
              onClick={() => navigate("/character-sheet")}
            >
              <Book size={20} />
              <span className="text-xs mt-1 font-serif">Character</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-amber-700 rounded-none"
              onClick={() => navigate("/world-map")}
            >
              <MapPin size={20} />
              <span className="text-xs mt-1 font-serif">World</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-amber-700 rounded-none"
              onClick={() => navigate("/quests")}
            >
              <Sword size={20} />
              <span className="text-xs mt-1 font-serif">Quests</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-amber-700 rounded-none"
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
