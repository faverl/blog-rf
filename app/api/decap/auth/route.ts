import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const state = randomUUID()
  const redirectUri = `${url.origin}/api/decap/callback`

  const clientId = process.env.GITHUB_CLIENT_ID
  const scope = process.env.GITHUB_OAUTH_SCOPE || "repo" // usa public_repo si tu repo es público

  if (!clientId) return new NextResponse("Falta GITHUB_CLIENT_ID", { status: 500 })

  const authUrl = new URL("https://github.com/login/oauth/authorize")
  authUrl.searchParams.set("client_id", clientId)
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("scope", scope)
  authUrl.searchParams.set("state", state)

  const res = NextResponse.redirect(authUrl.toString(), 302)
  res.cookies.set("decap_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/decap",
  })
  return res
}
