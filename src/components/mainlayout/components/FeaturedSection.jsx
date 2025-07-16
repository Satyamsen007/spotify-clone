'use client';

import { musicStore } from '@/store/musicStore';
import Image from 'next/image';
import FeaturedGridSkeleton from '../skeletons/FeaturedGridSkeleton';
import PlayButton from './PlayButton';

// utils/getGreeting.ts
export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const FeaturedSection = () => {
  const { isLoading, error, featuredSongs } = musicStore();

  if (isLoading) {
    return (
      <FeaturedGridSkeleton />
    )
  }

  if (error) {
    return (
      <div className="text-center text-sm text-red-500">
        Sorry, we encountered an unexpected error. Please try again later.
      </div>
    )
  }

  return (
    <>
      <h1 className='text-2xl sm:text-3xl font-bold mb-6'>{getGreeting()}</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
        {featuredSongs.map((song) => (
          <div
            key={song._id}
            className='flex items-center bg-zinc-800/50 rounded-md  overflow-hidden hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
          >
            {/* Improved Image Component */}
            <div className='relative size-16 sm:size-20 shrink-0'>
              <Image
                src={song.imageUrl}
                alt={song.title}
                fill
                sizes="(max-width: 640px) 64px, 80px"
                quality={85}
                className='object-cover max-md:rounded-r-sm max-md:rounded'
                priority={featuredSongs.indexOf(song) < 3}
              />
            </div>

            <div className='flex-1 p-4 min-w-0'>
              <p className='font-medium truncate'>{song.title}</p>
              <p className='text-sm text-zinc-400 truncate w-[80%]'>{song.artist}</p>
            </div>
            <PlayButton song={song} />
          </div>
        ))}
      </div>
    </>
  )
}

export default FeaturedSection