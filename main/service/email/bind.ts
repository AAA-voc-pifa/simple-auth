import type { I_async_result } from '@ppz/ppz'
import {
	bind_email_to_user,
	verify_authcode,
	get_user_by_id,
	get_user_by_email,
} from '#service/pg/mod.ts'


export
async function can_bind(user_id: string, email: string): Promise<string | null> {
	const user = await get_user_by_id(user_id)
	if (user.email !== null)
		return 'already has an email'
	if (await get_user_by_email(email))
		return 'email occupied'
	return null
}

export
async function bind_email(
	user_id: string, email: string, authcode: string
): I_async_result<
	null,
	| 'too many wrong attempts'
	| 'verification failed'
	| 'email occupied or already has an email'
> {
	const verified = await verify_authcode(email, 'bind', authcode)
	if (!verified.ok) {
		console.error(`Failed to bind email(${email}) for user(${user_id}).`, verified.error)
		return {
			ok: false,
			error: verified.error.key === 'wrong authcode' && verified.error.attempt_count >= 3
				? 'too many wrong attempts'
				: 'verification failed',
		}
	}

	const updated = await bind_email_to_user(user_id, email)
	if (!updated)
		return { ok: false, error: 'email occupied or already has an email' }

	return { ok: true, value: null }
}