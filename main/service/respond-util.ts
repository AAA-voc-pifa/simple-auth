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

/** 错误时，响应码默认 200，这是故意为之。
 * 以表示“业务没问题”。
 * 错误可能是用户输入错误、页面未刷新导致，总之非程序错误。
 */
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
