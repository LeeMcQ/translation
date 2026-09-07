create table if not exists services (
  id text primary key,
  code text not null unique,
  hashtag text not null,
  title text not null default 'Sabbath service',
  host_token text not null,
  status text not null default 'live',
  listener_count integer not null default 0,
  partial_source text,
  partial_translated text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  last_activity_at timestamptz not null default now()
);

create unique index if not exists services_code_idx on services (code);

create table if not exists transcript_lines (
  id text primary key,
  service_id text not null references services(id) on delete cascade,
  seq integer not null,
  source_text text not null,
  translated_text text not null,
  was_filtered boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists transcript_lines_service_seq_idx
  on transcript_lines (service_id, seq);
