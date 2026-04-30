create extension if not exists citext;

create type "authcode_type" as enum ('bind', 'login');
create table "authcode" (
	email citext primary key,
	code_type "authcode_type" not null,
	code_hash text not null, -- 在业务层做 hash
	send_at timestamptz not null, -- 在业务层设置“有效期”，计算出“过期时间”
	attempt_count int not null default 0 -- 在业务层限制“尝试次数”
);

create table "user" (
	id uuid primary key,
	email citext unique,
	create_at timestamptz not null default now(),
	update_at timestamptz not null default now()
);

create table "session" (
	id uuid primary key,
	user_id uuid not null references "user" on delete restrict,
	create_at timestamptz not null default now(),
	expire_at timestamptz not null
);

create type "oauth_provider" as enum ('github', 'google');
create table "login_by_oauth" (
	oauth_id text,
	provider "oauth_provider",
	user_id uuid not null references "user" on delete restrict,
	create_at timestamptz not null default now(),
	primary key (oauth_id, provider),
	unique (user_id, provider)
);
