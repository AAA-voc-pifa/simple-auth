import { is_email, is_real_str } from '@ppz/ppz'
import * as email_service from '#service/email/mod.ts'
import { bad_request, error_json, success_json } from '#service/http-util/respond.ts'
import { read_body, I_json_body } from '#service/http-util/json.ts'
import { get_userid, get_user } from '#service/session.ts'

type I_send_authcode_body = {
	type: 'bind' | 'login'
	email: string
} | {
	type: 'unbind'
}

function format_body(raw: I_json_body): raw is I_send_authcode_body {
	if (raw instanceof Array)
		return false
	if (raw.type === 'unbind')
		return true
	return is_real_str(raw.email) && is_email(raw.email)
		&& (raw.type === 'login' || raw.type === 'bind')
}

export
async function send_authcode(req: Request): Promise<Response> {
	const body = await read_body(req, format_body)
	let email: string

	if (body.type === 'unbind') {
		const user = await get_user(req)
		if (user.email === null)
			return bad_request()
		email = user.email
	} else {
		email = body.email
		if (body.type === 'bind') {
			const user_id = await get_userid(req)
			const error = await email_service.can_bind(user_id, email)
			if (error !== null)
				return error_json(error)
		}
	}

	const last_send_at = await email_service.send_authcode(body.type, email)
	if (last_send_at !== null)
		return error_json('too many requests', last_send_at)
	return success_json()
}
