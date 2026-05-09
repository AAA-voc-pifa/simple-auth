import { setCookie } from '@std/http/cookie'
import { is_email, is_real_str } from '@ppz/ppz'
import { error_json, success_json } from '#service/http-util/respond.ts'
import * as email_service from '#service/email/mod.ts'
import { mode, session_domain } from '#service/env.ts'
import { read_body, I_json_body } from '#service/http-util/json.ts'

function format_body(raw: I_json_body): raw is { email: string; code: string } {
	if (raw instanceof Array) return false
	return is_real_str(raw.email)
		&& is_email(raw.email)
		&& is_real_str(raw.code)
		&& raw.code.length === 6
}

export
async function login_with_email(req: Request): Promise<Response> {
	const body = await read_body(req, format_body)
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
