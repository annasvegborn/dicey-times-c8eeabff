// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rbvjljlzluxaewijczin.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJidmpsamx6bHV4YWV3aWpjemluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNzY2MDYsImV4cCI6MjA2MzY1MjYwNn0.owpXrPyDEk6275DQA7fkIoQVGbLecHYjAoTv-DJV0Jg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);