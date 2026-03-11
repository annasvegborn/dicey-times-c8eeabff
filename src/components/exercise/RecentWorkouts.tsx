
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, Activity } from "lucide-react";

interface WorkoutSession {
  id: string;
  session_date: string;
  exercise_entries: Array<{
    exercise_type: string;
    exercise_value: number | null;
    exercise_time_seconds: number | null;
    exercise_speed_kmh: number | null;
    exercise_distance_meters: number | null;
    exercise_unit: string | null;
  }>;
}

interface RecentWorkoutsProps {
  refreshTrigger: number;
}

const SESSIONS_KEY = 'dicey-times-exercise-sessions';

const RecentWorkouts = ({ refreshTrigger }: RecentWorkoutsProps) => {
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  const formatExerciseValue = (entry: WorkoutSession['exercise_entries'][0]) => {
    switch (entry.exercise_type) {
      case 'hanging': return `${entry.exercise_time_seconds}s`;
      case 'sprint':
        const minutes = Math.floor((entry.exercise_time_seconds || 0) / 60);
        const seconds = (entry.exercise_time_seconds || 0) % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')} (${entry.exercise_speed_kmh}km/h)`;
      case 'jogging': return `${(entry.exercise_distance_meters || 0) / 400} laps`;
      default: return `${entry.exercise_value} reps`;
    }
  };

  const getExerciseName = (type: string) => {
    const names: Record<string, string> = { 'push-ups': 'Push-ups', 'push-ups-knees': 'Push-ups (knees)', 'sit-ups': 'Sit-ups', 'pull-ups': 'Pull-ups', 'squats': 'Squats', 'hanging': 'Hanging', 'sprint': 'Sprint', 'jogging': 'Jogging' };
    return names[type] || type;
  };

  useEffect(() => {
    setLoading(true);
    try {
      const sessions: WorkoutSession[] = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
      setRecentWorkouts(sessions.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching recent workouts:', error);
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger]);

  if (loading) {
    return <Card className="p-6"><div className="flex items-center gap-3 mb-4"><Calendar className="text-parchment-600" size={24} /><h3 className="text-lg font-bold font-serif text-parchment-800">Recent Workouts</h3></div><div className="text-center text-parchment-600 font-serif">Loading...</div></Card>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="text-parchment-600" size={24} />
        <h3 className="text-lg font-bold font-serif text-parchment-800">Recent Workouts</h3>
      </div>
      {recentWorkouts.length === 0 ? (
        <div className="text-center text-parchment-600 font-serif">No workouts recorded yet. Start logging your exercises!</div>
      ) : (
        <div className="space-y-4">
          {recentWorkouts.map((workout) => (
            <div key={workout.id} className="border border-parchment-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="text-parchment-600" size={16} />
                <span className="font-bold font-serif text-parchment-800">{new Date(workout.session_date).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {workout.exercise_entries.map((entry, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="font-serif text-parchment-700">{getExerciseName(entry.exercise_type)}:</span>
                    <span className="font-serif text-parchment-600">{formatExerciseValue(entry)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentWorkouts;
