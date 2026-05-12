import { is_real_str } from '@ppz/ppz'
import { bad_request, error_json, success_json } from '#service/http-util/respond.ts'
import * as email_service from '#service/email/mod.ts'
import { read_body, I_json_body } from '#service/http-util/json.ts'
import { get_user } from '#service/session.ts'

function format_body(raw: I_json_body): raw is { code: string } {
	if (raw instanceof Array) return false
	return is_real_str(raw.code)
		&& raw.code.length === 6
}

export
async function unbind_email(req: Request): Promise<Response> {
	const user = await get_user(req)
	if (user.email === null)
		return bad_request()
	const body = await read_body(req, format_body)
	const result = await email_service.unbind_email(user.id, user.email, body.code)
	if (!result.ok)
		return error_json(result.error)
	return success_json()
}
