import { Resend } from 'resend'
import { new_session } from './session.ts'
import { email_from, resend_apikey } from './env.ts'
import { get_or_create_user, upsert_authcode, verify_authcode_and_delete } from './pg.ts'
import type { I_result } from '#/util.ts'

const resend = new Resend(resend_apikey)

// 生成 6 位随机数
function generate_authcode(): string {
	const range = 1_000_000 // 0..999999
	const max_exclusive = 0x1_0000_0000 // 2^32
	const limit = max_exclusive - (max_exclusive % range)
	const buf = new Uint32Array(1)
	while (true) {
		crypto.getRandomValues(buf)
		const x = buf[0]
		if (x < limit)
			return String(x % range).padStart(6, '0')
	}
}

export
async function send_authcode(email: string) {
	const authcode = generate_authcode()
	const next_send = await upsert_authcode(email, authcode)
	if (typeof(next_send) === 'number')
		return next_send
	const res = await resend.emails.send({
		from: `皮皮仔 <${email_from}>`,
		to: email,
		subject: 'Simple Auth - Auth Code',
		html: `Your auth code is <b>${authcode}</b>`,
	})
	if (res.error) {
		console.error('failed to send authcode email', res.error)
		throw new Error('failed to send authcode email')
	}
}

export
async function login(email: string, authcode: string): Promise<I_result<'invalid authcode', string>> {
	const verified = await verify_authcode_and_delete(email, authcode)
	if (!verified)
		return { ok: false, error: 'invalid authcode' }
	const user = await get_or_create_user(email)
	return {
		ok: true,
		data: await new_session(user.id),
	}
}
