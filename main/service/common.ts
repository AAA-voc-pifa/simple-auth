export
type I_authcode_type = 'bind' | 'login'

export
interface I_session {
	id: string
	expire_at: Date
}
