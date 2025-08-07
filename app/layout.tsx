import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "Boletín Interno",
  description: "Blog y Noticias internas de la empresa",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-gray-900">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-black focus:px-3 focus:py-2 focus:text-white">
          Ir al contenido
        </a>

        <header className="border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <nav className="container mx-auto max-w-6xl px-4 h-14 flex items-center gap-4">
            <Link href="/" className="font-semibold text-gray-900">Boletín</Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
            <Link href="/noticias" className="text-gray-600 hover:text-gray-900">Noticias</Link>

            <div className="ml-auto flex items-center gap-2">
              {/* Enlace general al panel del CMS (usa la barra final / para servir index.html) */}
              <Link href="/admin/" className="inline-flex rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">
                Admin
              </Link>
              {/* Accesos directos a crear contenido en Decap CMS */}
              <Link href="/admin/#/collections/blog/new" className="hidden sm:inline-flex rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800">
                Crear Blog
              </Link>
              <Link href="/admin/#/collections/news/new" className="hidden sm:inline-flex rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-200">
                Crear Noticia
              </Link>
            </div>
          </nav>
        </header>

        <main id="contenido">{children}</main>

        <footer className="border-t py-8">
          <div className="container mx-auto max-w-6xl px-4 text-sm text-gray-500">
            {'© '}{new Date().getFullYear()} {'Tu Empresa · Hecho con Next.js + Tailwind'}
          </div>
        </footer>
      </body>
    </html>
  )
}
