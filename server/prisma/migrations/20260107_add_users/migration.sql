-- 1) UUID helper (Supabase geralmente já tem, mas deixa seguro)
create extension if not exists "pgcrypto";

-- 2) Tabela de contas
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Coluna de relação no perfil (não obriga ainda)
alter table public.alumni
add column if not exists user_id uuid;

-- 4) 1:1 (vários NULL permitidos)
create unique index if not exists alumni_user_id_key on public.alumni(user_id);

-- 5) FK
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'alumni_user_id_fkey'
  ) then
    alter table public.alumni
    add constraint alumni_user_id_fkey
    foreign key (user_id) references public.users(id) on delete cascade;
  end if;
end $$;
