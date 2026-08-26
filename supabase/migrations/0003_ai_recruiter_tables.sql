-- Migration to add AI Recruiter tables for Evaluations and Assessments

CREATE TABLE IF NOT EXISTS public.ai_evaluations (
  id uuid primary key default gen_random_uuid(),
  candidate_name text not null,
  job_title text not null,
  verdict text not null,
  overall_score integer not null,
  skills_score integer not null,
  experience_score integer not null,
  culture_score integer not null,
  integrity_score integer not null,
  summary text not null,
  strengths jsonb default '[]'::jsonb,
  matched_skills jsonb default '[]'::jsonb,
  red_flags jsonb default '[]'::jsonb,
  missing_skills jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now()
);

CREATE TABLE IF NOT EXISTS public.ai_assessments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  seniority text not null,
  duration_minutes integer not null,
  questions jsonb not null,
  created_at timestamp with time zone default now()
);
