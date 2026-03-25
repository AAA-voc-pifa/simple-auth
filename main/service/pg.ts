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
				where authcode.send_at < now() - interval '1 minute'
	`, [email, code])

	switch (result.rowCount) {
		case 0: {
			// rowCount 为 0  =>  “插入失败”且“老数据处于 1 分钟以内”
			// 此时返回“下次发送，需要等多久（秒）”
			const next_send = await client.queryObject(`
				SELECT
					EXTRACT(EPOCH FROM (send_at + interval '60 seconds' - now()))
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
