
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RegionalMap from "@/components/map/RegionalMap";

const WorldMap = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Define locations for Baelershire region
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
      type: "quest" as const 
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
      questId: "forest-disturbance",
      type: "quest" as const 
    },
    { 
      id: "village-beberty", 
      name: "Village of Beberty", 
      x: 241, 
      y: 1233, 
      type: "landmark" as const 
    }
  ];

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location.id);
    console.log("Location clicked:", location);
    
    if (location.questId) {
      navigate(`/quest/${location.questId}`);
    } else {
      // Handle other location types (travel, landmarks)
      console.log(`Clicked on ${location.type}: ${location.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Map Container */}
      <div className="p-4">
        <RegionalMap
          regionId="baelershire"
          mapImage="/lovable-uploads/0fbe99d0-6956-4564-b834-75082e430b67.png"
          mapWidth={2024}
          mapHeight={1536}
          locations={baelershireLocations}
          onLocationClick={handleLocationClick}
        />
      </div>

      {/* Legend */}
      <div className="mx-4 bg-white rounded-2xl p-4 shadow-lg">
        <h2 className="text-gray-800 font-serif font-bold mb-3">Legend</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
            <span className="text-gray-800 text-sm font-serif">Quest Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="text-gray-800 text-sm font-serif">Travel Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-gray-800 text-sm font-serif">Landmark</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fixed bottom-4 right-4">
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
