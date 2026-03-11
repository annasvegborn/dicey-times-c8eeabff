
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";

interface PersonalBest {
  exercise_type: string;
  best_value: number;
  best_time: number;
  best_speed: number;
  best_distance: number;
  date: string;
}

interface PersonalBestsProps {
  refreshTrigger: number;
}

const SESSIONS_KEY = 'dicey-times-exercise-sessions';

const PersonalBests = ({ refreshTrigger }: PersonalBestsProps) => {
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDisplayValue = (best: PersonalBest) => {
    switch (best.exercise_type) {
      case 'hanging': return formatTime(best.best_time);
      case 'sprint': return `${formatTime(best.best_time)} (${best.best_speed}km/h)`;
      case 'jogging': return `${best.best_distance / 400} laps (${(best.best_distance / 1000).toFixed(1)}km)`;
      default: return `${best.best_value} reps`;
    }
  };

  const getExerciseName = (type: string) => {
    const names: Record<string, string> = { 'push-ups': 'Push-ups', 'push-ups-knees': 'Push-ups (knees)', 'sit-ups': 'Sit-ups', 'pull-ups': 'Pull-ups', 'squats': 'Squats', 'hanging': 'Hanging', 'sprint': 'Sprint', 'jogging': 'Jogging' };
    return names[type] || type;
  };

  useEffect(() => {
    setLoading(true);
    try {
      const sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
      const bestsByType: Record<string, PersonalBest> = {};

      sessions.forEach((session: any) => {
        session.exercise_entries?.forEach((entry: any) => {
          const type = entry.exercise_type;
          const current = bestsByType[type];
          let isBetter = false;
          let newBest: PersonalBest;

          switch (type) {
            case 'hanging':
              isBetter = !current || (entry.exercise_time_seconds || 0) > (current.best_time || 0);
              newBest = { exercise_type: type, best_value: 0, best_time: entry.exercise_time_seconds || 0, best_speed: 0, best_distance: 0, date: session.session_date };
              break;
            case 'sprint':
              isBetter = !current || (entry.exercise_time_seconds || Infinity) < (current.best_time || Infinity);
              newBest = { exercise_type: type, best_value: 0, best_time: entry.exercise_time_seconds || 0, best_speed: entry.exercise_speed_kmh || 0, best_distance: 0, date: session.session_date };
              break;
            case 'jogging':
              isBetter = !current || (entry.exercise_distance_meters || 0) > (current.best_distance || 0);
              newBest = { exercise_type: type, best_value: 0, best_time: 0, best_speed: 0, best_distance: entry.exercise_distance_meters || 0, date: session.session_date };
              break;
            default:
              isBetter = !current || (entry.exercise_value || 0) > (current.best_value || 0);
              newBest = { exercise_type: type, best_value: entry.exercise_value || 0, best_time: 0, best_speed: 0, best_distance: 0, date: session.session_date };
              break;
          }
          if (isBetter) bestsByType[type] = newBest;
        });
      });

      setPersonalBests(Object.values(bestsByType));
    } catch (error) {
      console.error('Error fetching personal bests:', error);
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger]);

  if (loading) {
    return <Card className="p-6"><div className="flex items-center gap-3 mb-4"><Trophy className="text-amber-600" size={24} /><h3 className="text-lg font-bold font-serif text-parchment-800">Personal Bests</h3></div><div className="text-center text-parchment-600 font-serif">Loading...</div></Card>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="text-amber-600" size={24} />
        <h3 className="text-lg font-bold font-serif text-parchment-800">Personal Bests</h3>
      </div>
      {personalBests.length === 0 ? (
        <div className="text-center text-parchment-600 font-serif">No workouts recorded yet. Complete your first workout to see your personal bests!</div>
      ) : (
        <div className="space-y-3">
          {personalBests.map((best) => (
            <div key={best.exercise_type} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-amber-600" size={16} />
                <div>
                  <div className="font-bold font-serif text-parchment-800">{getExerciseName(best.exercise_type)}</div>
                  <div className="text-sm text-parchment-600 font-serif">{new Date(best.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-right"><div className="font-bold font-serif text-amber-700">{getDisplayValue(best)}</div></div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PersonalBests;
