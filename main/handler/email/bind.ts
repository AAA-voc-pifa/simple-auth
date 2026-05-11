import { is_email, is_real_str } from '@ppz/ppz'
import { error_json, success_json } from '#service/http-util/respond.ts'
import * as email_service from '#service/email/mod.ts'
import { read_body, I_json_body } from '#service/http-util/json.ts'
import { get_userid } from '#service/session.ts'

function format_body(raw: I_json_body): raw is { email: string; code: string } {
	if (raw instanceof Array) return false
	return is_real_str(raw.email)
		&& is_email(raw.email)
		&& is_real_str(raw.code)
		&& raw.code.length === 6
}

export
async function bind_email(req: Request): Promise<Response> {
	const user_id = await get_userid(req)
	const body = await read_body(req, format_body)
	const result = await email_service.bind_email(user_id, body.email, body.code)
	if (!result.ok)
		return error_json(result.error)
	return success_json()
}
