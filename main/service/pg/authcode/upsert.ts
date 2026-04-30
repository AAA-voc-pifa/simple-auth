import type { I_authcode_type } from '#service/common.ts'
import { hash_authcode } from './hash.ts'
import { client, get_now } from '../pg.ts'

export
async function upsert_authcode(
	email: string, type: I_authcode_type, code: string
): Promise<Date | null> {
	const now = await get_now()
	const code_hash = await hash_authcode(code)
	// 1. 插入新记录
	// 2. （如果插入失败）更新 1 分钟以前的记录
	const result = await client.queryObject(`
		insert into authcode (email, code_type, code_hash, send_at, attempt_count)
			values ($1, $2, $3, $4, 0)
		on conflict (email) do
			update set
				code_type = excluded.code_type,
				code_hash = excluded.code_hash,
				attempt_count = excluded.attempt_count,
				send_at = excluded.send_at
			where authcode.send_at < $5
	`, [email, type, code_hash, now.value, now.offset(-60)])

	switch (result.rowCount) {
		case 0: {
			// rowCount 为 0  =>  “插入失败”且“老数据处于 1 分钟以内”
			const send_at_result = await client.queryObject<{
				send_at: Date
			}>(`
				select send_at from authcode where email = $1
			`, [email, type])
			return send_at_result.rows[0].send_at
		}
		case 1:
			return null
		default:
			throw new Error('unexpected sql at upsert_authcode')
	}
}
