
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ExerciseData {
  pushUps: number;
  pushUpsKnees: number;
  sitUps: number;
  pullUps: number;
  squats: number;
  hangingSeconds: number;
  sprintMinutes: number;
  sprintSeconds: number;
  sprintSpeed: number;
  joggingDistance: number;
}

interface ExerciseFormProps {
  onSubmit: () => void;
}

const ExerciseForm = ({ onSubmit }: ExerciseFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [exerciseData, setExerciseData] = useState<ExerciseData>({
    pushUps: 0,
    pushUpsKnees: 0,
    sitUps: 0,
    pullUps: 0,
    squats: 0,
    hangingSeconds: 0,
    sprintMinutes: 0,
    sprintSeconds: 0,
    sprintSpeed: 0,
    joggingDistance: 0,
  });

  const handleInputChange = (field: keyof ExerciseData, value: string) => {
    setExerciseData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      // Create exercise session
      const { data: session, error: sessionError } = await supabase
        .from('exercise_sessions')
        .insert({
          user_id: user.id,
          session_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Prepare exercise entries
      const entries = [];

      if (exerciseData.pushUps > 0) {
        entries.push({
          session_id: session.id,
          exercise_type: 'push-ups',
          exercise_value: exerciseData.pushUps,
          exercise_unit: 'reps'
        });
      }

      if (exerciseData.pushUpsKnees > 0) {
        entries.push({
          session_id: session.id,
          exercise_type: 'push-ups-knees',
          exercise_value: exerciseData.pushUpsKnees,
          exercise_unit: 'reps'
        });
      }

      if (exerciseData.sitUps > 0) {
        entries.push({
          session_id: session.id,
          exercise_type: 'sit-ups',
          exercise_value: exerciseData.sitUps,
          exercise_unit: 'reps'
        });
      }

      if (exerciseData.pullUps > 0) {
        entries.push({
          session_id: session.id,
          exercise_type: 'pull-ups',
          exercise_value: exerciseData.pullUps,
          exercise_unit: 'reps'
        });
      }

      if (exerciseData.squats > 0) {
        entries.push({
          session_id: session.id,
          exercise_type: 'squats',
          exercise_value: exerciseData.squats,
          exercise_unit: 'reps'
        });
      }

      if (exerciseData.hangingSeconds > 0) {
        entries.push({
          session_id: session.id,
          exercise_type: 'hanging',
          exercise_time_seconds: exerciseData.hangingSeconds,
          exercise_unit: 'seconds'
        });
      }

      if (exerciseData.sprintMinutes > 0 || exerciseData.sprintSeconds > 0) {
        const totalSprintSeconds = exerciseData.sprintMinutes * 60 + exerciseData.sprintSeconds;
        entries.push({
          session_id: session.id,
          exercise_type: 'sprint',
          exercise_time_seconds: totalSprintSeconds,
          exercise_speed_kmh: exerciseData.sprintSpeed,
          exercise_unit: 'time'
        });
      }

      if (exerciseData.joggingDistance > 0) {
        entries.push({
          session_id: session.id,
          exercise_type: 'jogging',
          exercise_distance_meters: exerciseData.joggingDistance * 400, // 400m per lap
          exercise_unit: 'laps'
        });
      }

      // Insert all entries
      if (entries.length > 0) {
        const { error: entriesError } = await supabase
          .from('exercise_entries')
          .insert(entries);

        if (entriesError) throw entriesError;
      }

      toast({
        title: "Workout Saved!",
        description: `Logged ${entries.length} exercises successfully.`,
      });

      // Reset form
      setExerciseData({
        pushUps: 0,
        pushUpsKnees: 0,
        sitUps: 0,
        pullUps: 0,
        squats: 0,
        hangingSeconds: 0,
        sprintMinutes: 0,
        sprintSeconds: 0,
        sprintSpeed: 0,
        joggingDistance: 0,
      });

      onSubmit();
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold font-serif text-parchment-800 mb-4">Log Today's Workout</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pushUps" className="font-serif">Push-ups</Label>
            <Input
              id="pushUps"
              type="number"
              min="0"
              value={exerciseData.pushUps || ''}
              onChange={(e) => handleInputChange('pushUps', e.target.value)}
              placeholder="0"
            />
          </div>
          
          <div>
            <Label htmlFor="pushUpsKnees" className="font-serif">Push-ups (knees)</Label>
            <Input
              id="pushUpsKnees"
              type="number"
              min="0"
              value={exerciseData.pushUpsKnees || ''}
              onChange={(e) => handleInputChange('pushUpsKnees', e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="sitUps" className="font-serif">Sit-ups</Label>
            <Input
              id="sitUps"
              type="number"
              min="0"
              value={exerciseData.sitUps || ''}
              onChange={(e) => handleInputChange('sitUps', e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="pullUps" className="font-serif">Pull-ups</Label>
            <Input
              id="pullUps"
              type="number"
              min="0"
              value={exerciseData.pullUps || ''}
              onChange={(e) => handleInputChange('pullUps', e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="squats" className="font-serif">Squats</Label>
            <Input
              id="squats"
              type="number"
              min="0"
              value={exerciseData.squats || ''}
              onChange={(e) => handleInputChange('squats', e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="hanging" className="font-serif">Hanging (seconds)</Label>
            <Input
              id="hanging"
              type="number"
              min="0"
              value={exerciseData.hangingSeconds || ''}
              onChange={(e) => handleInputChange('hangingSeconds', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <Separator className="my-4" />
        
        <div className="space-y-4">
          <h4 className="font-bold font-serif text-parchment-800">Sprint</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sprintMinutes" className="font-serif">Minutes</Label>
              <Input
                id="sprintMinutes"
                type="number"
                min="0"
                value={exerciseData.sprintMinutes || ''}
                onChange={(e) => handleInputChange('sprintMinutes', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="sprintSeconds" className="font-serif">Seconds</Label>
              <Input
                id="sprintSeconds"
                type="number"
                min="0"
                max="59"
                value={exerciseData.sprintSeconds || ''}
                onChange={(e) => handleInputChange('sprintSeconds', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="sprintSpeed" className="font-serif">Max Speed (km/h)</Label>
              <Input
                id="sprintSpeed"
                type="number"
                min="0"
                step="0.1"
                value={exerciseData.sprintSpeed || ''}
                onChange={(e) => handleInputChange('sprintSpeed', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="jogging" className="font-serif">Jogging (400m laps)</Label>
          <Input
            id="jogging"
            type="number"
            min="0"
            value={exerciseData.joggingDistance || ''}
            onChange={(e) => handleInputChange('joggingDistance', e.target.value)}
            placeholder="0"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-parchment-600 hover:bg-parchment-700 text-white font-serif"
        >
          {isSubmitting ? 'Saving...' : 'Save Workout'}
        </Button>
      </form>
    </Card>
  );
};

export default ExerciseForm;
