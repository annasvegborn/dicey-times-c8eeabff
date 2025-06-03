
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
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacter } from "@/hooks/useCharacter";
import CharacterRenderer from "@/components/character/CharacterRenderer";

const CharacterSheet = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { character, stats, loading } = useCharacter();
  const [activeTab, setActiveTab] = useState("stats");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ecd4ab] flex items-center justify-center">
        <div className="text-[#422e18] text-xl font-serif">Loading character...</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-[#ecd4ab] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[#422e18] text-xl font-serif mb-4">No character found</h2>
          <Button 
            onClick={() => navigate("/character-creation")}
            className="bg-[#997752] hover:bg-[#422e18] text-[#ecd4ab] border-2 border-[#422e18] rounded-xl font-serif"
          >
            Create Character
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ecd4ab] pb-20">
      {/* Header */}
      <div className="bg-[#422e18] text-[#ecd4ab] px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold font-serif">Character Sheet</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="text-[#ecd4ab] hover:bg-[#997752]"
        >
          <LogOut size={20} />
        </Button>
      </div>

      {/* Character Overview */}
      <div className="p-4">
        <div className="bg-[#ecd4ab] rounded-3xl p-6 border-4 border-[#422e18] mb-4 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-[#997752] rounded-full border-4 border-[#422e18] flex items-center justify-center overflow-hidden">
              <CharacterRenderer 
                character={character}
                size="small"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#422e18] font-serif">{character.name}</h2>
              <p className="text-[#997752] capitalize font-serif">{character.class} • Level {character.level}</p>
              <div className="flex gap-2 mt-1">
                <Badge className="bg-[#997752] text-[#ecd4ab] font-serif">{character.race}</Badge>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-[#997752] mb-1 font-serif">
              <span>Experience</span>
              <span>{character.xp}/{character.xp_to_next_level}</span>
            </div>
            <Progress 
              value={(character.xp / character.xp_to_next_level) * 100} 
              className="h-3 bg-[#997752]"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#997752] rounded-3xl p-1 mb-4 border-4 border-[#422e18]">
          <Button
            variant={activeTab === "stats" ? "default" : "ghost"}
            onClick={() => setActiveTab("stats")}
            className={`flex-1 font-serif rounded-2xl ${
              activeTab === "stats" 
                ? "bg-[#422e18] text-[#ecd4ab]" 
                : "text-[#ecd4ab] hover:bg-[#422e18]"
            }`}
          >
            Stats
          </Button>
          <Button
            variant={activeTab === "equipment" ? "default" : "ghost"}
            onClick={() => setActiveTab("equipment")}
            className={`flex-1 font-serif rounded-2xl ${
              activeTab === "equipment" 
                ? "bg-[#422e18] text-[#ecd4ab]" 
                : "text-[#ecd4ab] hover:bg-[#422e18]"
            }`}
          >
            Equipment
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "stats" && (
          <div className="bg-[#ecd4ab] rounded-3xl p-6 border-4 border-[#422e18] mb-4 shadow-2xl">
            <h3 className="text-[#422e18] font-serif font-bold mb-4">Character Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Sword className="text-[#997752]" size={20} />
                <div>
                  <div className="text-sm text-[#997752] font-serif">Strength</div>
                  <div className="font-bold text-[#422e18] font-serif">{stats?.strength_value || 10}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="text-[#997752]" size={20} />
                <div>
                  <div className="text-sm text-[#997752] font-serif">Dexterity</div>
                  <div className="font-bold text-[#422e18] font-serif">{stats?.dexterity_value || 10}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="text-[#997752]" size={20} />
                <div>
                  <div className="text-sm text-[#997752] font-serif">Constitution</div>
                  <div className="font-bold text-[#422e18] font-serif">{stats?.constitution_value || 10}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="text-[#997752]" size={20} />
                <div>
                  <div className="text-sm text-[#997752] font-serif">Intelligence</div>
                  <div className="font-bold text-[#422e18] font-serif">{stats?.intelligence_value || 10}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-[#997752]" size={20} />
                <div>
                  <div className="text-sm text-[#997752] font-serif">Wisdom</div>
                  <div className="font-bold text-[#422e18] font-serif">{stats?.wisdom_value || 10}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="text-[#997752]" size={20} />
                <div>
                  <div className="text-sm text-[#997752] font-serif">Charisma</div>
                  <div className="font-bold text-[#422e18] font-serif">{stats?.charisma_value || 10}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "equipment" && (
          <div className="bg-[#ecd4ab] rounded-3xl p-6 border-4 border-[#422e18] mb-4 shadow-2xl">
            <h3 className="text-[#422e18] font-serif font-bold mb-4">Equipment</h3>
            <div className="text-center text-[#997752] font-serif">
              No equipment yet. Complete quests to earn gear!
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#422e18] border-t-4 border-[#997752] p-4">
        <div className="flex justify-around max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/world-map")}
            className="flex flex-col items-center gap-1 text-[#ecd4ab] hover:bg-[#997752] font-serif"
          >
            <MapPin size={20} />
            <span className="text-xs">Map</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/quests")}
            className="flex flex-col items-center gap-1 text-[#ecd4ab] hover:bg-[#997752] font-serif"
          >
            <Scroll size={20} />
            <span className="text-xs">Quests</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/inventory")}
            className="flex flex-col items-center gap-1 text-[#ecd4ab] hover:bg-[#997752] font-serif"
          >
            <Package size={20} />
            <span className="text-xs">Inventory</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/step-tracker")}
            className="flex flex-col items-center gap-1 text-[#ecd4ab] hover:bg-[#997752] font-serif"
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
