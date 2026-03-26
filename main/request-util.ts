import { bad_request } from './response-util.ts'

export
async function parse_json(req: Request) {
	let body: unknown
	try {
		body = await req.json()
	} catch {
		throw bad_request('failed to parse body')
	}
	if (typeof body !== 'object' || body === null)
		throw bad_request('invalid body')
	return body
}
