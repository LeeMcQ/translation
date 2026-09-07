-- Run this once in the Neon SQL editor for project "woord".

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  hashtag text not null,
  congregation text,
  status text not null default 'live',
  created_at timestamptz not null default now()
);

create table if not exists transcript_lines (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  source_af text not null,
  target_en text not null,
  interim boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists transcript_lines_service_created
  on transcript_lines (service_id, created_at);
