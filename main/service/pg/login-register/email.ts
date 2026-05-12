import { assert } from '@std/assert'
import type { I_session } from '#service/common.ts'
import { client } from '../pg.ts'

export
async function login_or_register_by_email(email: string): Promise<I_session> {
	const insert_result = await client.queryObject(`
		insert into "user" (id, email) values ($1, $2)
		on conflict (email) do nothing
		returning id
	`, [crypto.randomUUID(), email])
	if (insert_result.rowCount === 1) {
		const user_id = (insert_result.rows[0] as { id: string }).id
		return new_session(user_id)
	}
	const q_result = await client.queryObject<{ id: string }>(`
		select id from "user" where email = $1
	`, [email])
	const new_user = q_result.rows[0]
	assert(new_user !== undefined)
	return await new_session(new_user.id)
}

async function new_session(user_id: string): Promise<I_session> {
	const session_id = crypto.randomUUID()
	const result = await client.queryObject<I_session>(`
		insert into "session" (id, user_id, expire_at)
		values ($1, $2, now() + interval '7 days')
		returning id, expire_at
	`, [session_id, user_id])
	if (result.rowCount !== 1) {
		console.error('error on creating session', result)
		throw new Error('Failed to create session')
	}
	return result.rows[0]
}
