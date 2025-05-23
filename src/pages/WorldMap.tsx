
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Sword, Book, Backpack, Award, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const WorldMap = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string | null>(null);
  
  const handleLocationClick = (loc: string) => {
    setLocation(loc);
  };
  
  const closeLocationSheet = () => {
    setLocation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 pb-16">
      <div className="relative">
        {/* Map Header */}
        <div className="bg-amber-800 text-amber-50 px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold font-serif">Realm of Eldoria</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">Level 1</span>
            <Award size={18} />
          </div>
        </div>

        {/* Map Content */}
        <div className="p-4">
          <div className="bg-amber-100 rounded-lg p-6 border-4 border-amber-700 relative">
            {/* Map image with a parchment-style background */}
            <div className="w-full aspect-square relative bg-[url('https://img.freepik.com/free-photo/old-paper-texture_1194-6201.jpg')] bg-cover rounded">
              
              {/* Village Location */}
              <button 
                className="absolute top-[30%] left-[35%] w-12 h-12"
                onClick={() => handleLocationClick("village")}
              >
                <div className="w-3 h-3 bg-red-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-8 h-8 bg-red-600/20 rounded-full animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-amber-800 text-amber-50 px-2 py-1 rounded text-xs font-medium mt-1">
                  Oakvale Village
                </span>
              </button>
              
              {/* Forest Location */}
              <button 
                className="absolute top-[20%] right-[25%] w-12 h-12"
                onClick={() => handleLocationClick("forest")}
              >
                <div className="w-3 h-3 bg-green-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-8 h-8 bg-green-600/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-amber-800 text-amber-50 px-2 py-1 rounded text-xs font-medium mt-1">
                  Whisperwind Forest
                </span>
              </button>
              
              {/* Mountains Location - Locked */}
              <button 
                className="absolute bottom-[30%] right-[20%] w-12 h-12"
                onClick={() => handleLocationClick("mountains")}
                disabled
              >
                <div className="w-3 h-3 bg-gray-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-8 h-8 bg-gray-600/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-medium mt-1 flex items-center gap-1">
                  <X size={10} /> Dragonspire Peaks
                </span>
              </button>
              
              {/* Tower Location - Locked */}
              <button 
                className="absolute top-[60%] left-[20%] w-12 h-12"
                onClick={() => handleLocationClick("tower")}
                disabled
              >
                <div className="w-3 h-3 bg-gray-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-8 h-8 bg-gray-600/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-medium mt-1 flex items-center gap-1">
                  <X size={10} /> Arcane Tower
                </span>
              </button>
              
              {/* Map decorations - trees, mountains, etc. */}
              <div className="absolute top-[15%] left-[45%] text-2xl">🌲</div>
              <div className="absolute top-[18%] left-[40%] text-2xl">🌲</div>
              <div className="absolute top-[22%] left-[44%] text-2xl">🌲</div>
              <div className="absolute bottom-[25%] right-[25%] text-2xl">⛰️</div>
              <div className="absolute bottom-[30%] right-[30%] text-2xl">⛰️</div>
              <div className="absolute top-[65%] left-[22%] text-2xl">🏰</div>
              <div className="absolute top-[35%] left-[32%] text-xl">🏠</div>
              <div className="absolute top-[32%] left-[37%] text-xl">🏠</div>
              <div className="absolute top-[37%] left-[39%] text-xl">🏠</div>
              
              {/* Compass rose */}
              <div className="absolute bottom-4 right-4 text-2xl">🧭</div>
            </div>

            <div className="text-center text-amber-800 mt-4 text-sm italic">
              Travel the realm by completing fitness activities in the real world
            </div>
          </div>

          {/* Legend */}
          <div className="bg-stone-100 rounded-lg p-4 mt-4 border-2 border-amber-700">
            <h3 className="text-amber-800 font-medium mb-2">Legend</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span>Current locations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>Available locations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span>Locked locations (walk 2km to unlock)</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location details sheet */}
        <Sheet open={!!location} onOpenChange={closeLocationSheet}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-amber-800">
                {location === "village" ? "Oakvale Village" : 
                 location === "forest" ? "Whisperwind Forest" : 
                 location === "mountains" ? "Dragonspire Peaks" : 
                 "Arcane Tower"}
              </SheetTitle>
              <SheetDescription>
                {location === "village" 
                  ? "A peaceful hamlet nestled between rolling hills and ancient forests." 
                  : location === "forest" 
                  ? "A mystical forest with trees taller than towers, home to elusive creatures."
                  : location === "mountains" 
                  ? "Towering peaks where dragons once ruled. Locked until you reach level 3."
                  : "A mysterious tower crackling with arcane energy. Locked until you reach level 5."}
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6">
              <h3 className="font-medium text-amber-700 mb-2">Available Quests:</h3>
              {location === "village" && (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <h4 className="font-medium">Village Under Siege</h4>
                    <p className="text-sm text-gray-600 mt-1">The village is threatened by bandits. Help defend it!</p>
                    <Button 
                      className="w-full mt-3 bg-amber-600 hover:bg-amber-700" 
                      onClick={() => navigate("/quest/village-siege")}
                    >
                      Start Quest
                    </Button>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <h4 className="font-medium">Missing Supplies</h4>
                    <p className="text-sm text-gray-600 mt-1">Help the merchant find his missing supplies.</p>
                    <Button 
                      variant="outline" 
                      className="w-full mt-3 border-amber-600 text-amber-700" 
                      onClick={() => navigate("/quest/missing-supplies")}
                    >
                      Start Quest
                    </Button>
                  </div>
                </div>
              )}
              
              {location === "forest" && (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <h4 className="font-medium">Strange Disturbance</h4>
                    <p className="text-sm text-gray-600 mt-1">Something is causing the forest creatures to flee.</p>
                    <Button 
                      className="w-full mt-3 bg-amber-600 hover:bg-amber-700" 
                      onClick={() => navigate("/quest/forest-disturbance")}
                    >
                      Start Quest
                    </Button>
                  </div>
                </div>
              )}
              
              {(location === "mountains" || location === "tower") && (
                <div className="bg-gray-100 border border-gray-200 p-3 rounded-lg text-center">
                  <p className="text-gray-500">Complete more quests to unlock this location.</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Navigation footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-stone-800 border-t border-amber-900">
        <div className="max-w-md mx-auto flex justify-around">
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none"
            onClick={() => navigate("/character-sheet")}
          >
            <Book size={20} />
            <span className="text-xs mt-1">Character</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none bg-stone-700"
            onClick={() => navigate("/world-map")}
          >
            <MapPin size={20} />
            <span className="text-xs mt-1">World</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none"
            onClick={() => navigate("/quests")}
          >
            <Sword size={20} />
            <span className="text-xs mt-1">Quests</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none"
            onClick={() => navigate("/inventory")}
          >
            <Backpack size={20} />
            <span className="text-xs mt-1">Inventory</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
