
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Activity, Target, Trophy, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StepTracker = () => {
  const navigate = useNavigate();
  const [todaySteps, setTodaySteps] = useState(5420);
  const [todayGoal] = useState(8000);
  const [weeklyGoal] = useState(56000);
  const [weeklySteps] = useState(38250);

  // Calculate progress percentages
  const dailyProgress = Math.min((todaySteps / todayGoal) * 100, 100);
  const weeklyProgress = Math.min((weeklySteps / weeklyGoal) * 100, 100);

  // Mock achievements
  const achievements = [
    { name: "First Steps", description: "Take your first 1000 steps", unlocked: true },
    { name: "Daily Walker", description: "Reach 8000 steps in a day", unlocked: false },
    { name: "Weekly Warrior", description: "Complete weekly step goal", unlocked: false },
    { name: "Month Champion", description: "30 days of hitting daily goals", unlocked: false }
  ];

  return (
    <div className="min-h-screen bg-[#ecd4ab]">
      {/* Header */}
      <div className="bg-[#422e18] text-[#ecd4ab] px-4 py-3 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/character-sheet")}
          className="text-[#ecd4ab] hover:bg-[#997752] mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold font-serif">Step Tracker</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Today's Steps */}
        <div className="bg-[#ecd4ab] rounded-3xl p-6 border-4 border-[#422e18] shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-[#997752]" size={24} />
            <h2 className="text-xl font-bold text-[#422e18] font-serif">Today's Steps</h2>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-[#422e18] font-serif">{todaySteps.toLocaleString()}</div>
            <div className="text-[#997752] font-serif">of {todayGoal.toLocaleString()} goal</div>
          </div>

          <Progress value={dailyProgress} className="h-4 mb-2" />
          <div className="text-center text-[#997752] font-serif">{dailyProgress.toFixed(1)}% complete</div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-[#ecd4ab] rounded-3xl p-6 border-4 border-[#422e18] shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-[#997752]" size={24} />
            <h2 className="text-xl font-bold text-[#422e18] font-serif">This Week</h2>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-[#422e18] font-serif">{weeklySteps.toLocaleString()}</div>
            <div className="text-[#997752] font-serif">of {weeklyGoal.toLocaleString()} weekly goal</div>
          </div>

          <Progress value={weeklyProgress} className="h-4 mb-2" />
          <div className="text-center text-[#997752] font-serif">{weeklyProgress.toFixed(1)}% complete</div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#ecd4ab] rounded-3xl p-4 border-4 border-[#422e18] shadow-2xl text-center">
            <div className="text-2xl font-bold text-[#422e18] font-serif">2.1</div>
            <div className="text-[#997752] text-sm font-serif">Miles Today</div>
          </div>
          <div className="bg-[#ecd4ab] rounded-3xl p-4 border-4 border-[#422e18] shadow-2xl text-center">
            <div className="text-2xl font-bold text-[#422e18] font-serif">247</div>
            <div className="text-[#997752] text-sm font-serif">Calories Burned</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-[#ecd4ab] rounded-3xl p-6 border-4 border-[#422e18] shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-[#997752]" size={24} />
            <h2 className="text-xl font-bold text-[#422e18] font-serif">Achievements</h2>
          </div>
          
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${
                achievement.unlocked 
                  ? "bg-green-50 border-green-300" 
                  : "bg-gray-50 border-gray-300"
              }`}>
                <div className={`text-xl ${achievement.unlocked ? "text-green-600" : "text-gray-400"}`}>
                  🏆
                </div>
                <div className="flex-1">
                  <div className={`font-bold font-serif ${
                    achievement.unlocked ? "text-green-800" : "text-gray-600"
                  }`}>
                    {achievement.name}
                  </div>
                  <div className={`text-sm font-serif ${
                    achievement.unlocked ? "text-green-600" : "text-gray-500"
                  }`}>
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-600 text-sm font-serif">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <Button 
            className="bg-[#997752] hover:bg-[#422e18] text-[#ecd4ab] border-2 border-[#422e18] rounded-xl font-serif px-8 py-3"
          >
            <Target className="mr-2" size={20} />
            Set New Goal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepTracker;
