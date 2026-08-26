-- Part 2 ATS & CRM Schema Migration

-- Resumes
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  desired_position text not null,
  years_experience integer not null,
  skills text not null,
  linked_in text,
  additional_info text,
  resume_url text, -- R2 URL
  job_seeker_id uuid references auth.users on delete set null,
  submitted_date timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

-- Interviews
CREATE TABLE IF NOT EXISTS public.interviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies on delete cascade not null,
  application_id uuid references public.applications on delete cascade not null,
  scheduled_at timestamp with time zone not null,
  mode text default 'video',
  interviewer_name text not null,
  interviewer_email text,
  status text default 'scheduled',
  feedback text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

-- Submissions
CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies on delete cascade not null,
  application_id uuid references public.applications on delete cascade not null,
  client_id uuid references public.clients on delete cascade not null,
  owner_user_id uuid references auth.users on delete set null,
  submitted_at timestamp with time zone default now(),
  status text default 'submitted',
  rate_offered_inr integer,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

-- Deals (CRM)
CREATE TABLE IF NOT EXISTS public.deals (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users on delete set null,
  client_id uuid references public.clients on delete cascade not null,
  title text not null,
  stage text default 'qualified',
  value_inr integer default 0,
  positions integer default 1,
  expected_close_date timestamp with time zone,
  owner text default 'Unassigned',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);
