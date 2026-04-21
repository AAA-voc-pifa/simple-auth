import { type JWTPayload, jwtVerify, SignJWT } from '@panva/jose'
import type { I_async_result, I_result_error_with_key } from '@ppz/ppz'
import { tmp_session_duration__s } from './const.ts'

const secret_str = Deno.env.get('tmp_session_secret')
if (secret_str === undefined || secret_str.length !== 32)
	throw new Error('tmp_session_secret is invalid')
const secret = new TextEncoder().encode(secret_str)

export
function create_jwt(tmp_session: JWTPayload) {
	return new SignJWT(tmp_session)
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime(Date.now() / 1000 + tmp_session_duration__s)
		.setIssuedAt()
		.sign(secret)
}

export
async function verify_jwt(jwt: string): I_async_result<JWTPayload, I_result_error_with_key<'invalid jwt'>> {
	try {
		const { payload } = await jwtVerify(jwt, secret)
		return { ok: true, value: payload }
	} catch (error) {
		return {
			ok: false,
			error: {
				key: 'invalid jwt',
				error,
			},
		}
	}
}
