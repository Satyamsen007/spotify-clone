'use client';
import { usePlayerStore } from "@/store/playerStore";
import { userStore } from "@/store/userStore";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";


const AudioPlayer = () => {
  const audioRef = useRef(null);
  const prevSongRef = useRef(null);
  const hasAddedSongRef = useRef(false);
  const { data: session } = useSession()
  const { currentSong, isPlaying, playNext } = usePlayerStore();
  const { addPlayedSongs } = userStore();
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      playNext();
    }

    audio?.addEventListener("ended", handleEnded);

    return () => audio.removeEventListener("ended", handleEnded);
  }, [playNext]);

  useEffect(() => {
    const audio = audioRef.current;
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong?.audioUrl;
      audio.currentTime = 0;
      prevSongRef.current = currentSong?.audioUrl;
      hasAddedSongRef.current = false;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (session?.user && currentSong?._id && !hasAddedSongRef.current) {
      addPlayedSongs(currentSong._id);
      hasAddedSongRef.current = true;
    }
  }, [currentSong?._id, session?.user]);

  return (
    <audio ref={audioRef} />
  )
}

export default AudioPlayer;