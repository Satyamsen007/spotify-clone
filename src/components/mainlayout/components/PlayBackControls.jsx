'use client';

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/store/playerStore";
import { Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AddSongToPlaylist from "./AddSongToPlaylist";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlayBackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious, repeatMode,
    toggleRepeat, queue, toggleShuffle, isShuffled } = usePlayerStore();
  const { data: session } = useSession()
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [previousVolume, setPreviousVolume] = useState(volume);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    const handleEnded = () => {
      const { repeatMode } = usePlayerStore.getState();
      if (repeatMode === "song") {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    }
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    }
  }, [currentSong, playNext]);

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  }
  const handleMute = () => {
    setPreviousVolume(volume);
    setVolume(0);
    if (audioRef.current) {
      audioRef.current.volume = 0;
    }
  }
  const handleUnmute = () => {
    setVolume(previousVolume);
    if (audioRef.current) {
      audioRef.current.volume = previousVolume / 100;
    }
  }
  return (
    <footer className="h-fit md:h-24 z-50 fixed bottom-0 w-full bg-zinc-900 border-t border-zinc-800 px-4 max-md:py-4 max-md:px-2">
      <div className={`flex max-md:flex-col ${currentSong ? "justify-between" : "mx-auto"} items-center h-full max-w-[1800px] mx-auto`}>
        {/* Currently Playing Song */}
        <div className='hidden md:flex items-center gap-4 min-w-[180px] w-[30%]'>
          {currentSong && (
            <>
              <div className='relative w-14 h-14 flex-shrink-0'>
                <Image
                  src={currentSong.imageUrl}
                  alt={currentSong.title}
                  fill
                  sizes="56px"
                  quality={90}
                  priority
                  className='object-cover rounded-md'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='font-medium truncate hover:underline cursor-pointer'>
                  {currentSong.title}
                </div>
                <div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full md:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button
              size='icon'
              variant='ghost'
              onClick={toggleShuffle}
              className={`cursor-pointer ${isShuffled ? "text-green-500 hover:!text-green-400" : "text-zinc-400 hover:!text-white"
                }`}
            >
              <Shuffle className='h-4 w-4' />
            </Button>

            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400 cursor-pointer'
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className='h-4 w-4' />
            </Button>
            <Button
              size='icon'
              className='bg-white hover:bg-white/80 text-black rounded-full h-8 w-8 cursor-pointer'
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400 cursor-pointer'
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className='h-4 w-4' />
            </Button>
            <Button
              onClick={toggleRepeat}
              size='icon'
              variant='ghost'
              className={`cursor-pointer ${repeatMode !== "off"
                ? "text-green-500 hover:!text-green-400"
                : "text-zinc-400 hover:!text-white"
                }`}
              disabled={!currentSong}
            >
              {repeatMode === "song" ? (
                <div className="relative">
                  <Repeat className="h-4 w-4" />
                  <span className="absolute -bottom-1 -right-1 text-[8px] font-bold">1</span>
                </div>
              ) : repeatMode === "queue" && queue.length > 1 ? (
                <div className="relative">
                  <Repeat className="h-4 w-4" />
                  <span className="absolute -bottom-1 -right-1 text-[8px] font-bold">∞</span>
                </div>
              ) : (
                <Repeat className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="w-full max-md:flex max-md:items-center max-md:gap-2 max-md:mt-2">
            <div className="flex items-center gap-2 w-full">
              <div className="text-xs text-zinc-400">
                {formatTime(currentTime)}
              </div>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                className='w-full hover:cursor-grab active:cursor-grabbing'
                onValueChange={handleSeek}
              />
              <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
            </div>
            {
              (currentSong?.imageUrl && session?.user) && (
                <div className="md:hidden">
                  <AddSongToPlaylist />
                </div>
              )
            }

          </div>
        </div>

        {/* Mobile screens volume controlls */}
        {currentSong?.imageUrl && (
          <div className="flex md:hidden items-center justify-around w-full mt-4">
            <div className="flex items-center gap-2">
              <div className='relative w-10 h-10 flex-shrink-0'>
                <Image
                  src={currentSong?.imageUrl}
                  alt={currentSong?.title}
                  fill
                  sizes="56px"
                  quality={90}
                  priority
                  className='object-cover rounded'
                />
              </div>
              <div className="w-28">
                <p className="text-sm font-medium truncate">
                  {currentSong?.title || "No song selected"}
                </p>
                <div className="flex items-center w-full overflow-hidden">
                  <p className="text-xs text-zinc-400 truncate">
                    {currentSong?.artist || "Unknown artist"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => {
                  volume !== 0 ? handleMute() : handleUnmute()
                }}
                size='icon' variant='ghost' className='hover:text-white cursor-pointer text-zinc-400'>
                {
                  volume === 0 ? (<VolumeOff className='h-4 w-4' />) : (<Volume2 className='h-4 w-4' />)
                }

              </Button>
              <Slider
                value={[volume]}
                max={100}
                step={1}
                className='w-20 hover:cursor-grab active:cursor-grabbing'
                onValueChange={(value) => {
                  setVolume(value[0]);
                  if (audioRef.current) {
                    audioRef.current.volume = value[0] / 100;
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Volume controls */}
        {
          currentSong && (
            <div className="hidden md:flex items-center gap-4 min-w-[100px] w-[30%] justify-end">
              <Button size='icon' variant='ghost' className='hover:text-white cursor-pointer text-zinc-400'>
                <Mic2 className='h-4 w-4' />
              </Button>
              <Button size='icon' variant='ghost' className='hover:text-white cursor-pointer text-zinc-400'>
                <ListMusic className='h-4 w-4' />
              </Button>
              <Button size='icon' variant='ghost' className='hover:text-white cursor-pointer text-zinc-400'>
                <Laptop2 className='h-4 w-4' />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    volume !== 0 ? handleMute() : handleUnmute()
                  }}
                  size='icon' variant='ghost' className='hover:text-white cursor-pointer text-zinc-400'>
                  {
                    volume === 0 ? (<VolumeOff className='h-4 w-4' />) : (<Volume2 className='h-4 w-4' />)
                  }

                </Button>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className='w-24 hover:cursor-grab active:cursor-grabbing'
                  onValueChange={(value) => {
                    setVolume(value[0]);
                    if (audioRef.current) {
                      audioRef.current.volume = value[0] / 100;
                    }
                  }}
                />
              </div>
            </div>
          )
        }
      </div>
    </footer>
  )
}

export default PlayBackControls;