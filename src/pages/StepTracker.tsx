
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Sword, Book, Backpack, Footprints, Award } from "lucide-react";

const StepTracker = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState(0);
  const [dailyGoal] = useState(5000);
  const [destinations] = useState([
    { name: "Windmill", steps: 1000, icon: "🏮", reached: false },
    { name: "Forest Shrine", steps: 2500, icon: "⛩️", reached: false },
    { name: "Lake Serenity", steps: 5000, icon: "🏞️", reached: false },
    { name: "Mountain Pass", steps: 7500, icon: "⛰️", reached: false },
    { name: "Ancient Tower", steps: 10000, icon: "🏰", reached: false },
  ]);
  
  // Simulate step counting (in a real app, this would use device sensors)
  useEffect(() => {
    const interval = setInterval(() => {
      // Add random steps (10-50) every few seconds to simulate walking
      if (Math.random() > 0.7) {
        setSteps(prev => prev + Math.floor(Math.random() * 40) + 10);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getNextDestination = () => {
    for (const destination of destinations) {
      if (steps < destination.steps) {
        const stepsLeft = destination.steps - steps;
        return { destination, stepsLeft };
      }
    }
    return null;
  };
  
  const nextDest = getNextDestination();
  const progress = nextDest 
    ? (steps / nextDest.destination.steps) * 100
    : 100;

  return (
    <div className="min-h-screen bg-parchment-100 pb-16">
      <div className="bg-parchment-500 text-white px-4 py-3 flex justify-between items-center border-b-4 border-parchment-900">
        <h1 className="text-xl font-bold font-serif">Step Tracker</h1>
        <div className="flex items-center gap-2">
          <Footprints size={18} />
          <span className="text-sm font-serif">{steps.toLocaleString()} steps</span>
        </div>
      </div>

      {/* Daily progress */}
      <div className="p-4">
        <div className="bg-parchment-50 rounded-lg p-4 border-2 border-parchment-500 mb-4">
          <div className="flex justify-between mb-1">
            <span className="font-medium font-serif text-parchment-900">Daily Goal</span>
            <span className="text-parchment-700 font-serif">{steps.toLocaleString()} / {dailyGoal.toLocaleString()}</span>
          </div>
          <div className="h-4 bg-parchment-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-parchment-500 transition-all duration-500" 
              style={{ width: `${Math.min(100, (steps / dailyGoal) * 100)}%` }}
            ></div>
          </div>
          
          {steps >= dailyGoal && (
            <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
              <Award size={16} />
              <span className="font-serif">Daily goal completed! +25 XP awarded</span>
            </div>
          )}
        </div>
        
        {/* Map view */}
        <div className="bg-parchment-50 rounded-lg overflow-hidden border-2 border-parchment-500">
          <div className="relative h-60 bg-parchment-200">
            {/* Path */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-parchment-500/30 z-0"></div>
            
            {/* Destinations */}
            {destinations.map((dest, index) => (
              <div 
                key={index}
                className={`absolute top-1/2 transform -translate-y-1/2 flex flex-col items-center`}
                style={{ left: `${(dest.steps / 10000) * 100}%` }}
              >
                <div className={`text-2xl mb-1 ${steps >= dest.steps ? "animate-bounce" : "opacity-50"}`}>
                  {dest.icon}
                </div>
                <div className={`text-xs px-2 py-1 rounded font-serif ${
                  steps >= dest.steps 
                    ? "bg-parchment-500 text-white" 
                    : "bg-parchment-200 text-parchment-700"
                }`}>
                  {dest.name}
                </div>
              </div>
            ))}
            
            {/* Player position */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 z-10"
              style={{ left: `${(steps / 10000) * 100}%` }}
            >
              <div className="text-3xl">🧙</div>
            </div>
          </div>
          
          {/* Next destination info */}
          <div className="p-4">
            {nextDest ? (
              <>
                <h3 className="font-medium text-parchment-900 font-serif">Next Destination: {nextDest.destination.name}</h3>
                <div className="flex justify-between text-sm text-parchment-700 mb-1 mt-2 font-serif">
                  <span>{steps.toLocaleString()} steps traveled</span>
                  <span>{nextDest.destination.steps.toLocaleString()} steps total</span>
                </div>
                <div className="h-3 bg-parchment-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-parchment-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="mt-3 text-center text-sm">
                  <span className="text-parchment-700 font-medium font-serif">{nextDest.stepsLeft.toLocaleString()} steps left</span> 
                  <span className="font-serif text-parchment-800"> to reach {nextDest.destination.name}</span>
                </div>
              </>
            ) : (
              <div className="text-center py-3">
                <h3 className="font-medium text-green-700 mb-2 font-serif">All destinations reached!</h3>
                <p className="text-sm text-parchment-700 font-serif">You've reached all destinations on this path. New areas will unlock tomorrow!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Rewards section */}
        <div className="bg-parchment-50 rounded-lg p-4 border-2 border-parchment-500 mt-4">
          <h3 className="font-medium text-parchment-900 mb-2 font-serif">Step Rewards</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-parchment-200 rounded-lg">
              <span className="font-serif text-parchment-900">1,000 steps</span>
              <span className={`px-2 py-1 rounded text-xs font-medium font-serif ${
                steps >= 1000 ? "bg-green-600 text-white" : "bg-parchment-300 text-parchment-700"
              }`}>
                {steps >= 1000 ? "Claimed" : "Pending"}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-parchment-200 rounded-lg">
              <span className="font-serif text-parchment-900">5,000 steps</span>
              <span className={`px-2 py-1 rounded text-xs font-medium font-serif ${
                steps >= 5000 ? "bg-green-600 text-white" : "bg-parchment-300 text-parchment-700"
              }`}>
                {steps >= 5000 ? "Claimed" : "Pending"}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-parchment-200 rounded-lg">
              <span className="font-serif text-parchment-900">10,000 steps</span>
              <span className={`px-2 py-1 rounded text-xs font-medium font-serif ${
                steps >= 10000 ? "bg-green-600 text-white" : "bg-parchment-300 text-parchment-700"
              }`}>
                {steps >= 10000 ? "Claimed" : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-parchment-500 border-t-4 border-parchment-900">
        <div className="max-w-md mx-auto flex justify-around">
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-white hover:bg-parchment-600 rounded-none"
            onClick={() => navigate("/character-sheet")}
          >
            <Book size={20} />
            <span className="text-xs mt-1 font-serif">Character</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-white hover:bg-parchment-600 rounded-none"
            onClick={() => navigate("/world-map")}
          >
            <MapPin size={20} />
            <span className="text-xs mt-1 font-serif">World</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-white hover:bg-parchment-600 rounded-none"
            onClick={() => navigate("/quests")}
          >
            <Sword size={20} />
            <span className="text-xs mt-1 font-serif">Quests</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 flex flex-col items-center py-3 text-white hover:bg-parchment-600 rounded-none"
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

export default StepTracker;
