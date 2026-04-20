create extension if not exists citext;

create table "authcode" (
	email citext primary key,
	code_hash text not null,
	send_at timestamptz not null,
	attempt_count int not null default 0
);

create table "user" (
	id uuid primary key default gen_random_uuid(),
	create_at timestamptz not null default now(),
	update_at timestamptz not null default now()
);

create table "login_by_email" (
	email citext primary key,
	user_id uuid not null unique references "user" on delete restrict,
	create_at timestamptz not null default now()
);

create type "oauth_provider" as enum ('github');
create table "login_by_oauth" (
	oauth_id text,
	provider "oauth_provider",
	user_id uuid not null references "user" on delete restrict,
	create_at timestamptz not null default now(),
	primary key (oauth_id, provider),
	unique (user_id, provider)
);
