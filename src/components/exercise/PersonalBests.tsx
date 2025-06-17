
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

const PersonalBests = ({ refreshTrigger }: PersonalBestsProps) => {
  const { user } = useAuth();
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
      case 'hanging':
        return formatTime(best.best_time);
      case 'sprint':
        return `${formatTime(best.best_time)} (${best.best_speed}km/h)`;
      case 'jogging':
        return `${best.best_distance / 400} laps (${(best.best_distance / 1000).toFixed(1)}km)`;
      default:
        return `${best.best_value} reps`;
    }
  };

  const getExerciseName = (type: string) => {
    switch (type) {
      case 'push-ups': return 'Push-ups';
      case 'push-ups-knees': return 'Push-ups (knees)';
      case 'sit-ups': return 'Sit-ups';
      case 'pull-ups': return 'Pull-ups';
      case 'squats': return 'Squats';
      case 'hanging': return 'Hanging';
      case 'sprint': return 'Sprint';
      case 'jogging': return 'Jogging';
      default: return type;
    }
  };

  useEffect(() => {
    const fetchPersonalBests = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Get personal bests by exercise type
        const { data, error } = await supabase
          .from('exercise_entries')
          .select(`
            exercise_type,
            exercise_value,
            exercise_time_seconds,
            exercise_speed_kmh,
            exercise_distance_meters,
            created_at,
            exercise_sessions!inner (
              user_id,
              session_date
            )
          `)
          .eq('exercise_sessions.user_id', user.id);

        if (error) throw error;

        // Process data to find personal bests
        const bestsByType: { [key: string]: PersonalBest } = {};

        data?.forEach(entry => {
          const type = entry.exercise_type;
          const currentBest = bestsByType[type];

          let isBetter = false;
          let newBest: PersonalBest;

          switch (type) {
            case 'hanging':
              isBetter = !currentBest || (entry.exercise_time_seconds || 0) > (currentBest.best_time || 0);
              newBest = {
                exercise_type: type,
                best_value: 0,
                best_time: entry.exercise_time_seconds || 0,
                best_speed: 0,
                best_distance: 0,
                date: entry.exercise_sessions.session_date
              };
              break;
            case 'sprint':
              // For sprint, we want the fastest time (lowest time is better)
              isBetter = !currentBest || (entry.exercise_time_seconds || Infinity) < (currentBest.best_time || Infinity);
              newBest = {
                exercise_type: type,
                best_value: 0,
                best_time: entry.exercise_time_seconds || 0,
                best_speed: entry.exercise_speed_kmh || 0,
                best_distance: 0,
                date: entry.exercise_sessions.session_date
              };
              break;
            case 'jogging':
              isBetter = !currentBest || (entry.exercise_distance_meters || 0) > (currentBest.best_distance || 0);
              newBest = {
                exercise_type: type,
                best_value: 0,
                best_time: 0,
                best_speed: 0,
                best_distance: entry.exercise_distance_meters || 0,
                date: entry.exercise_sessions.session_date
              };
              break;
            default:
              // For reps-based exercises, higher is better
              isBetter = !currentBest || (entry.exercise_value || 0) > (currentBest.best_value || 0);
              newBest = {
                exercise_type: type,
                best_value: entry.exercise_value || 0,
                best_time: 0,
                best_speed: 0,
                best_distance: 0,
                date: entry.exercise_sessions.session_date
              };
              break;
          }

          if (isBetter) {
            bestsByType[type] = newBest;
          }
        });

        setPersonalBests(Object.values(bestsByType));
      } catch (error) {
        console.error('Error fetching personal bests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalBests();
  }, [user, refreshTrigger]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="text-amber-600" size={24} />
          <h3 className="text-lg font-bold font-serif text-parchment-800">Personal Bests</h3>
        </div>
        <div className="text-center text-parchment-600 font-serif">Loading...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="text-amber-600" size={24} />
        <h3 className="text-lg font-bold font-serif text-parchment-800">Personal Bests</h3>
      </div>
      
      {personalBests.length === 0 ? (
        <div className="text-center text-parchment-600 font-serif">
          No workouts recorded yet. Complete your first workout to see your personal bests!
        </div>
      ) : (
        <div className="space-y-3">
          {personalBests.map((best) => (
            <div key={best.exercise_type} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-amber-600" size={16} />
                <div>
                  <div className="font-bold font-serif text-parchment-800">
                    {getExerciseName(best.exercise_type)}
                  </div>
                  <div className="text-sm text-parchment-600 font-serif">
                    {new Date(best.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold font-serif text-amber-700">
                  {getDisplayValue(best)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PersonalBests;
