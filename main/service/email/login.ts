import type { I_async_result } from '@ppz/ppz'
import type { I_session } from '#service/common.ts'
import { login_or_register_by_email, verify_authcode } from '#service/pg/mod.ts'

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