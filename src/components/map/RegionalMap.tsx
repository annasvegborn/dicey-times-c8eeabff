
import { useState, useEffect, useRef, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import SimpleAvatar from "@/components/character/SimpleAvatar";
import { useCharacter } from "@/hooks/useCharacter";
import { useDebounce } from "@/hooks/useDebounce";

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

const RegionalMap = memo(({
  regionId,
  mapImage,
  mapWidth,
  mapHeight,
  locations,
  characterPosition,
  onLocationClick
}: RegionalMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const { character } = useCharacter();

  // Debounced dimension update function
  const updateImageDimensions = useDebounce(() => {
    if (imageRef.current && imageLoaded) {
      const rect = imageRef.current.getBoundingClientRect();
      console.log(`Image rendered dimensions: ${rect.width}x${rect.height}`);
      console.log(`Original image dimensions: ${mapWidth}x${mapHeight}`);
      setImageDimensions({ width: rect.width, height: rect.height });
    }
  }, 100);

  useEffect(() => {
    updateImageDimensions();
    window.addEventListener('resize', updateImageDimensions);
    
    return () => {
      window.removeEventListener('resize', updateImageDimensions);
    };
  }, [imageLoaded, updateImageDimensions]);

  const handleImageLoad = () => {
    console.log('Image loaded');
    setImageLoaded(true);
  };

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

  // Memoize scale factors to prevent recalculation on every render
  const scaleFactors = useMemo(() => {
    if (!imageLoaded || !imageDimensions.width || !imageDimensions.height) {
      return { scaleX: 0, scaleY: 0 };
    }

    const scaleX = imageDimensions.width / mapWidth;
    const scaleY = imageDimensions.height / mapHeight;
    
    return { scaleX, scaleY };
  }, [imageLoaded, imageDimensions, mapWidth, mapHeight]);

  // Memoize scaled positions for all locations
  const scaledLocations = useMemo(() => {
    if (scaleFactors.scaleX === 0 || scaleFactors.scaleY === 0) {
      return [];
    }

    return locations.map(location => ({
      ...location,
      scaledX: location.x * scaleFactors.scaleX,
      scaledY: location.y * scaleFactors.scaleY
    }));
  }, [locations, scaleFactors]);

  const getScaledPosition = (originalX: number, originalY: number) => {
    if (scaleFactors.scaleX === 0 || scaleFactors.scaleY === 0) {
      return { x: 0, y: 0 };
    }

    const scaledX = originalX * scaleFactors.scaleX;
    const scaledY = originalY * scaleFactors.scaleY;
    
    return { x: scaledX, y: scaledY };
  };

  return (
    <div className="relative bg-slate-100 w-full">
      {/* Map Image - full screen width, natural height */}
      <img 
        ref={imageRef}
        src={mapImage} 
        alt={`${regionId} region map`}
        className="block w-full h-auto"
        onLoad={handleImageLoad}
        fetchPriority="high"
      />
      
      {/* Interactive locations - positioned relative to the rendered image */}
      {imageLoaded && scaledLocations.map((location) => (
        <button
          key={location.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 group w-4 h-4 rounded-full shadow-lg transition-all duration-200 z-10 ${getLocationColor(location)}`}
          style={{ 
            left: `${location.scaledX}px`, 
            top: `${location.scaledY}px` 
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

      {/* Character position - positioned relative to the rendered image */}
      {characterPosition && character && imageLoaded && scaleFactors.scaleX > 0 && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ 
            left: `${getScaledPosition(characterPosition.x, characterPosition.y).x}px`, 
            top: `${getScaledPosition(characterPosition.x, characterPosition.y).y}px` 
          }}
        >
          <div className="relative group">
            {/* Character marker using SimpleAvatar */}
            <div className="w-10 h-10 bg-purple-500 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
              <SimpleAvatar
                race={character.avatar_race || character.race}
                characterClass={character.class}
                skinTone={(character.avatar_skin_tone || 'light') as 'light' | 'dark'}
                size={32}
              />
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
  );
});

RegionalMap.displayName = 'RegionalMap';

export default RegionalMap;
