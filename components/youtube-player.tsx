"use client"

import { useState, useCallback } from "react"
import Image from "next/image"

type YouTubePlayerProps = {
  youtubeId: string
  title: string
}

export function YouTubePlayer({ youtubeId, title }: YouTubePlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handlePlay = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      {isLoaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          onClick={handlePlay}
          className="group absolute inset-0 flex cursor-pointer items-center justify-center"
          aria-label={`${title} を再生`}
        >
          {/* YouTube thumbnail */}
          <Image
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
            priority
          />

          {/* Play button overlay */}
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
            <svg className="h-7 w-7 translate-x-0.5 text-white sm:h-9 sm:w-9" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
        </button>
      )}
    </div>
  )
}
