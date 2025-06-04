
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  MapPin, 
  Scroll, 
  Package, 
  Settings,
  Sword,
  Shield,
  Heart,
  Zap,
  Brain,
  Target,
  LogOut,
  Edit3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacter } from "@/hooks/useCharacter";
import CharacterRenderer from "@/components/character/CharacterRenderer";
import CharacterCustomizationSheet from "@/components/character/CharacterCustomizationSheet";

const CharacterSheet = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { character, stats, loading, updateCharacterAppearance } = useCharacter();
  const [activeTab, setActiveTab] = useState("stats");
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSaveAppearance = async (appearance: {
    race: string;
    bodyShape: string;
    hairStyle: string;
    skinTone: string;
  }) => {
    if (character) {
      await updateCharacterAppearance(character.id, appearance);
      setIsCustomizing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment-50 flex items-center justify-center">
        <div className="text-parchment-800 text-xl font-serif">Loading character...</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-parchment-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-parchment-800 text-xl font-serif mb-4">No character found</h2>
          <Button 
            onClick={() => navigate("/character-creation")}
            className="bg-parchment-600 hover:bg-parchment-700 text-white rounded-xl font-serif shadow-lg hover:shadow-xl transition-all"
          >
            Create Character
          </Button>
        </div>
      </div>
    );
  }

  if (isCustomizing) {
    return (
      <div className="min-h-screen bg-parchment-50">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-4 flex items-center justify-between shadow-lg">
          <h1 className="text-xl font-bold font-serif">Customize Character</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCustomizing(false)}
            className="text-white hover:bg-slate-600 rounded-xl"
          >
            <LogOut size={20} />
          </Button>
        </div>
        <CharacterCustomizationSheet
          currentAppearance={{
            race: character.avatar_race || character.race,
            bodyShape: character.avatar_body_shape || 'medium',
            hairStyle: character.avatar_hair_style || 'short',
            skinTone: character.avatar_skin_tone || 'light'
          }}
          characterClass={character.class}
          onSave={handleSaveAppearance}
          onCancel={() => setIsCustomizing(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-4 flex items-center justify-between shadow-lg">
        <h1 className="text-xl font-bold font-serif">Character Sheet</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="text-white hover:bg-slate-600 rounded-xl"
        >
          <LogOut size={20} />
        </Button>
      </div>

      {/* Character Overview */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-parchment-100 rounded-full flex items-center justify-center overflow-hidden shadow-md">
                <CharacterRenderer 
                  race={character.avatar_race || character.race}
                  bodyShape={character.avatar_body_shape || 'medium'}
                  hairStyle={character.avatar_hair_style || 'short'}
                  characterClass={character.class}
                  skinTone={(character.avatar_skin_tone || 'light') as 'light' | 'dark'}
                  size={80}
                />
              </div>
              <Button
                size="sm"
                onClick={() => setIsCustomizing(true)}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-parchment-600 hover:bg-parchment-700 text-white shadow-lg p-0"
              >
                <Edit3 size={14} />
              </Button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-parchment-800 font-serif">{character.name}</h2>
              <p className="text-parchment-600 capitalize font-serif">{character.class} • Level {character.level}</p>
              <div className="flex gap-2 mt-1">
                <Badge className="bg-parchment-600 text-white font-serif shadow-sm">{character.race}</Badge>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-parchment-600 mb-1 font-serif">
              <span>Experience</span>
              <span>{character.xp}/{character.xp_to_next_level}</span>
            </div>
            <Progress 
              value={(character.xp / character.xp_to_next_level) * 100} 
              className="h-3 bg-parchment-100 shadow-inner"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-parchment-200 rounded-2xl p-1 mb-4 shadow-md">
          <Button
            variant={activeTab === "stats" ? "default" : "ghost"}
            onClick={() => setActiveTab("stats")}
            className={`flex-1 font-serif rounded-xl ${
              activeTab === "stats" 
                ? "bg-white text-parchment-800 shadow-md" 
                : "text-parchment-700 hover:bg-parchment-300"
            }`}
          >
            Stats
          </Button>
          <Button
            variant={activeTab === "equipment" ? "default" : "ghost"}
            onClick={() => setActiveTab("equipment")}
            className={`flex-1 font-serif rounded-xl ${
              activeTab === "equipment" 
                ? "bg-white text-parchment-800 shadow-md" 
                : "text-parchment-700 hover:bg-parchment-300"
            }`}
          >
            Equipment
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "stats" && (
          <div className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
            <h3 className="text-parchment-800 font-serif font-bold mb-4">Character Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Sword className="text-parchment-600" size={20} />
                <div>
                  <div className="text-sm text-parchment-600 font-serif">Strength</div>
                  <div className="font-bold text-parchment-800 font-serif">{stats?.strength_value || 10}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="text-parchment-600" size={20} />
                <div>
                  <div className="text-sm text-parchment-600 font-serif">Dexterity</div>
                  <div className="font-bold text-parchment-800 font-serif">{stats?.dexterity_value || 10}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="text-parchment-600" size={20} />
                <div>
                  <div className="text-sm text-parchment-600 font-serif">Constitution</div>
                  <div className="font-bold text-parchment-800 font-serif">{stats?.constitution_value || 10}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="text-parchment-600" size={20} />
                <div>
                  <div className="text-sm text-parchment-600 font-serif">Intelligence</div>
                  <div className="font-bold text-parchment-800 font-serif">{stats?.intelligence_value || 10}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-parchment-600" size={20} />
                <div>
                  <div className="text-sm text-parchment-600 font-serif">Wisdom</div>
                  <div className="font-bold text-parchment-800 font-serif">{stats?.wisdom_value || 10}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="text-parchment-600" size={20} />
                <div>
                  <div className="text-sm text-parchment-600 font-serif">Charisma</div>
                  <div className="font-bold text-parchment-800 font-serif">{stats?.charisma_value || 10}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "equipment" && (
          <div className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
            <h3 className="text-parchment-800 font-serif font-bold mb-4">Equipment</h3>
            <div className="text-center text-parchment-600 font-serif">
              No equipment yet. Complete quests to earn gear!
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-700 to-slate-800 p-4 shadow-2xl">
        <div className="flex justify-around max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/world-map")}
            className="flex flex-col items-center gap-1 text-white hover:bg-slate-600 font-serif rounded-xl"
          >
            <MapPin size={20} />
            <span className="text-xs">Map</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/quests")}
            className="flex flex-col items-center gap-1 text-white hover:bg-slate-600 font-serif rounded-xl"
          >
            <Scroll size={20} />
            <span className="text-xs">Quests</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/inventory")}
            className="flex flex-col items-center gap-1 text-white hover:bg-slate-600 font-serif rounded-xl"
          >
            <Package size={20} />
            <span className="text-xs">Inventory</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/step-tracker")}
            className="flex flex-col items-center gap-1 text-white hover:bg-slate-600 font-serif rounded-xl"
          >
            <Settings size={20} />
            <span className="text-xs">Tracker</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
