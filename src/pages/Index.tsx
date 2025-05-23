
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-stone-100 rounded-lg shadow-lg p-8 space-y-6 border-2 border-amber-700">
        <div className="flex justify-center">
          <Shield size={64} className="text-amber-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-center text-amber-800 font-serif">Quest of Fitness Realm</h1>
        
        <p className="text-center text-gray-700">
          Begin your journey through the realm, where your real-world fitness adventures
          transform into an epic fantasy campaign.
        </p>
        
        <div className="pt-4">
          <Button 
            onClick={() => navigate("/character-creation")}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3"
          >
            Begin Your Quest
          </Button>
        </div>
        
        <div className="pt-2">
          <Button
            variant="outline"
            onClick={() => navigate("/login")} 
            className="w-full border-amber-600 text-amber-700 hover:bg-amber-50"
          >
            Continue Your Journey
          </Button>
        </div>
      </div>
      
      <div className="mt-8 text-white text-center text-xs opacity-75">
        Combine real-world fitness with an epic fantasy adventure
      </div>
    </div>
  );
};

export default Index;
