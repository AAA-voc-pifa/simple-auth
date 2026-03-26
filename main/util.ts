export
function is_str(val: unknown): val is string {
	return typeof(val) === 'string'
}
export
function is_email(email: string): boolean {
	const re = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
	return re.test(email)
}

export
type I_result<E, D>
	= { ok: false, error: E }
	| { ok: true, data: D }
