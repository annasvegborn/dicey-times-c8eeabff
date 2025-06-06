
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CharacterRenderer from "@/components/character/CharacterRenderer";
import { useCharacter } from "@/hooks/useCharacter";

interface MapLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  questId?: string;
  type: "quest" | "travel" | "landmark";
  completed?: boolean;
}

interface CharacterPosition {
  x: number;
  y: number;
}

interface RegionalMapProps {
  regionId: string;
  mapImage: string;
  mapWidth: number;
  mapHeight: number;
  locations: MapLocation[];
  characterPosition?: CharacterPosition;
  onLocationClick: (location: MapLocation) => void;
}

const RegionalMap = ({
  regionId,
  mapImage,
  mapWidth,
  mapHeight,
  locations,
  characterPosition,
  onLocationClick
}: RegionalMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const { character } = useCharacter();

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location.id);
    onLocationClick(location);
  };

  const getLocationColor = (location: MapLocation) => {
    if (location.type === "quest") {
      return location.completed ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600";
    }
    switch (location.type) {
      case "travel": return "bg-blue-500 hover:bg-blue-600";
      case "landmark": return "bg-amber-500 hover:bg-amber-600";
      default: return "bg-slate-500 hover:bg-slate-600";
    }
  };

  return (
    <div className="relative w-full bg-white rounded-2xl overflow-hidden shadow-xl">
      {/* Map Image - maintain aspect ratio */}
      <div className="relative" style={{ aspectRatio: `${mapWidth}/${mapHeight}` }}>
        <img 
          src={mapImage} 
          alt={`${regionId} region map`}
          className="w-full h-full object-contain"
        />
        
        {/* Interactive locations */}
        {locations.map((location) => (
          <button
            key={location.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 group w-4 h-4 rounded-full shadow-lg transition-all duration-200 z-10 ${getLocationColor(location)}`}
            style={{ 
              left: `${(location.x / mapWidth) * 100}%`, 
              top: `${(location.y / mapHeight) * 100}%` 
            }}
            onClick={() => handleLocationClick(location)}
          >
            <div className="w-full h-full rounded-full opacity-90 group-hover:scale-125 transition-transform"></div>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <div className="bg-white text-slate-800 text-xs px-2 py-1 rounded-lg font-serif whitespace-nowrap shadow-lg border">
                {location.name}
                {location.questId && (
                  <div className="text-slate-600 text-xs">
                    {location.completed ? "Quest Complete" : "Click to view quest"}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}

        {/* Character position */}
        {characterPosition && character && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ 
              left: `${(characterPosition.x / mapWidth) * 100}%`, 
              top: `${(characterPosition.y / mapHeight) * 100}%` 
            }}
          >
            <div className="relative">
              {/* Character marker */}
              <div className="w-8 h-8 bg-purple-500 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <CharacterRenderer
                    race={character.race}
                    bodyShape={character.bodyShape}
                    hairStyle={character.hairStyle}
                    characterClass={character.characterClass}
                    skinTone={character.skinTone}
                    size={24}
                  />
                </div>
              </div>
              {/* Character tooltip */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white text-slate-800 text-xs px-2 py-1 rounded-lg font-serif whitespace-nowrap shadow-lg border">
                  {character.name}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionalMap;
