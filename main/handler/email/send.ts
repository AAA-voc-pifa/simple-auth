import { is_email, is_real_str } from '@ppz/ppz'
import type { I_authcode_type } from '#service/common.ts'
import * as email_service from '#service/email/mod.ts'
import { error_json, success_json } from '#service/http-util/respond.ts'
import { read_body, I_json_body } from '#service/http-util/json.ts'
import { get_userid } from '#service/session.ts'

function format_body(raw: I_json_body): raw is { email: string; type: I_authcode_type } {
	if (raw instanceof Array) return false
	return is_real_str(raw.email) && is_email(raw.email)
		&& (raw.type === 'login' || raw.type === 'bind')
}

export
async function send_authcode(req: Request): Promise<Response> {
	const { email, type } = await read_body(req, format_body)

	if (type === 'bind') {
		const user_id = await get_userid(req)
		const error = await email_service.can_bind(user_id, email)
		if (error !== null)
			return error_json(error)
	}

	const last_send_at = await email_service.send_authcode(type, email)
	if (last_send_at !== null)
		return error_json('too many requests', last_send_at)
	return success_json()
}
