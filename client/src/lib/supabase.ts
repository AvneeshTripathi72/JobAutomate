import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yeoavqufxojhraycowtu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllb2F2cXVmeG9qaHJheWNvd3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDUzMTgsImV4cCI6MjA5OTA4MTMxOH0.jekm_OLbakb_VHMebV04XnczMW9sxrIonCLI4XAlyPQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

