import { is_email } from '@ppz/ppz'
import * as email_service from '#service/email/mod.ts'
import { error_json, success_json } from '#service/respond-util.ts'

export
async function send_authcode(url: URL, _: Request): Promise<Response> {
	const email = url.searchParams.get('email')
	if (email === null || !is_email(email))
		return new Response('invalid email', { status: 400 })

	const last_send_at = await email_service.send_authcode('login', email)
	if (last_send_at !== null)
		return error_json('too many requests', last_send_at)
	return success_json()
}
