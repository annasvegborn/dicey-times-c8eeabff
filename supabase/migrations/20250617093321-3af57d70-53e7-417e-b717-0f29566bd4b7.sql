
-- Create a table for exercise sessions
CREATE TABLE public.exercise_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for exercise entries within sessions
CREATE TABLE public.exercise_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.exercise_sessions(id) ON DELETE CASCADE NOT NULL,
  exercise_type TEXT NOT NULL,
  exercise_value NUMERIC,
  exercise_unit TEXT,
  exercise_time_seconds INTEGER, -- for time-based exercises like hanging, sprinting
  exercise_distance_meters INTEGER, -- for distance-based exercises like jogging
  exercise_speed_kmh NUMERIC, -- for speed tracking
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own data
ALTER TABLE public.exercise_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for exercise_sessions
CREATE POLICY "Users can view their own exercise sessions" 
  ON public.exercise_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise sessions" 
  ON public.exercise_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise sessions" 
  ON public.exercise_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise sessions" 
  ON public.exercise_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for exercise_entries
CREATE POLICY "Users can view their own exercise entries" 
  ON public.exercise_entries 
  FOR SELECT 
  USING (auth.uid() = (SELECT user_id FROM public.exercise_sessions WHERE id = session_id));

CREATE POLICY "Users can create their own exercise entries" 
  ON public.exercise_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.exercise_sessions WHERE id = session_id));

CREATE POLICY "Users can update their own exercise entries" 
  ON public.exercise_entries 
  FOR UPDATE 
  USING (auth.uid() = (SELECT user_id FROM public.exercise_sessions WHERE id = session_id));

CREATE POLICY "Users can delete their own exercise entries" 
  ON public.exercise_entries 
  FOR DELETE 
  USING (auth.uid() = (SELECT user_id FROM public.exercise_sessions WHERE id = session_id));

-- Create indexes for better performance
CREATE INDEX idx_exercise_sessions_user_id ON public.exercise_sessions(user_id);
CREATE INDEX idx_exercise_sessions_date ON public.exercise_sessions(session_date);
CREATE INDEX idx_exercise_entries_session_id ON public.exercise_entries(session_id);
CREATE INDEX idx_exercise_entries_type ON public.exercise_entries(exercise_type);
