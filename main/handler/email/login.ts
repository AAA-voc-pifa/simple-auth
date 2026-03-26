import { bad_request, success_json } from '#/respond.ts'
import { is_email, is_str } from '#/util.ts'
import * as email_service from '#/service/email.ts'

async function read_body(req: Request) {
	let body: { email: string, code: string }
	try {
		body = await req.json()
	} catch {
		throw bad_request('failed to parse body')
	}
	if (is_str(body.email) && is_email(body.email) && is_str(body.code) && body.code.length === 6)
		return body
	throw bad_request('invalid body')
}

export
async function login_with_email(req: Request): Promise<Response> {
	const body = await read_body(req)
	const session_token = await email_service.login(body.email, body.code)
	return success_json(session_token)
}
