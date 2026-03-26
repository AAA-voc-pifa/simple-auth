export
const postgres_url = Deno.env.get('postgres_url')
if (!postgres_url)
	throw new Error('postgres_url is not set')

export
const resend_apikey = Deno.env.get('resend_apikey')
if (!resend_apikey)
	throw new Error('resend_apikey is not set')

export
const email_from = Deno.env.get('email_from')
if (!email_from)
	throw new Error('email_from is not set')

export
const redis_username = Deno.env.get('redis_username')
if (!redis_username)
	throw new Error('redis_username is not set')

export
const redis_password = Deno.env.get('redis_password')
if (!redis_password)
	throw new Error('redis_password is not set')

export
const redis_host = Deno.env.get('redis_host')
if (!redis_host)
	throw new Error('redis_host is not set')

const _redis_port_str = Deno.env.get('redis_port')
if (!_redis_port_str)
	throw new Error('redis_port is not set')
export
const redis_port = Number(_redis_port_str)
