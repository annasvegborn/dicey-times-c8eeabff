
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/character-sheet");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment-100 flex items-center justify-center">
        <div className="text-parchment-900 text-xl font-serif">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-parchment-50 rounded-3xl border-4 border-parchment-500 p-8 text-center shadow-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-parchment-900 mb-4 font-serif">
            FitQuest
          </h1>
          <h2 className="text-2xl text-parchment-700 mb-2 font-serif">
            Adventure Awaits
          </h2>
          <p className="text-parchment-700 leading-relaxed font-serif">
            Transform your fitness journey into an epic RPG adventure. 
            Create your character and embark on quests that make exercise fun!
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/auth")}
            className="w-full bg-parchment-500 hover:bg-parchment-600 text-white font-serif text-lg py-6 rounded-2xl border-2 border-parchment-900 shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            Begin Your Quest
          </Button>
          
          <div className="mt-6 p-4 bg-parchment-200 rounded-2xl border-2 border-parchment-500">
            <h3 className="font-bold text-parchment-900 mb-2 font-serif">What is FitQuest?</h3>
            <ul className="text-sm text-parchment-800 space-y-1 font-serif">
              <li>• Turn workouts into epic adventures</li>
              <li>• Level up your character through exercise</li>
              <li>• Complete quests and earn rewards</li>
              <li>• Track progress in a fantasy world</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
