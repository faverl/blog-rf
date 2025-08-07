// Librería de contenido robusta para preview y producción
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import { z } from "zod"

export type Category = "blog" | "news"

const PostFrontmatter = z.object({
title: z.string(),
date: z.coerce.date(),
author: z.string(),
featuredImage: z.string().optional(),
excerpt: z.string().optional(),
draft: z.boolean().optional().default(false),
})

export type PostMeta = z.infer<typeof PostFrontmatter> & {
slug: string
category: Category
date: Date
}

export type Post = PostMeta & {
html: string
raw: string
}

const CONTENT_ROOT = path.join(process.cwd(), "content")

function categoryDir(category: Category) {
return path.join(CONTENT_ROOT, category === "blog" ? "blog" : "news")
}

function canUseFs() {
// Disponible en Node (SSR/build); no en edge o cliente ni en runtimes sin fs
return typeof window === "undefined" && typeof process !== "undefined" && !!process.versions?.node
}

async function toHtml(markdown: string) {
const processed = await remark().use(html).process(markdown)
return processed.toString()
}

// En preview, servimos archivos desde /public/content vía rutas relativas
async function fetchIndex(): Promise<Array<{ category: Category; slug: string }>> {
try {
  const res = await fetch("/content/index.json", { cache: "no-store" })
  if (!res.ok) return []
  return await res.json()
} catch {
  return []
}
}

async function fetchMarkdown(category: Category, slug: string): Promise<string | null> {
try {
  const res = await fetch(`/content/${category}/${slug}.md`, { cache: "no-store" })
  if (!res.ok) return null
  return await res.text()
} catch {
  return null
}
}

export async function getPost(category: Category, slug: string): Promise<Post | null> {
// Camino 1: leer de filesystem (build/SSR en Vercel)
if (canUseFs()) {
  try {
    const fs = await import("fs/promises")
    const fullPath = path.join(categoryDir(category), `${slug}.md`)
    const rawFile = await fs.readFile(fullPath, "utf8")
    const { data, content } = matter(rawFile)
    const parsed = PostFrontmatter.parse(data)
    return {
      ...parsed,
      category,
      slug,
      html: await toHtml(content),
      raw: content,
    }
  } catch {
    // fallback al fetch público
  }
}

// Camino 2: preview (HTTP desde /public)
const raw = await fetchMarkdown(category, slug)
if (!raw) return null
const { data, content } = matter(raw)
const parsed = PostFrontmatter.parse(data)
return {
  ...parsed,
  category,
  slug,
  html: await toHtml(content),
  raw: content,
}
}

export async function getAllPosts(
category: Category,
{ includeDrafts = false }: { includeDrafts?: boolean } = {}
): Promise<PostMeta[]> {
const out: PostMeta[] = []

// Camino 1: filesystem (build/SSR)
if (canUseFs()) {
  try {
    const fs = await import("fs/promises")
    const dir = categoryDir(category)
    const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md"))
    for (const file of files) {
      const slug = file.replace(/\.md$/, "")
      const rawFile = await fs.readFile(path.join(dir, file), "utf8")
      const { data } = matter(rawFile)
      const parsed = PostFrontmatter.safeParse(data)
      if (!parsed.success) continue
      const meta = { ...parsed.data, category, slug }
      if (!includeDrafts && meta.draft) continue
      out.push(meta)
    }
    out.sort((a, b) => +b.date - +a.date)
    return out
  } catch {
    // fallback al fetch público
  }
}

// Camino 2: preview desde /public
const index = await fetchIndex()
for (const { category: cat, slug } of index.filter((e) => e.category === category)) {
  const raw = await fetchMarkdown(cat, slug)
  if (!raw) continue
  const { data } = matter(raw)
  const parsed = PostFrontmatter.safeParse(data)
  if (!parsed.success) continue
  const meta = { ...parsed.data, category, slug }
  if (!includeDrafts && meta.draft) continue
  out.push(meta)
}
out.sort((a, b) => +b.date - +a.date)
return out
}

export async function getLatestPosts(limit = 6): Promise<PostMeta[]> {
try {
  const [blog, news] = await Promise.all([getAllPosts("blog"), getAllPosts("news")])
  return [...blog, ...news].sort((a, b) => +b.date - +a.date).slice(0, limit)
} catch {
  return []
}
}

export async function getAllSlugs(category: Category): Promise<string[]> {
// build/SSR
if (canUseFs()) {
  try {
    const fs = await import("fs/promises")
    const dir = categoryDir(category)
    const files = await fs.readdir(dir)
    return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""))
  } catch {
    // fallthrough
  }
}
// preview
const index = await fetchIndex()
return index.filter((e) => e.category === category).map((e) => e.slug)
}
