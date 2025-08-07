import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import type { PostMeta } from "@/lib/content"

export default function PostCard({ post }: { post: PostMeta }) {
  const href = post.category === "blog" ? `/blog/${post.slug}` : `/noticias/${post.slug}`
  const dateStr = new Date(post.date).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {post.featuredImage ? (
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={post.featuredImage || "/placeholder.svg"}
            alt={`Imagen de ${post.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : null}
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">{post.category === "blog" ? "Blog" : "Noticias"}</div>
        <h3 className="text-lg font-semibold leading-snug mt-1">
          <Link href={href} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{dateStr} · {post.author}</p>
        {post.excerpt ? <p className="text-sm mt-3 text-foreground/90 line-clamp-3">{post.excerpt}</p> : null}
        <div className="mt-4">
          <Link href={href} className="text-primary hover:underline text-sm">Leer más →</Link>
        </div>
      </CardContent>
    </Card>
  )
}
