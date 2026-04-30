export type I_mode = 'development' | 'production'
export
const mode: I_mode = Deno.env.get('mode') as I_mode
if (!mode)
	throw new Error('ENV Error: mode is not set')
if (mode !== 'development' && mode !== 'production')
	throw new Error('ENV Error: mode is invalid')

export
const session_domain = Deno.env.get('session_domain')

export
const postgres_url = Deno.env.get('postgres_url')
if (!postgres_url)
	throw new Error('ENV Error: postgres_url is not set')

export
const resend_apikey = Deno.env.get('resend_apikey')
if (!resend_apikey)
	throw new Error('ENV Error: resend_apikey is not set')
export
const email_from = Deno.env.get('email_from')
if (!email_from)
	throw new Error('ENV Error: email_from is not set')

export
const the_secret = Deno.env.get('the_secret')
if (!the_secret)
	throw new Error('ENV Error: the_secret is not set')
