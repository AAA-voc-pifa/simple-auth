import type { I_async_result } from '@ppz/ppz'
import { unbind_email_from_user, verify_authcode } from '#service/pg/mod.ts'

export
async function unbind_email(
	user_id: string, email: string, authcode: string
): I_async_result<
	null,
	| 'too many wrong attempts'
	| 'verification failed'
> {
	const verified = await verify_authcode(email, 'unbind', authcode)
	if (!verified.ok) {
		console.error(`Failed to unbind email(${email}) for user(${user_id}).`, verified.error)
		return {
			ok: false,
			error: verified.error.key === 'wrong authcode' && verified.error.attempt_count >= 3
				? 'too many wrong attempts'
				: 'verification failed',
		}
	}

	await unbind_email_from_user(user_id, email)
	return { ok: true, value: null }
}