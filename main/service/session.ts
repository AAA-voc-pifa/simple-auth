import { getCookies } from '@std/http/cookie'
import { get_user_id_by_session, get_user_by_id } from './pg/mod.ts'
import type { I_user } from './common.ts'
import { unauthorized } from './http-util/respond.ts'

export
function get_session_id(req: Request): string | null {
	const session_id = getCookies(req.headers).session
	if (session_id === undefined)
		return null
	return session_id
}

export
async function get_userid(req: Request): Promise<string> {
	const session = get_session_id(req)
	if (session === null)
		throw unauthorized()
	const id = await get_user_id_by_session(session)
	if (id === null)
		throw unauthorized()
	return id
}

export
async function get_user(req: Request): Promise<I_user> {
	const user_id = await get_userid(req)
	return await get_user_by_id(user_id)
}
