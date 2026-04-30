import { setCookie } from '@std/http/cookie'
import { is_email, is_real_str } from '@ppz/ppz'
import { error_json, success_json, bad_request } from '#service/respond-util.ts'
import * as email_service from '#service/email/mod.ts'
import { mode, session_domain } from '#service/env.ts'

async function read_body(req: Request) {
	const { email, code } = await req.json() as { email: unknown, code: unknown }
	if (is_real_str(email) && is_email(email) && is_real_str(code) && code.length === 6)
		return { email, code }
	throw bad_request('invalid body')
}

export
async function login_with_email(req: Request): Promise<Response> {
	const body = await read_body(req)
	const result = await email_service.login(body.email, body.code)
	if (!result.ok)
		return error_json(result.error)
	const response = success_json()
	setCookie(response.headers, {
		name: 'session',
		value: result.value.id,
		expires: result.value.expire_at,
		domain: session_domain,
		path: '/',
		httpOnly: true,
		secure: mode === 'production',
		sameSite: 'Lax', // 用户从别的网站跳转进来时，允许携带 cookie
	})
	return response
}
