
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Sword, Book, Backpack, ShieldX } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Inventory = () => {
  const navigate = useNavigate();

  // Mock inventory data - in a real app, this would come from a database
  const equipment = [
    {
      id: "starter-sword",
      name: "Adventurer's Sword",
      type: "weapon",
      stats: "+1 STR",
      description: "A basic sword given to new adventurers.",
      equipped: true,
    },
    {
      id: "leather-armor",
      name: "Leather Armor",
      type: "armor",
      stats: "+2 DEF",
      description: "Simple leather armor that offers basic protection.",
      equipped: true,
    }
  ];
  
  const items = [
    {
      id: "health-potion-1",
      name: "Health Potion",
      type: "consumable",
      effect: "Restores 25 HP",
      description: "A red liquid that heals wounds when consumed.",
      quantity: 2,
    },
    {
      id: "map-fragment",
      name: "Map Fragment",
      type: "key",
      effect: "Quest item",
      description: "A torn piece of parchment with partial map details.",
      quantity: 1,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 pb-16">
      <div className="bg-amber-800 text-amber-50 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold font-serif">Inventory</h1>
        <div className="text-sm">
          <span className="opacity-75">Gold:</span> <span className="font-medium">50</span>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <Tabs defaultValue="equipment" className="mb-4">
          <TabsList className="w-full bg-stone-200 p-1 rounded-lg">
            <TabsTrigger value="equipment" className="w-1/2">Equipment</TabsTrigger>
            <TabsTrigger value="items" className="w-1/2">Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="equipment" className="mt-4 space-y-4">
            {equipment.length > 0 ? (
              equipment.map(item => (
                <div 
                  key={item.id} 
                  className="bg-stone-100 rounded-lg p-4 border-2 border-amber-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-amber-800">{item.name}</h2>
                      <div className="text-sm text-amber-700">{item.type}</div>
                      <div className="mt-1 text-sm text-gray-600">{item.description}</div>
                      <div className="mt-2 bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs inline-block">
                        {item.stats}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm"
                      variant={item.equipped ? "outline" : "default"}
                      className={item.equipped ? "border-amber-600 text-amber-700" : ""}
                    >
                      {item.equipped ? "Equipped" : "Equip"}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-stone-100 rounded-lg">
                <ShieldX className="h-12 w-12 text-stone-400 mb-4" />
                <h3 className="text-lg font-medium text-stone-600">No Equipment</h3>
                <p className="text-sm text-stone-500 mt-1 max-w-xs">Complete quests to find weapons and armor for your adventure.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="items" className="mt-4 space-y-4">
            {items.map(item => (
              <div 
                key={item.id} 
                className="bg-stone-100 rounded-lg p-4 border-2 border-amber-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-amber-800">{item.name}</h2>
                      <span className="bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full text-xs">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="text-sm text-amber-700">{item.type}</div>
                    <div className="mt-1 text-sm text-gray-600">{item.description}</div>
                    <div className="mt-2 bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs inline-block">
                      {item.effect}
                    </div>
                  </div>
                  
                  {item.type === 'consumable' && (
                    <Button 
                      size="sm"
                    >
                      Use
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
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
            className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none"
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
            className="flex-1 flex flex-col items-center py-3 text-amber-200 hover:bg-stone-700 rounded-none bg-stone-700"
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

export default Inventory;
