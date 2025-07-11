import axios from "axios";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { create } from "zustand";


export const userStore = create((set, get) => ({
  userRecentPlayedSongs: [],
  isRemovingSongId: null,
  isFetchingTheAuthorizedUserPlayedSongs: false,
  isDeleting: false,
  isUpdatingProfile: false,
  error: null,

  fetchUserRecentPlayingSongs: async () => {
    set({ isFetchingTheAuthorizedUserPlayedSongs: true, error: null });
    try {
      const response = await axios.get('/api/user/recently-played');
      if (response.status === 200) {
        set({ userRecentPlayedSongs: response.data.recentPlayedSongs })
      }
    } catch (error) {
      console.error("Error Fetching User:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isFetchingTheAuthorizedUserPlayedSongs: false });
    }
  },
  deleteAccount: async () => {
    set({ isDeleting: true, error: null });
    try {
      const response = await axios.delete('/api/user/delete-account');
      if (response.status === 200) {
        await signOut({ callbackUrl: '/' });
        toast.success("Your account has been permanently deleted");
        set({ authenticatedUser: null });
      }
    } catch (error) {
      console.error("Error Fetching User:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isDeleting: false })
    }
  },
  updateProfile: async (formData, update, session) => {
    set({ isUpdatingProfile: true, error: null });
    try {
      const response = await axios.patch('/api/user/update-profile', formData);
      if (response.status === 200) {
        await update({
          user: {
            ...session?.user,
            fullName: response?.data?.user?.fullName,
            imageUrl: response?.data?.user?.imageUrl
          }
        });
        return response.data.user;
      }
    } catch (error) {
      console.error("Error Updating User Profile:", error);
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ isUpdatingProfile: false })
    }
  },
  addPlayedSongs: async (songId) => {
    try {
      const response = await axios.patch('/api/user/recently-played', { songId });
    } catch (error) {
      console.error("Error Add played Song:", error);
      set({ error: error.response?.data?.message || error.message });
    }
  },
  removePlayedSongs: async (songId) => {
    set({ isRemovingSongId: songId, error: null })
    try {
      const response = await axios.delete(`/api/user/recently-played/remove-song/${songId}`);
      if (response.status === 200) {
        toast.success("Done! Song removed from recently played");
        get().fetchUserRecentPlayingSongs();
      }
    } catch (error) {
      console.error("Error Remove played Song:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isRemovingSongId: null })
    }
  },
}))