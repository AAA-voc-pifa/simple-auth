import { encodeBase64 } from '@std/encoding'

const cont = new Uint8Array(32)
crypto.getRandomValues(cont)
const secret = encodeBase64(cont)
console.log(secret)
