
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Sword, Book, Backpack, X } from "lucide-react";
import { useState } from "react";

const WorldMap = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations = [
    {
      id: "village",
      name: "Oakvale Village",
      x: 20,
      y: 45,
      icon: "🏘️",
      description: "A peaceful village where your adventure begins.",
      available: true
    },
    {
      id: "museum",
      name: "Ancient Museum",
      x: 75,
      y: 25,
      icon: "🏛️",
      description: "Mysterious artifacts await discovery.",
      available: true,
      hasQuest: true
    },
    {
      id: "forest",
      name: "Whisperwind Forest",
      x: 15,
      y: 70,
      icon: "🌲",
      description: "Dense woods filled with ancient secrets.",
      available: false
    },
    {
      id: "mountains",
      name: "Stormcrest Mountains",
      x: 85,
      y: 80,
      icon: "⛰️",
      description: "Treacherous peaks that test the brave.",
      available: false
    }
  ];

  const handleLocationClick = (location: any) => {
    if (!location.available) return;
    setSelectedLocation(location.id);
  };

  const handleLocationAction = (locationId: string) => {
    if (locationId === "museum") {
      navigate("/quests");
    } else if (locationId === "village") {
      navigate("/character-sheet");
    }
    setSelectedLocation(null);
  };

  const selectedLoc = locations.find(loc => loc.id === selectedLocation);

  return (
    <div className="min-h-screen bg-parchment-100 pb-20">
      {/* Header */}
      <div className="bg-parchment-500 text-parchment-50 px-4 py-4 border-b-4 border-parchment-700">
        <h1 className="text-2xl font-bold font-serif text-center">World Map</h1>
      </div>

      {/* Map Area */}
      <div className="p-4 h-[calc(100vh-200px)]">
        <div className="relative w-full h-full bg-gradient-to-b from-green-300 to-green-500 rounded-3xl border-4 border-parchment-500 overflow-hidden shadow-2xl">
          {/* Background elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 text-4xl">🌳</div>
            <div className="absolute top-20 right-20 text-3xl">🌲</div>
            <div className="absolute bottom-20 left-16 text-3xl">🌿</div>
            <div className="absolute top-40 left-32 text-2xl">🌱</div>
            <div className="absolute bottom-32 right-24 text-4xl">🗻</div>
          </div>

          {/* Winding path */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 50 400 Q 200 350 300 250 Q 450 150 600 200"
              stroke="#8b7355"
              strokeWidth="8"
              fill="none"
              className="opacity-60"
            />
          </svg>

          {/* Locations */}
          {locations.map((location) => (
            <div
              key={location.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                location.available ? "hover:scale-110" : "opacity-50 cursor-not-allowed"
              }`}
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              onClick={() => handleLocationClick(location)}
            >
              <div className={`text-4xl mb-2 ${location.available ? "animate-bounce" : ""}`}>
                {location.icon}
              </div>
              <div className={`bg-parchment-50 px-3 py-1 rounded-xl border-2 text-center font-serif font-medium text-sm ${
                location.available ? "border-parchment-500 text-parchment-700" : "border-gray-400 text-gray-500"
              }`}>
                {location.name}
                {location.hasQuest && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Detail Modal */}
      {selectedLoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-parchment-50 rounded-3xl border-4 border-parchment-500 p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="text-3xl">{selectedLoc.icon}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLocation(null)}
                className="text-parchment-700 hover:bg-parchment-200"
              >
                <X size={20} />
              </Button>
            </div>
            
            <h2 className="text-2xl font-bold text-parchment-700 mb-2 font-serif">
              {selectedLoc.name}
            </h2>
            <p className="text-parchment-600 mb-6 font-serif">
              {selectedLoc.description}
            </p>

            {selectedLoc.hasQuest && (
              <div className="bg-parchment-200 p-3 rounded-2xl border-2 border-parchment-400 mb-4">
                <p className="text-parchment-700 font-serif font-medium">
                  ⚔️ Active Quest Available
                </p>
              </div>
            )}

            <Button
              onClick={() => handleLocationAction(selectedLoc.id)}
              className="w-full bg-parchment-500 hover:bg-parchment-600 text-parchment-50 font-serif text-lg py-3 rounded-2xl border-2 border-parchment-700"
            >
              {selectedLoc.id === "museum" ? "View Quests" : "Enter Location"}
            </Button>
          </div>
        </div>
      )}

      {/* Navigation footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-parchment-500 border-t-4 border-parchment-700">
        <div className="max-w-md mx-auto flex justify-around">
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-parchment-200 hover:bg-parchment-600 rounded-none"
            onClick={() => navigate("/character-sheet")}
          >
            <Book size={20} />
            <span className="text-xs mt-1 font-serif">Character</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-parchment-200 hover:bg-parchment-600 rounded-none bg-parchment-600"
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
  );
};

export default WorldMap;
