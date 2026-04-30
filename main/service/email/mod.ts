import type { I_async_result } from '@ppz/ppz'
import { Resend } from 'resend'
import { email_from, resend_apikey } from '#service/env.ts'
import type { I_authcode_type, I_session } from '#service/common.ts'
import { upsert_authcode, verify_authcode, login_or_register_by_email } from '#service/pg/mod.ts'

const resend = new Resend(resend_apikey)

// 生成 6 位随机数
function generate_authcode(): string {
	const range = 1_000_000 // 0..999999
	const max_exclusive = 0x1_0000_0000 // 16**8 = 2**32
	const limit = max_exclusive - (max_exclusive % range)
	const buf = new Uint32Array(1) // 2**19 < 999999 < 2**20
	while (true) {
		crypto.getRandomValues(buf)
		const x = buf[0]
		if (x < limit)
			return String(x % range).padStart(6, '0')
	}
}

export
async function send_authcode(type: I_authcode_type, email: string): Promise<Date | null> {
	const authcode = generate_authcode()
	const last_send_at = await upsert_authcode(email, type, authcode)
	if (last_send_at !== null)
		return last_send_at

	const res = await resend.emails.send({
		from: `Simple Auth <${email_from}>`,
		to: email,
		subject: 'Simple Auth - Auth Code',
		html: `Your auth code for ${type}ing is <b>${authcode}</b>.`,
	})
	if (res.error) {
		console.error('failed to send authcode email', res.error)
		throw new Error('failed to send authcode email')
	}
	return null
}

export
async function login(
	email: string, authcode: string
): I_async_result<I_session, 'too many wrong attempts' | 'verification failed'> {
	const verified = await verify_authcode(email, 'login', authcode)
	if (!verified.ok) {
		console.error(`Failed to login with email(${email}). ${verified.error}`)
		return {
			ok: false,
			error: verified.error.key === 'wrong authcode' && verified.error.attempt_count >= 3
				? 'too many wrong attempts'
				: 'verification failed'
		}
	}

	return {
		ok: true,
		value: await login_or_register_by_email(email),
	}
}
