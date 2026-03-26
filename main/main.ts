import { send_authcode } from './handler/email/send.ts'

Deno.serve(async req => {
	const url = new URL(req.url)
	try {
		switch (url.pathname) {
			case '/send-authcode':
				return await send_authcode(url, req)
			default:
				return new Response('what are you doing?', { status: 404 })
		}
	} catch (error) {
		console.error('unexpected error on', url.pathname)
		console.error(error)
		return new Response('unexpected error', { status: 500 })
	}
})
