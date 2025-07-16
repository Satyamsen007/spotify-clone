'use client';

import FeaturedSection from '@/components/mainlayout/components/FeaturedSection';
import SectionGrid from '@/components/mainlayout/components/SectionGrid';
import { ScrollArea } from '@/components/ui/scroll-area';
import { musicStore } from '@/store/musicStore';
import { usePlayerStore } from '@/store/playerStore';
import { useEffect } from 'react';


const HomePage = () => {
  const { isLoading, featuredSongs, madeForYouSongs, trendingSongs, fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs } = musicStore();

  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  useEffect(() => {
    if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs, false)
    }
  }, [initializeQueue, madeForYouSongs, featuredSongs, trendingSongs])

  return (
    <ScrollArea className="h-[calc(100vh-100px)] bg-gradient-to-b from-zinc-800 to-zinc-900">
      <div className='p-4 sm:p-6'>
        <FeaturedSection />

        <div className='space-y-8 mb-20'>
          <SectionGrid title="Made for you" songs={madeForYouSongs} isLoading={isLoading} />
          <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading} />
        </div>
      </div>
    </ScrollArea>
  )
}

export default HomePage;