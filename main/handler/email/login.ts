import { error_json, success_json, bad_request } from '#/response-util.ts'
import { is_email, is_real_str } from '@ppz/ppz'
import * as email_service from '#/service/email.ts'

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
	return success_json(result.data)
}
