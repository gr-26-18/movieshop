"use client"

import { Film } from "lucide-react"
import { useState } from "react"

interface MovieThumbnailProps {
  imageUrl?: string | null
  title: string
}

export function MovieThumbnail({ imageUrl, title }: MovieThumbnailProps) {
  const [error, setError] = useState(false)

  return (
    <div className="h-8 w-6 overflow-hidden rounded bg-background flex items-center justify-center border shadow-sm group-hover:scale-110 transition-transform">
      {imageUrl && !error ? (
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <Film className="h-3 w-3 text-muted-foreground" />
      )}
    </div>
  )
}
