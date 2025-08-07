import PostCard from "@/components/post-card"
import { getAllPosts } from "@/lib/content"

export const metadata = {
  title: "Noticias — Boletín Interno",
  description: "Noticias internas de la empresa",
}

export default async function NewsIndex() {
  const posts = await getAllPosts("news")
  const list = Array.isArray(posts) ? posts : []
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Noticias</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  )
}
