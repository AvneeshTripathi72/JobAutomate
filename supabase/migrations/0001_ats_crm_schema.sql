-- Core ATS & CRM Schema Migration

-- Companies
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  plan text default 'starter',
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

-- Jobs
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies on delete cascade not null,
  title text not null,
  location text not null,
  job_type text not null,
  industry text not null,
  description text not null,
  salary text,
  posted_date timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

-- Applications
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies on delete cascade,
  job_id uuid references public.jobs on delete cascade not null,
  applicant_name text not null,
  email text not null,
  phone text,
  resume_url text, -- R2 URL
  cover_letter text,
  status text default 'new',
  notes text,
  source text,
  applied_date timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

-- Clients (CRM)
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies on delete cascade,
  company_name text not null,
  industry text not null,
  city text not null,
  primary_contact_name text not null,
  primary_contact_email text not null,
  primary_contact_phone text,
  account_owner text,
  arr_inr integer default 0,
  notes text,
  status text default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);
