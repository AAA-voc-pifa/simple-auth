create table authcode (
	email text primary key,
	code text not null,
	send_at timestamptz not null
);
