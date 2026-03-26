import { Client } from '@db/postgres'
import { postgres_url } from './env.ts'

const client = new Client(postgres_url)

export
async function upsert_authcode(email: string, code: string) {
	// 1. 插入新记录
	// 2. （如果插入失败）更新 1 分钟以前的记录
	const result = await client.queryObject(`
		insert into authcode (email, code, send_at)
			values ($1, $2, now())
		on conflict (email) do
			update set code = excluded.code, send_at = excluded.send_at
				where authcode.send_at < now() - interval '2 minutes'
	`, [email, code])

	switch (result.rowCount) {
		case 0: {
			// rowCount 为 0  =>  “插入失败”且“老数据处于 1 分钟以内”
			// 此时返回“下次发送，需要等多久（秒）”
			const next_send = await client.queryObject(`
				SELECT
					EXTRACT(EPOCH FROM (send_at + interval '2 minutes' - now()))
				FROM authcode
				WHERE email = $1;
			`, [email])
			return Number((next_send.rows[0] as { extract: string }).extract)
		}
		case 1:
			return null
		default:
			throw new Error('unexpected sql at upsert_authcode')
	}
}

export
async function verify_authcode_and_delete(email: string, code: string): Promise<boolean> {
	const result = await client.queryObject(`
		delete from authcode
			where email = $1 and code = $2 and send_at > now() - interval '2 minutes'
	`, [email, code])
	switch (result.rowCount) {
		case 0:
			return false
		case 1:
			return true
		default:
			throw new Error('unexpected sql query result at verify_authcode')
	}
}

export
interface I_user {
	id: string
	email: string
	create_at: Date
	update_at: Date
}
export
async function get_or_create_user(email: string): Promise<I_user & { is_new: boolean }> {
	const result = await client.queryObject(`
		insert into "user" (email) values ($1)
			on conflict (email) do
			update set email = excluded.email
		returning *, (xmax = 0) as is_new
	`, [email])

	if (result.rowCount === 1)
			return result.rows[0] as I_user & { is_new: boolean }

	console.error(result)
	throw new Error('unexpected sql query result at get_user_by_email')
}
