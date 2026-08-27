-- Migration to add hotlist and shortlist tracking columns to resumes table

ALTER TABLE public.resumes
  ADD COLUMN IF NOT EXISTS is_hotlisted boolean default false,
  ADD COLUMN IF NOT EXISTS hotlist_notes text,
  ADD COLUMN IF NOT EXISTS is_shortlisted boolean default false,
  ADD COLUMN IF NOT EXISTS status text default 'new';
