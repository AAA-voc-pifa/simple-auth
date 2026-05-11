export
type I_authcode_type = 'bind' | 'login'

export
interface I_session {
	id: string
	expire_at: Date
}

export
interface I_user {
	id: string
	email: string | null
	create_at: Date
	update_at: Date
}
