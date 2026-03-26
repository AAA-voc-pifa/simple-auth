create table "authcode" (
	email text primary key,
	code text not null,
	send_at timestamptz not null
);

create table "user" (
	id uuid primary key default gen_random_uuid(),
	email text not null unique,
	create_at timestamptz not null default now(),
	update_at timestamptz not null default now()
);
