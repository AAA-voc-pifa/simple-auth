import { send_authcode } from './handler/email/send.ts'
import { login_with_email } from './handler/email/login.ts'

Deno.serve(async req => {
	const url = new URL(req.url)
	try {
		switch (url.pathname) {
			case '/send-authcode':
				return await send_authcode(url, req)
			case '/login/email':
				return await login_with_email(req)
			default:
				return new Response('what are you doing?', { status: 404 })
		}
	} catch (error) {
		if (error instanceof Response)
			return error
		console.error('unexpected error on', url.pathname)
		console.error(error)
		return new Response('unexpected error', { status: 500 })
	}
})
