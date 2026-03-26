function json(body: unknown) {
	return new Response(
		JSON.stringify(body),
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	)
}

export
function success_json(data?: unknown) {
	return json({
		error: null,
		data,
	})
}

export
function error_json(error: string, data?: unknown) {
	return json({
		error,
		data,
	})
}

export
function bad_request(msg: string) {
	return new Response(msg, { status: 400 })
}
