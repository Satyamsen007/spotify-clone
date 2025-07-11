import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { musicStore } from "./musicStore";

export const playlistStore = create((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isGetingPlaylists: false,
  isCreatingPlaylist: false,
  isDeletingPlaylistId: false,
  isUpdatingPlaylist: false,
  isPlaylistLoading: false,
  addingSongToPlaylistId: null,
  removingSongToPlaylistId: null,
  addingSongId: null,
  removingSongId: null,
  error: null,

  setCurrentPlaylist: (playlist) => {
    set({ currentPlaylist: playlist })
  },
  fetchPlaylists: async () => {
    set({ isGetingPlaylists: true, error: null });
    try {
      const response = await axios.get('/api/playlists');
      if (response.status === 200) {
        set({ playlists: response.data.playlists });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      set({ error: error.message })
    } finally {
      set({ isGetingPlaylists: false })
    }
  },
  fetchPlaylistById: async (playlistId) => {
    set({ isPlaylistLoading: true, error: null });
    try {
      const response = await axios.get(`/api/playlists/${playlistId}`);
      set({ currentPlaylist: response.data.playlist })
    } catch (error) {
      set({ error: error.response?.data?.message || 'An error occurred' })
    } finally {
      set({ isPlaylistLoading: false });
    }
  },
  createPlaylist: async (title) => {
    set({ isCreatingPlaylist: true });
    try {
      const response = await axios.post('/api/playlists/create-playlist', { title });
      if (response.status === 200) {
        toast.success("Playlist created");
        await get().fetchPlaylists();
      }
    } catch (error) {
      console.log("Got error while create the playlist", error);
      set({ error: error.message });
    } finally {
      set({ isCreatingPlaylist: false })
    }
  },
  deletePlaylist: async (playlistId) => {
    set({ isDeletingPlaylistId: playlistId, error: null });

    try {
      const response = await axios.delete(`/api/playlists/delete-playlist/${playlistId}`);

      if (response.status === 200) {
        toast.success("Playlist deleted successfully");

        const { playlists, currentPlaylist } = get();
        const newPlaylists = playlists.filter(p => p._id !== playlistId);

        set({
          playlists: newPlaylists,
          currentPlaylist: currentPlaylist?._id === playlistId ? null : currentPlaylist,
        });
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      set({ error: error.response?.data?.message || error.message });
      toast.error("Failed to delete playlist");
    } finally {
      set({ isDeletingPlaylistId: null });
    }
  },

  updatePlaylist: async (formData, playlistId) => {
    set({ isUpdatingPlaylist: true, error: null });
    try {
      const response = await axios.patch(`/api/playlists/update-playlist/${playlistId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      if (response.status === 200) {
        toast.success("Playlist Updated Succefully.");
        await get().fetchPlaylists()
        await get().fetchPlaylistById(playlistId);
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
      set({ error: error.response?.data?.message || error.message });
      toast.error("Failed to update playlist");
    } finally {
      set({ isUpdatingPlaylist: false });
    }
  },
  addSongToPlaylist: async (songId, playlistId) => {
    set({ addingSongToPlaylistId: playlistId, addingSongId: songId, error: null });
    try {
      const response = await axios.patch('/api/playlists/add-song', {
        songId, playlistId
      });
      if (response.status === 200) {
        toast.success("Song Added to the Playlst");
        await get().fetchPlaylists();
        await get().fetchPlaylistById(playlistId);
      }
    } catch (error) {
      console.log("Got Error during adding the song to the playlist.", error);
      set({ error: error.message })
    } finally {
      set({ addingSongToPlaylistId: null, addingSongId: null, })
    }
  },
  removeSongFromPlaylist: async (songId, playlistId) => {
    set({ removingSongToPlaylistId: playlistId, removingSongId: songId, error: null });
    try {
      const response = await axios.patch('/api/playlists/remove-song', {
        songId, playlistId
      });
      if (response.status === 200) {
        toast.success("Song Removed to the Playlst");
        await get().fetchPlaylists();
        await get().fetchPlaylistById(playlistId);
      }
    } catch (error) {
      console.log("Got Error during remove the song to the playlist.", error);
      set({ error: error.message })
    } finally {
      set({ removingSongToPlaylistId: null, removingSongId: null })
    }
  }
}))