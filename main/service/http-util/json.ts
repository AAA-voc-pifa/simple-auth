import { receive_json, I_json_obj, I_json_array } from '@ppz/ppz'
import { bad_request } from './respond.ts'

export
type I_json_body = I_json_obj | I_json_array

export
async function read_body<T extends I_json_body>(
	req: Request,
	validate: (body: I_json_body) => body is T,
): Promise<T> {
	const result = await receive_json(req)
	if (!result.ok) {
		console.error('invalid json body in request', result.error)
		throw bad_request()
	}
	const body = result.value
	if (validate(body))
		return body
	console.error('invalid json body in request, format error')
	throw bad_request()
}
