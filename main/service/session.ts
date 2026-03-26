import { createClient } from 'redis'
import { redis_username, redis_password, redis_host, redis_port } from './env.ts'

const client = createClient({
	username: redis_username,
	password: redis_password,
	socket: {
		host: redis_host,
		port: redis_port,
	}
})

client.on('error', err => console.error('Redis Client Error', err))
await client.connect()

export
async function new_session(uuid: string) {
	const session_token = crypto.randomUUID()
	await client.set(session_token, uuid, { EX: 60 * 60 * 24 * 7 })
	return session_token
}

export
async function get_session(session_token: string) {
	return await client.get(session_token)
}
