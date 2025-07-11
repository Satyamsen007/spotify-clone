import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

export const musicStore = create((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  isAlbumLoading: false,
  deletingSongId: null,
  deletingAlbumId: null,
  error: null,
  currentAlbum: null,
  featuredSongs: [],
  madeForYouSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0
  },

  // Fetch Functions
  fetchAlbums: async () => {
    // Albums Fetch
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/albums');
      set({ albums: response.data.albums })
    } catch (error) {
      set({ error: error.response?.data?.message || 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },
  fetchAlbumById: async (albumId) => {
    set({ isAlbumLoading: true, error: null });
    try {
      const response = await axios.get(`/api/albums/${albumId}`);
      set({ currentAlbum: response.data.album })
    } catch (error) {
      set({ error: error.response?.data?.message || 'An error occurred' })
    } finally {
      set({ isAlbumLoading: false });
    }
  },
  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/songs/featured-songs');
      set({ featuredSongs: response.data.songs })
    } catch (error) {
      set({ error: error.response?.data?.message || 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },
  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/songs/made-for-you');
      set({ madeForYouSongs: response.data.songs })
    } catch (error) {
      set({ error: error.response?.data?.message || 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },
  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/songs/trending-songs');
      set({ trendingSongs: response.data.songs })
    } catch (error) {
      set({ error: error.response?.data?.message || 'An error occurred' })
    } finally {
      set({ isLoading: false })
    }
  },
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/stats');
      set({
        stats: {
          totalSongs: response.data.totalSongs,
          totalAlbums: response.data.totalAlbums,
          totalUsers: response.data.totalUsers,
          totalArtists: response.data.totalArtists
        }
      })
    } catch (error) {
      set({ error: error.response?.data?.message || 'An error occurred' })
    } finally {
      set({ isLoading: false });
    }
  },
  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/songs');
      set({ songs: response.data.songs });
    } catch (error) {
      set({ error: error.response?.data?.message || 'An error occurred' })
    } finally {
      set({
        isLoading: false
      })
    }
  },
  deleteSong: async (songId) => {
    set({ deletingSongId: songId, error: null });
    try {
      const response = await axios.delete("/api/songs/delete-song", {
        data: { songId }
      });
      set(state => ({
        songs: state.songs.filter((song) => song._id !== songId),
        stats: {
          ...state.stats,
          totalSongs: state.stats.totalSongs - 1,
          totalArtists: state.stats.totalArtists - 1
        }
      }));

      toast.success("Song deleted succefull");
    } catch (error) {
      set({ error: error.response?.data?.message || 'An error occurred' });
      toast.error("Got error while deleting a song please try agian.")
    } finally {
      set({ deletingSongId: null });
    }
  },
  deleteAlbum: async (albumId) => {
    set({ deletingAlbumId: albumId, error: null });
    try {
      const response = await axios.delete("/api/albums/delete-album", { data: { albumId } });
      set(state => ({
        albums: state.albums.filter((album) => album._id !== albumId),
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((a) => (a._id === albumId)?.title ? { ...song, album: null } : song)
        ),
        stats: {
          ...state.stats,
          totalAlbums: state.stats.totalAlbums - 1
        }
      }));
      toast.success("Album deleted succefull");
    } catch (error) {
      set({ error: error.response?.data?.message || 'An error occurred' });
      toast.error("Got error while deleting a album please try agian.")
    } finally {
      set({ deletingAlbumId: null });
    }
  }
}))