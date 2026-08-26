CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  role text check (role in ('Super Admin', 'Admin', 'Recruiter', 'HR', 'Manager', 'Sales', 'Viewer')) default 'Viewer',
  avatar text,
  designation text,
  department text,
  status text default 'active',
  timezone text,
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);
