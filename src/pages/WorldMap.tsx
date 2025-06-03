
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorldMap = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations = [
    { id: "village", name: "Oakvale Village", x: 30, y: 60, quests: ["village-siege"] },
    { id: "forest", name: "Whisperwind Forest", x: 70, y: 40, quests: ["forest-disturbance"] },
    { id: "mountains", name: "Dragon's Peak", x: 85, y: 20, quests: [] },
    { id: "coast", name: "Siren's Bay", x: 15, y: 80, quests: [] },
  ];

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location.id);
    if (location.quests.length > 0) {
      navigate(`/quest/${location.quests[0]}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#ecd4ab]">
      {/* Header */}
      <div className="bg-[#422e18] text-[#ecd4ab] px-4 py-3 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/character-sheet")}
          className="text-[#ecd4ab] hover:bg-[#997752] mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold font-serif">World Map</h1>
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-[#997752] to-[#422e18] m-4 rounded-3xl border-4 border-[#422e18] overflow-hidden shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 text-6xl">🏔️</div>
          <div className="absolute top-12 right-8 text-4xl">🌲</div>
          <div className="absolute bottom-8 left-8 text-5xl">🏰</div>
          <div className="absolute bottom-4 right-4 text-4xl">🌊</div>
        </div>

        {/* Interactive locations */}
        {locations.map((location) => (
          <button
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            onClick={() => handleLocationClick(location)}
          >
            <div className="w-6 h-6 bg-[#ecd4ab] rounded-full border-2 border-[#422e18] group-hover:scale-125 transition-transform shadow-lg">
              <div className="w-full h-full rounded-full bg-[#997752] opacity-75"></div>
            </div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-[#ecd4ab] text-[#422e18] text-xs px-2 py-1 rounded-xl font-serif border-2 border-[#422e18] whitespace-nowrap shadow-lg">
                {location.name}
                {location.quests.length > 0 && (
                  <div className="text-[#997752] text-xs">Click to start quest</div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mx-4 bg-[#ecd4ab] rounded-3xl p-4 border-4 border-[#422e18] shadow-2xl">
        <h2 className="text-[#422e18] font-serif font-bold mb-3">Legend</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#997752] rounded-full border-2 border-[#422e18]"></div>
            <span className="text-[#422e18] text-sm font-serif">Available Quest Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full border-2 border-[#422e18]"></div>
            <span className="text-[#997752] text-sm font-serif">Locked Location</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fixed bottom-4 right-4">
        <Button 
          onClick={() => navigate("/quests")}
          className="bg-[#997752] hover:bg-[#422e18] text-[#ecd4ab] border-2 border-[#422e18] rounded-xl font-serif shadow-lg"
        >
          Quest Log
        </Button>
      </div>
    </div>
  );
};

export default WorldMap;
