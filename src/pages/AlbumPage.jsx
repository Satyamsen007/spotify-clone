'use client';

import AlbumPageSkeleton from '@/components/mainlayout/skeletons/AlbumPageSkeleton';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDominantColor } from '@/hooks/useDominentColor';
import { musicStore } from '@/store/musicStore';
import { usePlayerStore } from '@/store/playerStore';
import { motion } from 'framer-motion';
import { Clock, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

const AlbumPage = ({ albumId }) => {
  const { isAlbumLoading, fetchAlbumById, currentAlbum } = musicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const dominantColor = useDominantColor(currentAlbum?.imageUrl);
  useEffect(() => {
    if (albumId) {
      fetchAlbumById(albumId);
    }
  }, [fetchAlbumById, albumId]);

  if (isAlbumLoading || !currentAlbum) {
    return <AlbumPageSkeleton />;
  }

  const handlePlayAlbum = () => {
    const isCurrentAlbumPlaying = currentAlbum?.songs.some(s => s._id === currentSong?._id);
    if (isCurrentAlbumPlaying) {
      togglePlay();
    } else {
      playAlbum(currentAlbum.songs, 0);
    }
  }

  const handlePlaySong = (index) => {
    playAlbum(currentAlbum?.songs, index);
  }

  return (
    <div className='h-full'>
      <ScrollArea className="h-full rounded-md max-md:rounded-none">
        <div className='relative min-h-full'>
          {/* Background gradient */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-1000"
            style={{
              background: `
      linear-gradient(
        to bottom,
        ${dominantColor} 0%,
        ${dominantColor.replace('0.5)', '0.2)')} 50%,
        #181818 100%
      )
    `
            }}
            aria-hidden="true"
          />


          {/* Content */}
          <div className='relative z-10'>
            {/* Album Header */}
            <div className='flex flex-wrap p-6 gap-6 pb-8'>
              {currentAlbum?.imageUrl && (
                <Image
                  src={currentAlbum.imageUrl}
                  width={240}
                  height={240}
                  quality={100}
                  priority={true}
                  alt={`Album cover for ${currentAlbum.title}`}
                  className='w-[240px] h-[240px] max-md:size-[200px] shadow-xl rounded object-cover'
                />

              )}
              <div className='flex flex-col justify-end'>
                <p className='text-sm font-medium'>Album</p>
                <h2 className='text-4xl md:text-7xl font-bold my-4 max-md:my-2'>{currentAlbum?.title}</h2>
                <div className='flex items-center gap-2 text-sm text-zinc-100'>
                  <span className='font-medium text-white'>
                    {currentAlbum?.artist}
                  </span>
                  <span>• {currentAlbum?.songs?.length || 0} songs</span>
                  <span>• {currentAlbum?.releaseYear} </span>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className='px-6 pb-4 flex items-center gap-6'>
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 max-md:size-10 rounded-full cursor-pointer bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
              >
                {
                  isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
                    <Pause className='size-7 max-md:size-5 text-black' />
                  ) : (
                    <Play className='size-7 max-md:size-5 text-black' />
                  )
                }

              </Button>
            </div>

            {/* Songs Table Section */}
            <div className='bg-black/20 backdrop-blur-sm max-md:pb-44'>
              <div className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-6 py-3 text-sm text-zinc-400'>
                <div className="text-center">#</div>
                <div>Title</div>
                <div className="hidden md:block">Released Date</div>
                <div className="flex justify-end pr-4">
                  <Clock className='size-4' />
                </div>
              </div>
              <div className='px-2'>
                <div>
                  {currentAlbum?.songs?.map((song, i) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-2 py-3 text-sm hover:bg-white/5 rounded-md group cursor-pointer"
                        onClick={() => handlePlaySong(i)}
                      >
                        <div className='flex items-center justify-center h-full'>
                          {
                            isCurrentSong && isPlaying ? (
                              <>
                                <div className="flex items-end gap-[2px] group-hover:hidden h-3 w-fit mx-auto">
                                  {[1.1, 0.7, 1.1, 0.7, 1.2].map((height, i) => (
                                    <motion.div
                                      key={i}
                                      className="w-[2px] bg-green-500 rounded-full"
                                      animate={{
                                        height: [`${height * 80}%`, `${height * 120}%`, `${height * 80}%`]
                                      }}
                                      transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        repeatType: "mirror",
                                        delay: i * 0.1
                                      }}
                                    />
                                  ))}
                                </div>
                                <Pause onClick={(e) => {
                                  e.stopPropagation();
                                  if (currentSong._id === song._id) {
                                    togglePlay();
                                  }
                                }} className='size-4 hidden group-hover:block' />
                              </>
                            ) : (
                              <>
                                <span className='group-hover:hidden'>{i + 1}</span>
                                <Play
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlaySong(i);
                                  }}
                                  className='size-4 hidden group-hover:block'
                                />
                              </>
                            )
                          }
                        </div>

                        <div className='flex items-center gap-3 overflow-hidden'>
                          {song.imageUrl && (
                            <div className='relative size-10 flex-shrink-0'>
                              <Image
                                src={song.imageUrl}
                                fill
                                alt={`Cover for ${song.title}`}
                                className='object-cover rounded-sm'
                                quality={85}
                                sizes="40px"
                              />
                            </div>
                          )}
                          <div className='min-w-0 flex flex-col w-[50%] overflow-hidden'>
                            <p className='truncate font-medium text-white'>{song.title}</p>
                            <p className="text-xs truncate text-zinc-400">
                              {song.artist || currentAlbum?.artist}
                            </p>
                          </div>
                        </div>

                        <div className='hidden md:flex items-center'>
                          {song.createdAt?.split("T")[0]}
                        </div>
                        <div className='flex items-center justify-end pr-2'>
                          {formatDuration(song.duration)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default AlbumPage;