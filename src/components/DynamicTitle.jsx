'use client'

import { useEffect } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { usePathname } from 'next/navigation'

export const DynamicTitle = () => {
  const { currentSong } = usePlayerStore()
  const pathname = usePathname()

  useEffect(() => {
    if (currentSong?.title) {
      document.title = `${currentSong.title} • ${currentSong.artist || 'Artist'} | Spotify Clone`
    }
  }, [currentSong, pathname]) // Also trigger on route changes

  return null
}