'use client';

import SignInAuthButton from '@/components/SignInAuthButton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePlayerStore } from '@/store/playerStore';
import { Check, Copy, Ellipsis, MusicIcon, Pause, Play } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useState } from 'react';
import AddSongToPlaylist from './AddSongToPlaylist';

const PlayBackHub = ({ setCollapsPlayBackHub }) => {
  const { data: session } = useSession();
  const { currentSong, queue, setCurrentSong, isPlaying, togglePlay } = usePlayerStore();
  const [copied, setCopied] = useState();

  const copyToClipboard = (songUrl) => {
    setCopied(true)
    setTimeout(() => {
      navigator.clipboard.writeText(songUrl);
      toast.success("Audio URL has been copied to clipboard");
      setCopied(false)
    }, 700);
  };

  return (
    <div className="h-full bg-zinc-900 rounded-lg group/outer duration-300">
      {!session?.user && <LoginPrompt />}

      <div className='flex justify-between items-center relative p-4'>
        <div className='flex items-center gap-2'>
          <svg onClick={() => setCollapsPlayBackHub(true)} data-encore-id="icon" role="img" aria-hidden="true" className="size-4 cursor-pointer absolute left-2 opacity-0 
            group-hover/outer:opacity-100 group-hover/outer:translate-x-0 -translate-x-8 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]" fill='white' viewBox="0 0 16 16" ><path d="M10.03 10.53a.75.75 0 1 1-1.06-1.06L10.44 8 8.97 6.53a.75.75 0 0 1 1.06-1.06l2 2a.75.75 0 0 1 0 1.06z"></path><path d="M15 16a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1zm-8.5-1.5v-13h8v13zm-1.5 0H1.5v-13H5z"></path></svg>
          <h2 className='text-base font-semibold group-hover/outer:ml-6 duration-300'>{currentSong?.title}</h2>
        </div>
        <Ellipsis className='size-5 cursor-pointer opacity-0 group-hover/outer:opacity-100 duration-300' />
      </div>

      <ScrollArea className="flex-1 h-[calc(100vh-100px)]">
        <div className="p-4 space-y-4">
          <div>
            <div className='aspect-square rounded-md shadow-lg overflow-hidden relative'>
              {
                !currentSong && (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <MusicIcon className="size-12 text-zinc-500" />
                  </div>
                )
              }
              {
                currentSong?.imageUrl && (
                  <Image
                    src={currentSong?.imageUrl}
                    alt={currentSong?.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={100}
                    className='object-cover'
                    priority={true}
                    unoptimized={false}
                  />
                )
              }
            </div>
            <div className='w-full flex gap-3 flex-col py-5'>
              <div className='flex flex-col gap-1'>
                <h3 className='text-2xl font-semibold'>{currentSong?.title}</h3>
                <p className='text-sm truncate text-zinc-400 w-[80%]'>{currentSong?.artist}</p>
              </div>
              <div className='flex items-center gap-3'>
                <AddSongToPlaylist />
                <div className='relative'>

                  {
                    copied ? (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check className='size-5' />
                      </motion.div>
                    ) : (
                      <Copy onClick={() => copyToClipboard(currentSong?.audioUrl)} className='size-5 cursor-pointer' />
                    )
                  }
                </div>
              </div>
            </div>
          </div>

          <div className='mb-10'>
            <p className='font-semibold text-white text-sm'>Next in queue</p>
            <div className='flex flex-col gap-4 py-4'>
              {
                queue.map((que, i) => (
                  <div key={i} className='hover:bg-zinc-800 p-2 rounded-md cursor-pointer'>
                    <div className='flex items-center gap-4'>
                      <div className='relative group/item'>
                        <div className='aspect-square rounded-md shadow-lg size-12 overflow-hidden relative'>
                          <Image
                            src={que?.imageUrl}
                            alt={que?.title}
                            fill
                            sizes="12rem"
                            quality={100}
                            className='object-cover'
                          />
                        </div>
                        <div className={`absolute inset-0 transition-opacity duration-200 flex items-center justify-center bg-black/50 rounded-sm ${(isPlaying && currentSong._id === que._id) ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}`}>
                          {
                            (isPlaying && currentSong._id === que._id) ? (
                              <>
                                <div className="flex items-end gap-[2px] group-hover/item:hidden h-3 w-fit mx-auto">
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
                                  if (currentSong._id === que._id) {
                                    togglePlay();
                                  }
                                }} className='size-5 text-white hidden group-hover/item:block' />
                              </>

                            ) : (
                              <Play onClick={() => setCurrentSong(que)} className='size-5 text-white' />
                            )
                          }
                        </div>
                      </div>

                      <div className="flex flex-col w-[60%] overflow-hidden">
                        <h3 className='text-base font-semibold truncate'>{que?.title}</h3>
                        <p className="text-sm font-semibold text-zinc-300 truncate" title={que?.artist}>
                          {que?.artist}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </ScrollArea >
    </div >
  )
}

export default PlayBackHub;



const LoginPrompt = () => (
  <div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-zinc-900/80 to-zinc-800/50 rounded-lg border border-zinc-800'>
    {/* Animated music hub icon */}
    <div className='relative w-24 h-24 bg-black rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.5)] animate-pulse'>
      <div className='absolute inset-0 rounded-full border-4 border-[#1db954] opacity-80' />
      <svg
        className='w-12 h-12 text-[#1db954]'
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.018.599-1.558.3z" />
      </svg>
    </div>

    {/* PlaybackHub-themed text */}
    <div className='space-y-2 max-w-[280px]'>
      <h3 className='text-lg font-semibold text-white'>Unlock Your Playback Hub</h3>
      <p className='text-sm text-zinc-400'>
        Sign in to access your personalized music dashboard, queue controls, and playback analytics
      </p>
    </div>

    {/* Enhanced login button */}
    <SignInAuthButton className='mt-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 rounded-full text-white font-medium transition-all shadow-lg hover:shadow-emerald-500/20' />
  </div>
);