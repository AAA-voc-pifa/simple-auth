import { send_authcode } from './handler/email/send.ts'
import { login_with_email } from './handler/email/login.ts'
import { bind_email } from './handler/email/bind.ts'
import { unbind_email } from './handler/email/unbind.ts'

Deno.serve(async req => {
	const url = new URL(req.url)
	try {
		switch (url.pathname) {
			case '/send-authcode':
				// TODO: 应该只接受 POST 请求
				return await send_authcode(req)
			case '/login/email':
				return await login_with_email(req)
			case '/bind/email':
				return await bind_email(req)
			case '/unbind/email':
				return await unbind_email(req)
			default:
				return new Response('NoT FoUND', { status: 404 })
		}
	} catch (error) {
		if (error instanceof Response)
			return error
		console.error('unexpected error on', url.pathname)
		console.error(error)
		return new Response('unexpected error', { status: 500 })
	}
})
