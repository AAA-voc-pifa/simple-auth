import * as email_service from '../service/email.ts'
import { error_json, success_json } from '../respond.ts'
import { is_email } from '../util.ts'

export
async function send_authcode(url: URL, _: Request): Promise<Response> {
	const email = url.searchParams.get('email')
	if (email === null || !is_email(email))
		return new Response('invalid email', { status: 400 })

	const next_send = await email_service.send_authcode(email)
	if (next_send !== null)
		return error_json('too many requests', { next_send })
	return success_json()
}
