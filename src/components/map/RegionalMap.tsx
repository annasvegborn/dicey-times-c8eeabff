
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

  // Calculate the display dimensions - map fills screen width, height scales proportionally
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const displayWidth = screenWidth;
  const displayHeight = (displayWidth * mapHeight) / mapWidth;

  // Calculate scaling factors for positioning markers correctly
  const scaleX = displayWidth / mapWidth;
  const scaleY = displayHeight / mapHeight;

  console.log(`Map original: ${mapWidth}x${mapHeight}`);
  console.log(`Map display: ${displayWidth}x${displayHeight}`);
  console.log(`Scale factors: scaleX=${scaleX}, scaleY=${scaleY}`);

  return (
    <div className="relative w-full bg-white">
      {/* Map Image - fills full screen width, maintains aspect ratio */}
      <div 
        className="relative w-full"
        style={{ 
          width: `${displayWidth}px`,
          height: `${displayHeight}px`
        }}
      >
        <img 
          src={mapImage} 
          alt={`${regionId} region map`}
          className="w-full h-full object-contain"
          style={{ 
            display: 'block',
            width: `${displayWidth}px`,
            height: `${displayHeight}px`
          }}
        />
        
        {/* Interactive locations - scaled coordinates */}
        {locations.map((location) => {
          const scaledX = location.x * scaleX;
          const scaledY = location.y * scaleY;
          
          console.log(`Location ${location.name}: original(${location.x}, ${location.y}) -> scaled(${scaledX}, ${scaledY})`);
          
          return (
            <button
              key={location.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 group w-4 h-4 rounded-full shadow-lg transition-all duration-200 z-10 ${getLocationColor(location)}`}
              style={{ 
                left: `${scaledX}px`, 
                top: `${scaledY}px` 
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
          );
        })}

        {/* Character position - scaled coordinates */}
        {characterPosition && character && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ 
              left: `${characterPosition.x * scaleX}px`, 
              top: `${characterPosition.y * scaleY}px` 
            }}
          >
            <div className="relative group">
              {/* Character marker */}
              <div className="w-10 h-10 bg-purple-500 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <CharacterRenderer
                    race={character.avatar_race || character.race}
                    bodyShape={character.avatar_body_shape || 'medium'}
                    hairStyle={character.avatar_hair_style || 'short'}
                    characterClass={character.class}
                    skinTone={(character.avatar_skin_tone || 'light') as 'light' | 'dark'}
                    size={32}
                  />
                </div>
              </div>
              {/* Character tooltip */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
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
