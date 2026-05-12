import { client } from './pg.ts'

export
async function get_user_id_by_session(session_id: string): Promise<string | null> {
	const result = await client.queryObject<{ user_id: string }>(`
		select user_id from "session"
		where id = $1 and expire_at > now()
	`, [session_id])
	if (result.rowCount !== 1)
		return null
	return result.rows[0].user_id
}
