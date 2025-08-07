import Link from "next/link"
import PostCard from "@/components/post-card"
import WhatsappShare from "@/components/whatsapp-share"
import { getLatestPosts } from "@/lib/content"

export default async function Page() {
  let latest = await getLatestPosts(6).catch(() => []) as unknown
  if (!Array.isArray(latest)) latest = []

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full">
      <section className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold">Boletín Interno</h1>
        <p className="mt-2 text-muted-foreground">Encuentra aquí las últimas publicaciones de Blog y Noticias.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/blog" className="inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">Ir al Blog</Link>
          <Link href="/noticias" className="inline-flex rounded-md border px-4 py-2 hover:bg-muted">Ver Noticias</Link>
          <WhatsappShare />
          {/* Acceso directo para crear contenido desde la web */}
          <Link href="/admin/" className="inline-flex rounded-md border px-4 py-2 hover:bg-muted">
            Crear contenido
          </Link>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 pb-10">
        <h2 className="mb-4 text-2xl font-semibold">Últimas publicaciones</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <PostCard key={`${post.category}-${post.slug}`} post={post} />
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-4 text-2xl font-semibold">¿Tienes sugerencias?</h2>
        <p className="mb-3 text-muted-foreground">Envíanos tus ideas y comentarios mediante el siguiente formulario.</p>
        <div className="rounded-xl border">
          {/* Reemplaza el src con el enlace embebido de tu Google Forms */}
          <iframe
            title="Formulario de sugerencias"
            src="https://docs.google.com/forms/d/e/TU_FORM_ID/viewform?embedded=true"
            className="w-full h-[900px]"
          >
            Cargando…
          </iframe>
        </div>
      </section>
    </main>
  )
}
