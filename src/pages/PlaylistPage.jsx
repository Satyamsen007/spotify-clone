'use client';

import AlbumSongSearchDialog from '@/components/mainlayout/components/AlbumSongSearchDialog';
import PlaylistEditDialog from '@/components/mainlayout/components/PlaylistEditDialog';
import AlbumPageSkeleton from '@/components/mainlayout/skeletons/AlbumPageSkeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDominantColor } from '@/hooks/useDominentColor';
import { musicStore } from '@/store/musicStore';
import { usePlayerStore } from '@/store/playerStore';
import { playlistStore } from '@/store/playlistStore';
import { motion } from 'framer-motion';
import { Clock, Music, Pause, Pencil, Play, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect } from 'react';


export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export const calculateTotalDuration = (songs) => {
  if (!songs || songs.length === 0) return '0 min 0 sec';

  // Calculate total seconds
  const totalSeconds = songs.reduce((sum, song) => sum + (song.duration || 0), 0);

  // Convert to minutes and seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes} min ${seconds} sec`;
};

const PlaylistPage = ({ playlistId }) => {
  if (typeof window === "undefined") return null;
  const { songs, fetchSongs } = musicStore();
  const { fetchPlaylistById, isPlaylistLoading, currentPlaylist } = playlistStore()
  const { currentSong, isPlaying, playPlaylist, togglePlay } = usePlayerStore();
  const dominantColor = useDominantColor(currentPlaylist?.imageUrl || currentPlaylist?.songs[0]?.imageUrl);
  const { data: session, } = useSession();
  const playlistDuration = calculateTotalDuration(currentPlaylist?.songs);
  useEffect(() => {
    if (playlistId) {
      fetchPlaylistById(playlistId);
      fetchSongs();
    }
  }, [fetchPlaylistById, playlistId, fetchSongs]);


  if (isPlaylistLoading || !currentPlaylist) {
    return <AlbumPageSkeleton />;
  }

  const handlePlayPlaylist = () => {
    const isCurrentPlaylistPlaying = currentPlaylist?.songs.some(s => s._id === currentSong?._id);
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playPlaylist(currentPlaylist.songs, 0);
    }
  }

  const handlePlaySong = (index) => {
    playPlaylist(currentPlaylist?.songs, index);
  }

  return (
    <div className='h-full'>
      <ScrollArea className="h-full rounded-md max-md:rounded-none">
        <div className='relative min-h-full'>
          {/* Background gradient */}
          {
            currentPlaylist?.imageUrl || currentPlaylist?.songs[0]?.imageUrl ? (
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-1000"
                style={{
                  background: ` linear-gradient(to bottom, ${dominantColor} 0%, ${dominantColor.replace('0.5)', '0.2)')} 50%, #181818 100% )`
                }}
                aria-hidden="true"
              />
            ) : (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#282828] via-[#181818] to-black" />
            )
          }


          {/* Content */}
          <div className='relative z-10'>
            {/* Album Header */}
            <Dialog>
              <DialogTrigger asChild>
                <div
                  className='flex flex-wrap p-6 gap-6 pb-8 cursor-pointer'>
                  {currentPlaylist?.imageUrl || currentPlaylist?.songs[0]?.imageUrl ? (
                    <div className='group relative'>
                      <Image
                        src={currentPlaylist.imageUrl || currentPlaylist?.songs[0]?.imageUrl}
                        width={240}
                        height={240}
                        quality={100}
                        priority={true}
                        alt={`Album cover for ${currentPlaylist.title}`}
                        className='w-[240px] h-[240px] max-md:size-[200px] shadow-xl object-cover rounded'
                      />
                      <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center transition-opacity cursor-pointer'>
                        <Pencil className='size-8 text-white' />
                      </div>
                    </div>
                  ) : (
                    <div className='size-[240px] max-md:size-[200px] rounded-md  relative group shadow-xl p-6 pb-8 bg-zinc-700 flex items-center justify-center'>
                      <Music className='size-16 text-zinc-400' />
                      <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center transition-opacity cursor-pointer'>
                        <Pencil className='size-8 text-white' />
                      </div>
                    </div>
                  )}
                  <div className='flex flex-col justify-end'>
                    <p className='text-sm font-medium'>Public Playlist</p>
                    <h2 className='text-4xl md:text-7xl font-bold my-4 max-md:my-2'>{currentPlaylist?.title}</h2>
                    <div className='flex items-center gap-2 text-sm text-zinc-100'>
                      <span className='font-medium text-white'>
                        {session?.user?.fullName}
                      </span>
                      <span>• {currentPlaylist?.songs?.length || 0} songs</span>
                      {currentPlaylist?.songs?.length > 0 && <span>• {playlistDuration} </span>}
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <PlaylistEditDialog currentPlaylist={currentPlaylist} />
            </Dialog>


            {/* Play Button */}
            {
              currentPlaylist?.songs?.length > 0 && (

                <div className='flex justify-between'>
                  <div className='px-6 pb-4 flex items-center gap-6'>
                    <Button
                      onClick={handlePlayPlaylist}
                      size="icon"
                      className="w-14 h-14 max-md:size-10 rounded-full cursor-pointer bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
                    >
                      {
                        isPlaying && currentPlaylist?.songs.some((song) => song._id === currentSong?._id) ? (
                          <Pause className='size-7 max-md:size-5 text-black' />
                        ) : (
                          <Play className='size-7 max-md:size-5 text-black' />
                        )
                      }

                    </Button>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-2 mr-4 size-10 rounded-full cursor-pointer bg-green-600 !text-white hover:!bg-green-600">
                        <Plus className="size-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-[650px] bg-[#121212] border-zinc-800 rounded-lg">
                      <DialogHeader>
                        <DialogTitle>Add songs to playlist</DialogTitle>
                        <DialogDescription>
                          Search for songs to add to "{currentPlaylist?.title}"
                        </DialogDescription>
                      </DialogHeader>

                      <AlbumSongSearchDialog songs={songs} playlistId={playlistId} />

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="secondary" className="cursor-pointer">Done</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )
            }

            {/* Songs Table Section */}
            <div className='bg-black/20 backdrop-blur-sm max-md:pb-44'>
              {currentPlaylist?.songs?.length > 0 ? (
                <>
                  {/* Table Head Section */}
                  <div className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-6 py-3 text-sm text-zinc-400'>
                    <div className="text-center">#</div>
                    <div>Title</div>
                    <div className="hidden md:block">Released Date</div>
                    <div className="flex justify-end pr-4">
                      <Clock className='size-4' />
                    </div>
                  </div>

                  {/* Songs List */}
                  <div className='px-2'>
                    <div>
                      {currentPlaylist.songs.map((song, i) => {
                        const isCurrentSong = currentSong?._id === song._id;
                        return (

                          <div
                            key={song._id}
                            className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-2 py-3 text-sm hover:bg-white/5 rounded-md group cursor-pointer"
                            onClick={() => handlePlaySong(i)}
                          >
                            {/* Song number/play button */}
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

                            {/* Song info */}
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
                                  {song.artist || currentPlaylist?.artist}
                                </p>
                              </div>
                            </div>

                            {/* Release date */}
                            <div className='hidden md:flex items-center'>
                              {song.createdAt?.split("T")[0]}
                            </div>

                            {/* Duration */}
                            <div className='flex items-center justify-end pr-2'>
                              {formatDuration(song.duration)}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center gap-6">
                  <div className="flex flex-col items-center justify-center p-12 gap-8 text-center">
                    {/* Spotify Icon */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full animate-pulse" />
                      <div className="relative size-24 flex items-center justify-center rounded-full bg-black border-2 border-green-500/30 shadow-[0_0_20px_rgba(29,185,84,0.3)]">
                        <svg className="size-12 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.018.599-1.558.3z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">No songs in this playlist</h3>
                    <p className="text-zinc-400 max-w-md mx-auto">
                      Let's find some songs to add to your playlist
                    </p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-2 w-32 cursor-pointer bg-green-600 !text-white hover:!bg-green-600">
                        <Plus className="size-4" />
                        Add Songs
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[650px] bg-[#121212] border-zinc-800">
                      <DialogHeader>
                        <DialogTitle>Add songs to playlist</DialogTitle>
                        <DialogDescription>
                          Search for songs to add to "{currentPlaylist?.title}"
                        </DialogDescription>
                      </DialogHeader>

                      <AlbumSongSearchDialog songs={songs} playlistId={playlistId} />

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="secondary" className="cursor-pointer">Done</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default PlaylistPage;