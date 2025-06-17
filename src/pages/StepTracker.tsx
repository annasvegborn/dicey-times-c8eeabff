
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExerciseForm from "@/components/exercise/ExerciseForm";
import PersonalBests from "@/components/exercise/PersonalBests";
import RecentWorkouts from "@/components/exercise/RecentWorkouts";

const StepTracker = () => {
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWorkoutSubmitted = () => {
    // Trigger refresh of personal bests and recent workouts
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-parchment-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-4 flex items-center shadow-lg">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/character-sheet")}
          className="text-white hover:bg-slate-600 mr-2 rounded-xl"
        >
          <ArrowLeft size={20} />
        </Button>
        <Dumbbell className="mr-2" size={20} />
        <h1 className="text-xl font-bold font-serif">Exercise Tracker</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Exercise Form */}
        <ExerciseForm onSubmit={handleWorkoutSubmitted} />

        {/* Personal Bests */}
        <PersonalBests refreshTrigger={refreshTrigger} />

        {/* Recent Workouts */}
        <RecentWorkouts refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default StepTracker;
