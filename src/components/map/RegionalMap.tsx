
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MapLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  questId?: string;
  type: "quest" | "travel" | "landmark";
}

interface RegionalMapProps {
  regionId: string;
  mapImage: string;
  mapWidth: number;
  mapHeight: number;
  locations: MapLocation[];
  onLocationClick: (location: MapLocation) => void;
}

const RegionalMap = ({
  regionId,
  mapImage,
  mapWidth,
  mapHeight,
  locations,
  onLocationClick
}: RegionalMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location.id);
    onLocationClick(location);
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case "quest": return "bg-red-500 hover:bg-red-600";
      case "travel": return "bg-blue-500 hover:bg-blue-600";
      case "landmark": return "bg-green-500 hover:bg-green-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="relative w-full h-96 bg-white rounded-2xl overflow-hidden shadow-xl">
      {/* Map Image */}
      <img 
        src={mapImage} 
        alt={`${regionId} region map`}
        className="w-full h-full object-cover"
      />
      
      {/* Interactive locations */}
      {locations.map((location) => (
        <button
          key={location.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 group w-4 h-4 rounded-full shadow-lg transition-all duration-200 ${getLocationColor(location.type)}`}
          style={{ 
            left: `${(location.x / mapWidth) * 100}%`, 
            top: `${(location.y / mapHeight) * 100}%` 
          }}
          onClick={() => handleLocationClick(location)}
        >
          <div className="w-full h-full rounded-full opacity-90 group-hover:scale-125 transition-transform"></div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white text-gray-800 text-xs px-2 py-1 rounded-lg font-serif whitespace-nowrap shadow-lg border">
              {location.name}
              {location.questId && (
                <div className="text-gray-600 text-xs">Click to view quest</div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default RegionalMap;
