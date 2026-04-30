import { the_secret } from '../../env.ts'
import { encodeBase64 } from '@std/encoding'

const secret = await crypto.subtle.importKey(
	'raw',
	new TextEncoder().encode(the_secret),
	'hmac',
	false,
	['sign'],
)

export
async function hash_authcode(authcode: string) {
	const authcode_buf = new TextEncoder().encode(authcode)
	const hash = await crypto.subtle.sign('hmac', secret, authcode_buf)
	return encodeBase64(hash)
}
