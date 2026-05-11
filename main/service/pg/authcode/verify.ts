import type { I_async_result } from '@ppz/ppz'
import type { I_authcode_type } from '#service/common.ts'
import { hash_authcode } from './hash.ts'
import { client, get_now } from '../pg.ts'

export
type I_authcode_verification_error
	= { key: 'wrong authcode', attempt_count: number }
	| { key: 'invalid verification' }

export
async function verify_authcode(
	email: string, type: I_authcode_type, code: string
): I_async_result<null, I_authcode_verification_error> {
	const two_min_ago = (await get_now()).offset(-2 * 60)
	const code_hash = await hash_authcode(code)
	const result = await client.queryObject(`
			delete from authcode
				where email = $1
				and code_type = $2
				and send_at > $3
				and attempt_count < 3
				and code_hash = $4
	`, [email, type, two_min_ago, code_hash])
	switch (result.rowCount) {
		case 1:
			// 删成了：验证成功
			return { ok: true, value: null }
		case 0: {
			// 没删成
			const attempt_count_result = await client.queryObject<{ attempt_count: number }>(`
				update authcode
					set attempt_count = attempt_count + 1
				where email = $1
				and code_type = $2
				and send_at > $3
				returning attempt_count
			`, [email, type, two_min_ago])
			if (attempt_count_result.rowCount === 1)
				// 验证码存在，但输入错误
				return {
					ok: false,
					error: {
						key: 'wrong authcode',
						attempt_count: attempt_count_result.rows[0].attempt_count,
					}
				}
			else
				// 验证码不存在，或已过期，或尝试次数过多
				return { ok: false, error: {
					key: 'invalid verification',
				}}
		}
		default:
			throw new Error('unexpected sql query result at verify_authcode')
	}
}
