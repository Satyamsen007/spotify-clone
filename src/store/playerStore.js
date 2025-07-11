import { create } from "zustand";
import { playlistStore } from "./playlistStore";

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currectIndex: -1,
  repeatMode: "off",
  isShuffled: false,

  initializeQueue: (songs, setFirstSong = true) => {
    set({
      queue: songs,
      currentSong: setFirstSong ? (get().currentSong || songs[0]) : get().currentSong,
      currectIndex: setFirstSong ? (get().currectIndex === -1 ? 0 : get().currectIndex) : get().currectIndex
    })
  },
  playAlbum: (songs, startIndex) => {
    if (songs.length === 0) return;
    const song = songs[startIndex];
    set({
      queue: songs,
      currentSong: song,
      currectIndex: startIndex,
      isPlaying: true
    })
  },
  playPlaylist: (songs, startIndex) => {
    if (songs.length === 0) return;
    const song = songs[startIndex];
    set({
      queue: songs,
      currentSong: song,
      currectIndex: startIndex,
      isPlaying: true
    });
    playlistStore.get().currentPlaylist = playlist
  },
  setCurrentSong: (song) => {
    if (!song) return;
    const songIndex = get().queue.findIndex(s => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currectIndex: songIndex !== -1 ? songIndex : get().currectIndex
    });
  },
  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;
    set({
      isPlaying: willStartPlaying
    });
  },
  toggleRepeat: () => {
    const { repeatMode, queue } = get();
    const hasQueue = queue.length > 1;
    const nextMode =
      repeatMode === "off" ? "song" :
        repeatMode === "song" ? (hasQueue ? "queue" : "off") : "off";
    set({ repeatMode: nextMode });
  },
  toggleShuffle: () => {
    const { isShuffled, queue } = get();
    if (queue.length <= 1) return;

    set({ isShuffled: !isShuffled });

    if (!isShuffled) {
      const { currectIndex, currentSong } = get();
      const remainingSongs = [...queue];
      remainingSongs.splice(currectIndex, 1); // Remove current song
      const shuffledSongs = [...remainingSongs].sort(() => Math.random() - 0.5);
      set({ queue: [currentSong, ...shuffledSongs], currectIndex: 0 });
    }
  },
  playNext: () => {
    const { currectIndex, queue, repeatMode } = get();
    const nextIndex = currectIndex + 1;
    const hasQueue = queue.length > 1;

    if (repeatMode === 'song') {
      set({ isPlaying: true });
      return;
    }

    if (!hasQueue) {
      set({ isPlaying: false });
      return;
    }

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      set({
        currentSong: nextSong,
        currectIndex: nextIndex,
        isPlaying: true
      })
    } else if (repeatMode === 'queue') {
      set({
        currentSong: queue[0],
        isPlaying: true,
        currectIndex: 0
      });
    } else {
      set({
        isPlaying: false
      })
    }
  },
  playPrevious: () => {
    const { currectIndex, queue } = get();
    const prevIndex = currectIndex - 1

    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      set({
        currentSong: prevSong,
        currectIndex: prevIndex,
        isPlaying: true
      })
    } else {
      set({
        isPlaying: false
      })
    }
  },

}));