import kvgindex from "../../public/kg-index.json"

function notFound(body = "Not Found") {
  return new Response(body, { status: 404 })
}

export function onRequest({ request, params }) {
  console.log(request)
  const char = params.char
  if (!char) return notFound()

  const decodedChar = decodeURIComponent(char)
  if (!decodedChar) return notFound()

  const file = kvgindex[decodedChar]
  if (!file) return notFound()

  const url = new URL(request.url)
  const newPath = `${url.origin}/k/${file}`

  return new Response(null, {
    status: 301,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      Location: newPath,
      "Access-Control-Max-Age": "86400",
    },
  })
}
