import kvgindex from '../../kanjivg/kvg-index.json'

function notFound(body = "Not Found") {
	return new Response(body, { status: 404 })
}

export function onRequest({request, params}) {
	console.log(request)
	const char = params.char
	if(!char) return notFound()
	
	const decodedChar = decodeURIComponent(char)
	if(!decodedChar) return notFound()
	
	const files = kvgindex[decodedChar]
	if(!files || !files.length) return notFound()
	
	const file = files.findLast((name) => !name.includes("-")) || files.at(-1)
	if(!file) return notFound()
	
	const url = new URL(request.url)
	const newPath = `${url.origin}/k/${file}`
	return Response.redirect(newPath, 301);
}
