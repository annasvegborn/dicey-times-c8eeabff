
import { useState, useEffect, useRef } from "react";
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
  const [imageData, setImageData] = useState({ 
    displayWidth: 0, 
    displayHeight: 0, 
    offsetX: 0, 
    offsetY: 0,
    containerWidth: 0,
    containerHeight: 0
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const { character } = useCharacter();

  useEffect(() => {
    const updateImageDimensions = () => {
      if (!imageRef.current) return;
      
      const screenWidth = window.innerWidth;
      const aspectRatio = mapHeight / mapWidth;
      
      // Calculate what the container height would be if we maintained aspect ratio
      const idealHeight = screenWidth * aspectRatio;
      
      // But we want to show the full image, so we need to check if it fits
      const screenHeight = window.innerHeight - 100; // Account for header/footer
      
      let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
      
      if (idealHeight <= screenHeight) {
        // Image fits width-wise, use full screen width
        displayWidth = screenWidth;
        displayHeight = idealHeight;
      } else {
        // Image is too tall, scale down to fit height
        displayHeight = screenHeight;
        displayWidth = screenHeight / aspectRatio;
        offsetX = (screenWidth - displayWidth) / 2;
      }
      
      console.log(`Screen: ${screenWidth}x${screenHeight}`);
      console.log(`Map original: ${mapWidth}x${mapHeight}`);
      console.log(`Display: ${displayWidth}x${displayHeight}`);
      console.log(`Offset: ${offsetX}, ${offsetY}`);
      
      setImageData({
        displayWidth,
        displayHeight,
        offsetX,
        offsetY,
        containerWidth: screenWidth,
        containerHeight: Math.max(idealHeight, screenHeight)
      });
    };

    // Initial calculation
    updateImageDimensions();
    
    // Recalculate on resize
    window.addEventListener('resize', updateImageDimensions);
    
    // Also recalculate when image loads
    if (imageRef.current) {
      imageRef.current.addEventListener('load', updateImageDimensions);
    }
    
    return () => {
      window.removeEventListener('resize', updateImageDimensions);
      if (imageRef.current) {
        imageRef.current.removeEventListener('load', updateImageDimensions);
      }
    };
  }, [mapWidth, mapHeight]);

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

  // Calculate scaling factors for positioning markers correctly
  const scaleX = imageData.displayWidth / mapWidth;
  const scaleY = imageData.displayHeight / mapHeight;

  return (
    <div className="relative bg-slate-100 flex justify-center" style={{ 
      width: '100vw', 
      height: `${imageData.containerHeight}px`,
      minHeight: '400px'
    }}>
      {/* Map Image - centered and contained */}
      <img 
        ref={imageRef}
        src={mapImage} 
        alt={`${regionId} region map`}
        className="block object-contain"
        style={{ 
          width: `${imageData.displayWidth}px`,
          height: `${imageData.displayHeight}px`,
          marginLeft: `${imageData.offsetX}px`,
          marginTop: `${imageData.offsetY}px`
        }}
      />
      
      {/* Interactive locations - positioned relative to the actual displayed image */}
      {imageData.displayWidth > 0 && locations.map((location) => {
        const scaledX = location.x * scaleX + imageData.offsetX;
        const scaledY = location.y * scaleY + imageData.offsetY;
        
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

      {/* Character position - positioned relative to the actual displayed image */}
      {characterPosition && character && imageData.displayWidth > 0 && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ 
            left: `${characterPosition.x * scaleX + imageData.offsetX}px`, 
            top: `${characterPosition.y * scaleY + imageData.offsetY}px` 
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
  );
};

export default RegionalMap;
