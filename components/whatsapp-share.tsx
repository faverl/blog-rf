"use client"

import { MessageCircle } from 'lucide-react'

export default function WhatsappShare({ text = "Te comparto este contenido:" }: { text?: string }) {
  const onClick = () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
      aria-label="Compartir por WhatsApp"
    >
      <MessageCircle className="h-4 w-4" />
      Compartir por WhatsApp
    </button>
  )
}
