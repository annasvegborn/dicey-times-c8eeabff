
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RegionalMap from "@/components/map/RegionalMap";
import CharacterRenderer from "@/components/character/CharacterRenderer";
import { useCharacter } from "@/hooks/useCharacter";

const WorldMap = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const { character } = useCharacter();

  // Define locations for Baelershire region with quest completion status
  const baelershireLocations = [
    { 
      id: "mountain-path", 
      name: "Path to Mountains", 
      x: 286, 
      y: 311, 
      type: "travel" as const 
    },
    { 
      id: "orc-army", 
      name: "Orc Army", 
      x: 784, 
      y: 266, 
      questId: "village-siege",
      type: "quest" as const,
      completed: false
    },
    { 
      id: "city-castle", 
      name: "City Castle", 
      x: 775, 
      y: 583, 
      type: "landmark" as const 
    },
    { 
      id: "chapel", 
      name: "Chapel", 
      x: 777, 
      y: 949, 
      questId: "chapel-mystery",
      type: "quest" as const,
      completed: false
    },
    { 
      id: "village-beberty", 
      name: "Village of Beberty", 
      x: 241, 
      y: 1233, 
      type: "landmark" as const 
    },
    { 
      id: "whisperwind-forest", 
      name: "Whisperwind Forest", 
      x: 216, 
      y: 472, 
      questId: "forest-disturbance",
      type: "quest" as const,
      completed: false
    }
  ];

  // Character's current position (you can make this dynamic)
  const characterPosition = { x: 775, y: 583 }; // Starting at City Castle

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location.id);
    console.log("Location clicked:", location);
    
    if (location.questId) {
      navigate(`/quest/${location.questId}`);
    } else {
      console.log(`Clicked on ${location.type}: ${location.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
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
        <h1 className="text-xl font-bold font-serif">World Map - Baelershire Region</h1>
      </div>

      {/* Map Container - Full window width, allows scrolling */}
      <div className="w-full overflow-x-auto">
        <RegionalMap
          regionId="baelershire"
          mapImage="/lovable-uploads/0fbe99d0-6956-4564-b834-75082e430b67.png"
          mapWidth={2024}
          mapHeight={1536}
          locations={baelershireLocations}
          characterPosition={characterPosition}
          onLocationClick={handleLocationClick}
        />
      </div>

      {/* Legend - placed after the map */}
      <div className="bg-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-slate-800 font-serif font-bold mb-4 text-lg">Map Legend</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
              <span className="text-slate-700 text-sm font-serif">Active Quest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
              <span className="text-slate-700 text-sm font-serif">Completed Quest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
              <span className="text-slate-700 text-sm font-serif">Travel Point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm"></div>
              <span className="text-slate-700 text-sm font-serif">Landmark</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full shadow-sm"></div>
              <span className="text-slate-700 text-sm font-serif">Your Location</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fixed bottom-4 right-4 z-30">
        <Button 
          onClick={() => navigate("/quests")}
          className="bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-serif shadow-lg hover:shadow-xl transition-all"
        >
          Quest Log
        </Button>
      </div>
    </div>
  );
};

export default WorldMap;
