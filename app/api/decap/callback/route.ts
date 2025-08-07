import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const cookieState = getCookie(req, "decap_oauth_state")

  if (!code || !state || !cookieState || cookieState !== state) {
    return new NextResponse("Estado inválido en OAuth", { status: 400 })
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return new NextResponse("Faltan GITHUB_CLIENT_ID/SECRET", { status: 500 })
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${url.origin}/api/decap/callback`,
    }),
  })

  if (!tokenRes.ok) {
    const text = await tokenRes.text()
    return new NextResponse(`Error al obtener token: ${text}`, { status: 500 })
  }
  const data = (await tokenRes.json()) as { access_token?: string }

  const html = `<!doctype html><html><body><script>
  (function(){
    function send(m){ try{ window.opener && window.opener.postMessage(m, "*"); }catch(e){} }
    send('authorizing:github');
    var t=${JSON.stringify(data.access_token || "")};
    if(t){ send('authorization:github:'+t); } else { send('authorization:github:error'); }
    window.close();
  })();</script></body></html>`

  const res = new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } })
  res.cookies.set("decap_oauth_state", "", { expires: new Date(0), path: "/api/decap" })
  return res
}

function getCookie(req: Request, name: string) {
  const cookie = req.headers.get("cookie")
  if (!cookie) return null
  const match = cookie.split(";").map(v => v.trim()).find(v => v.startsWith(name + "="))
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null
}
