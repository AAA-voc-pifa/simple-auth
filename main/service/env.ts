export
const postgres_url = Deno.env.get('postgres_url')
if (!postgres_url)
	throw new Error('postgres_url is not set')

export
const resend_apikey = Deno.env.get('resend_apikey')
if (!resend_apikey)
	throw new Error('resend_apikey is not set')
