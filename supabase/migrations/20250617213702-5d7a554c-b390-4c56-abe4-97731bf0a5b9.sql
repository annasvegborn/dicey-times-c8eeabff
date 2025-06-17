
-- Create a table for user quest progress
CREATE TABLE public.user_quest_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  quest_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Create a table for individual objective progress
CREATE TABLE public.user_objective_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  quest_id TEXT NOT NULL,
  objective_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id, objective_id)
);

-- Add Row Level Security (RLS) to ensure users can only see their own progress
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_objective_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user_quest_progress
CREATE POLICY "Users can view their own quest progress" 
  ON public.user_quest_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quest progress" 
  ON public.user_quest_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quest progress" 
  ON public.user_quest_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quest progress" 
  ON public.user_quest_progress 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for user_objective_progress
CREATE POLICY "Users can view their own objective progress" 
  ON public.user_objective_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own objective progress" 
  ON public.user_objective_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own objective progress" 
  ON public.user_objective_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own objective progress" 
  ON public.user_objective_progress 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_quest_progress_user_id ON public.user_quest_progress(user_id);
CREATE INDEX idx_user_quest_progress_quest_id ON public.user_quest_progress(quest_id);
CREATE INDEX idx_user_objective_progress_user_id ON public.user_objective_progress(user_id);
CREATE INDEX idx_user_objective_progress_quest_id ON public.user_objective_progress(quest_id);
