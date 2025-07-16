'use client';

import PlayButton from '@/components/mainlayout/components/PlayButton';
import RemoveSongFromHistoryButton from '@/components/mainlayout/components/RemoveSongFromHistoryButton';
import UserProfileUpdateDialog from '@/components/mainlayout/components/UserProfileUpdateDialog';
import ProfilePageSkeleton from '@/components/mainlayout/skeletons/ProfilePageSkeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePlayerStore } from '@/store/playerStore';
import { playlistStore } from '@/store/playlistStore';
import { userStore } from '@/store/userStore';
import { Loader2, Music, Pause, Play, Plus, Trash2Icon, UserRoundPen } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ProfilePage = () => {
  if (typeof window === "undefined") return null;
  const [activeTab, setActiveTab] = useState('playlists');
  const { data: session, status } = useSession();
  const user = session?.user;
  const { playlists, isGetingPlaylists, currentPlaylist, setCurrentPlaylist } = playlistStore();
  const { currentSong, isPlaying, playPlaylist, togglePlay } = usePlayerStore();
  const { deleteAccount, isDeleting, fetchUserRecentPlayingSongs, isFetchingTheAuthorizedUserPlayedSongs, userRecentPlayedSongs } = userStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const isCurrentSongInPlaylists = playlists.some(playlist =>
    playlist.songs?.some(song => song._id === currentSong?._id)
  );

  useEffect(() => {
    fetchUserRecentPlayingSongs();
  }, [fetchUserRecentPlayingSongs])

  const stats = {
    playlists: playlists?.length || 0,
    playlistsTotalSongs: playlists?.reduce((total, playlist) => {
      return total + playlist?.songs?.length || 0
    }, 0)
  };
  const handlePlayPlaylist = (playlist) => {
    setCurrentPlaylist(playlist)
    const isCurrentPlaylistPlaying =
      currentPlaylist?._id === playlist._id &&
      playlist.songs?.some(s => s._id === currentSong?._id);
    if (isCurrentPlaylistPlaying && isPlaying) {
      togglePlay();
    } else {
      playPlaylist(playlist.songs, 0);
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'BYE-SPOTIFY') {
      toast.error('Please type FRESHCART to confirm')
      return
    };
    deleteAccount();
  };

  if ((isGetingPlaylists && status !== 'loading') || isFetchingTheAuthorizedUserPlayedSongs) {
    return (
      <ProfilePageSkeleton />
    )
  }

  return (
    <div className="bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white min-h-screen">
      {/* Gradient Header */}
      <div className="relative">
        <div className="h-64 w-full bg-gradient-to-b from-zinc-700 to-zinc-900 opacity-80"></div>
        <div className="absolute inset-0 flex items-end p-4 md:p-8">
          <div className="flex items-end max-md:flex-col max-md:items-start gap-6 w-full">
            <div className="flex items-end gap-6 flex-1">
              {
                user?.imageUrl ? (
                  <div className="relative h-28 w-28 md:h-42 md:w-42 shadow-2xl">
                    <Image
                      src={user?.imageUrl}
                      alt={`${user?.name}'s profile`}
                      fill
                      quality={100}
                      priority={true}
                      sizes="(max-width: 768px) 112px, 168px"
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-28 w-28 md:h-42 md:w-42 shadow-2xl flex items-center justify-center rounded-full bg-green-100 text-green-800">
                    <span className='text-5xl font-semibold'>
                      {user?.fullName
                        ? user?.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                        : 'U'}
                    </span>
                  </div>
                )
              }

              <div className="mb-4">
                <p className="text-sm max-md:text-xs uppercase tracking-wider mb-2 max-md:mb-1 text-zinc-400">Profile</p>
                <h1 className="text-2xl md:text-6xl font-bold mb-4 max-md:mb-2">{user?.fullName}</h1>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-bold">{stats.playlists}</span>{' '}
                    <span className="text-zinc-400">Playlists</span>
                  </div>
                  <div>
                    <span className="font-bold">{stats.playlistsTotalSongs}</span>{' '}
                    <span className="text-zinc-400">Songs in playlists</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8 flex gap-4 items-end">
              <Dialog>
                <DialogTrigger>
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-700/20 rounded-sm cursor-pointer shadow-lg text-white font-medium transition"
                  >
                    <UserRoundPen className="h-5 w-5" />
                  </button>
                </DialogTrigger>
                <UserProfileUpdateDialog />
              </Dialog>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-700/20 cursor-pointer rounded-sm shadow-lg text-white font-medium transition"
              >
                <Trash2Icon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please type <span className="font-semibold">BYE-SPOTIFY</span> to confirm:
              </p>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type BYE-SPOTIFY to confirm"
                className="border-red-200 dark:border-red-800"
                disabled={isDeleting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className='cursor-pointer'
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'BYE-SPOTIFY' || isDeleting}
              className='cursor-pointer'
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content Area */}
      <div className="px-6 md:px-8 pt-8 max-md:pt-5 pb-32">
        {/* Tabs */}
        <div className="border-b border-zinc-700 pb-2 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('playlists')}
              className={`pb-2 cursor-pointer font-medium ${activeTab === 'playlists' ? 'text-white border-b-2 border-green-400' : 'text-zinc-400'}`}
            >
              Playlists
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`pb-2 cursor-pointer font-medium ${activeTab === 'recent' ? 'text-white border-b-2 border-green-400' : 'text-zinc-400'}`}
            >
              Recently Played
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <ScrollArea className="h-[300px]">
          {activeTab === 'playlists' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Public Playlists</h2>
              {playlists.length === 0 ? (
                <EmptyPlaylistUi />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-14 max-md:pb-28">
                  {playlists?.map((playlist) => (
                    <div key={playlist._id} className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group'>
                      <div className='relative mb-4'>
                        {playlist?.imageUrl ? (
                          <div className='aspect-square rounded-md shadow-lg overflow-hidden relative'>
                            <Image
                              src={playlist.imageUrl}
                              alt={playlist.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              quality={100}
                              className='object-cover transition-transform duration-300 group-hover:scale-105'
                              priority={true}
                            />
                          </div>) : (
                          <div className='aspect-square flex items-center justify-center bg-zinc-700/10 rounded-md shadow-lg overflow-hidden relative'>
                            <Music className='size-16 text-zinc-500' />
                          </div>
                        )}
                        {
                          playlist.songs?.length > 0 && (
                            <Button
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayPlaylist(playlist);
                              }}
                              className={`absolute bottom-3 cursor-pointer right-2 bg-green-500 hover:bg-green-400 md:hover:scale-105 transition-all md:opacity-0 md:translate-y-2 md:group-hover:translate-y-0 ${currentPlaylist?._id === playlist._id && isCurrentSongInPlaylists ? "md:opacity-100" : "md:opacity-0 md:group-hover:opacity-100"}`}
                            >
                              {currentPlaylist?._id === playlist?._id && isPlaying && isCurrentSongInPlaylists ? (
                                <Pause className="size-5 text-black" />
                              ) : (
                                <Play className="size-5 text-black" />
                              )}
                            </Button>
                          )
                        }
                      </div>
                      <Link href={`/playlists/${playlist._id}`}>
                        <h3 className='font-medium mb-2 truncate'>
                          {playlist.title}
                        </h3>
                        <div className='flex items-center gap-1'>
                          <p className='text-sm text-zinc-400 truncate'>{user?.fullName}</p>
                          <span className='text-sm text-zinc-400 truncate'>• {playlist?.songs?.length || 0} songs</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'recent' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Recently Played Songs</h2>
              {
                userRecentPlayedSongs.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-zinc-400 text-lg">Your recently played songs will appear here</p>
                    <p className="text-zinc-500 text-sm mt-2">Play some songs to see them in your history</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-14 max-md:pb-28">
                    {userRecentPlayedSongs?.map((song, i) => (
                      <div key={i} className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group'>
                        <div className='relative mb-4'>
                          {song?.imageUrl ? (<div className='aspect-square rounded-md shadow-lg overflow-hidden relative'>
                            <Image
                              src={song.imageUrl}
                              alt={song.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              quality={100}
                              className='object-cover transition-transform duration-300 group-hover:scale-105'
                              priority={true}
                            />
                          </div>) : (
                            <div className='aspect-square flex items-center justify-center bg-zinc-700/10 rounded-md shadow-lg overflow-hidden relative'>
                              <Music className='size-16 text-zinc-500' />
                            </div>
                          )}
                          <PlayButton song={song} />
                          <RemoveSongFromHistoryButton song={song} />
                        </div>
                        <h3 className='font-medium mb-2 truncate'>
                          {song.title}
                        </h3>
                        <p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
                      </div>
                    ))}
                  </div>
                )
              }

            </div>
          )}
        </ScrollArea>
      </div>
    </div >
  );
};

export default ProfilePage;





const EmptyPlaylistUi = () => {
  const { isCreatingPlaylist, createPlaylist } = playlistStore();
  return (
    <div className='h-full w-full flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-lg'>
      {/* Empty state icon */}
      <div className='relative w-24 h-24 flex items-center justify-center'>
        <div className='absolute inset-0 bg-gradient-to-br from-[#1db954]/10 to-[#1db954]/30 rounded-full blur-md' />
        <div className='relative z-10'>
          <svg
            className='w-16 h-16 text-[#1db954]'
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M12 18v-6" />
            <path d="M9 15h6" />
          </svg>
        </div>
      </div>

      <div className='space-y-2 max-w-[280px]'>
        <h3 className='text-xl font-bold text-white tracking-tight'>No Playlists Yet</h3>
        <p className='text-sm text-gray-300/90 leading-relaxed'>
          Create your first playlist to organize your favorite tracks
        </p>
      </div>

      <button
        onClick={() => createPlaylist()}
        className='mt-4 px-6 py-2.5 bg-[#1db954] hover:bg-[#1ed760] rounded-full text-black font-medium text-sm flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-[#1db954]/20'
        disabled={isCreatingPlaylist}
      >
        {isCreatingPlaylist ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating...
          </>
        ) : (
          <div className='cursor-pointer flex items-center gap-2'>
            <Plus className="w-4 h-4" />
            New Playlist
          </div>
        )}
      </button>
    </div>
  )
}