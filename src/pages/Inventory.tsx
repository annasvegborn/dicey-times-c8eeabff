
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Sword, Shield, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const navigate = useNavigate();

  // Sample inventory items - these would come from your game state
  const inventoryItems = [
    {
      id: 1,
      name: "Iron Sword",
      type: "weapon",
      rarity: "common",
      description: "A sturdy iron sword. +2 Attack Power",
      quantity: 1,
      icon: "⚔️"
    },
    {
      id: 2,
      name: "Health Potion",
      type: "consumable",
      rarity: "common",
      description: "Restores 50 HP when consumed",
      quantity: 3,
      icon: "🧪"
    },
    {
      id: 3,
      name: "Leather Armor",
      type: "armor",
      rarity: "common",
      description: "Basic leather armor. +1 Defense",
      quantity: 1,
      icon: "🛡️"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800";
      case "uncommon": return "bg-green-100 text-green-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "epic": return "bg-purple-100 text-purple-800";
      case "legendary": return "bg-yellow-100 text-yellow-800";
      default: return "bg-[#997752] text-[#ecd4ab]";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weapon": return <Sword className="text-[#997752]" size={16} />;
      case "armor": return <Shield className="text-[#997752]" size={16} />;
      case "consumable": return <Heart className="text-[#997752]" size={16} />;
      default: return <Package className="text-[#997752]" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#ecd4ab]">
      {/* Header */}
      <div className="bg-[#422e18] text-[#ecd4ab] px-4 py-3 flex items-center shadow-lg">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/character-sheet")}
          className="text-[#ecd4ab] hover:bg-[#997752] mr-2 rounded-xl"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold font-serif">Inventory</h1>
      </div>

      <div className="p-4">
        {/* Inventory Stats */}
        <div className="bg-[#ecd4ab] rounded-3xl p-4 mb-4 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className="text-[#997752]" size={20} />
              <span className="text-[#422e18] font-serif font-bold">Items</span>
            </div>
            <span className="text-[#997752] font-serif">{inventoryItems.length}/50</span>
          </div>
        </div>

        {/* Inventory Grid */}
        {inventoryItems.length > 0 ? (
          <div className="space-y-4">
            {inventoryItems.map((item) => (
              <div key={item.id} className="bg-[#ecd4ab] rounded-3xl p-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-[#422e18] font-serif">{item.name}</h3>
                      {item.quantity > 1 && (
                        <Badge className="bg-[#997752] text-[#ecd4ab] font-serif shadow-md">
                          x{item.quantity}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[#997752] mb-3 font-serif">{item.description}</p>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <Badge className={`font-serif shadow-md capitalize ${getRarityColor(item.rarity)}`}>
                        {item.rarity}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      className="bg-[#997752] hover:bg-[#422e18] text-[#ecd4ab] rounded-xl font-serif shadow-lg hover:shadow-xl transition-shadow"
                    >
                      Use
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#422e18] hover:bg-[#997752] hover:text-[#ecd4ab] rounded-xl font-serif shadow-md hover:shadow-lg transition-shadow"
                    >
                      Drop
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#ecd4ab] rounded-3xl p-8 shadow-xl text-center">
            <Package className="mx-auto text-[#997752] mb-4" size={48} />
            <h3 className="text-xl font-bold text-[#422e18] mb-2 font-serif">Empty Inventory</h3>
            <p className="text-[#997752] font-serif">Complete quests to earn items and equipment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
