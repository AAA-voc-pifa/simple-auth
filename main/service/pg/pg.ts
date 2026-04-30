import { Client } from '@db/postgres'
import { postgres_url } from '../env.ts'

export
const client = new Client(postgres_url)

export
async function get_now() {
	const { rows: [{ now }]} = await client.queryObject('select now()') as { rows: { now: Date }[] }
	return {
		value: now,
		offset: (seconds: number) =>
			new Date(now.getTime() + seconds * 1000)
	}
}
