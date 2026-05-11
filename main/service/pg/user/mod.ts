import { client } from '../pg.ts'
import type { I_user } from '#service/common.ts'

export
async function get_user(id: string): Promise<I_user | null> {
	const r = await client.queryObject<I_user>(
		`select * from "user" where id = $1`,
		[id],
	)
	return r.rows[0] ?? null
}

export
async function get_user_by_email(email: string): Promise<I_user | null> {
	const r = await client.queryObject<I_user>(
		`select * from "user" where email = $1`,
		[email],
	)
	return r.rows[0] ?? null
}

export
async function bind_email_to_user(user_id: string, email: string): Promise<boolean> {
	const result = await client.queryObject(`
		update "user"
		set email = $2, update_at = now()
		where id = $1 and email is null
		and not exists (select 1 from "user" where email = $2)
		returning id
	`, [user_id, email])
	return result.rowCount === 1
}
