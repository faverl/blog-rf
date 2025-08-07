import { getAllSlugs, getPost } from "@/lib/content"
import Image from "next/image"
import type { Metadata } from "next"

export async function generateStaticParams() {
const slugs = await getAllSlugs("news").catch(() => [] as string[])
return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
const post = await getPost("news", params.slug)
return {
  title: post ? `${post.title} — Noticias` : "Noticias",
  description: post?.excerpt ?? post?.title,
}
}

export default async function NewsPostPage({ params }: { params: { slug: string } }) {
const post = await getPost("news", params.slug)
if (!post) {
  return <div className="container mx-auto max-w-3xl px-4 py-8">Publicación no encontrada.</div>
}
const dateStr = new Date(post.date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
return (
  <main className="container mx-auto max-w-3xl px-4 py-8">
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <header className="not-prose mb-6">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{dateStr} · {post.author}</p>
        {post.featuredImage ? (
          <div className="relative w-full aspect-[16/9] mt-4">
            <Image src={post.featuredImage || "/placeholder.svg"} alt={`Imagen de ${post.title}`} fill className="object-cover rounded-lg" />
          </div>
        ) : null}
      </header>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  </main>
)
}
