import * as email_service from '../service/email.ts'
import { error_json, success_json } from '../respond.ts'

function is_email(email: string): boolean {
	const re = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
	return re.test(email)
}

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
