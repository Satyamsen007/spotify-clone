'use client';

import SignInAuthButton from '@/components/SignInAuthButton';
import { buttonVariants } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { musicStore } from '@/store/musicStore';
import { playlistStore } from '@/store/playlistStore';
import { CircleX, HomeIcon, Library, Loader2, Music, Plus, Trash2, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PlaylistSkeleton from '../skeletons/PlaylistSkeleton';
import EmptyPlaylistUi from './EmptyPlaylistUi';

const LeftSideBar = ({ setOpenSideBar }) => {
  const { albums, isLoading } = musicStore();
  const { playlists, isGetingPlaylists, isCreatingPlaylist, createPlaylist, deletePlaylist, isDeletingPlaylistId } = playlistStore();
  const router = useRouter()

  const { data: session } = useSession();

  return (
    <div className='h-full flex flex-col relative gap-2 max-md:bg-zinc-900 max-md:h-screen'>
      {/* Navigation Menu */}
      <div className='rounded-lg bg-zinc-900 p-4 max-md:border-b-2 max-md:border-zinc-800/60 max-md:rounded-b-none max-md:sticky max-md:top-0'>
        <div className='space-y-2'>
          <Link href="/"
            className={cn(buttonVariants(
              {
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800"
              }
            ))}
          >
            <HomeIcon className='mr-2 size-5' />
            <span>Home</span>
          </Link>
          {session && session.user && (
            <Link href="/profile"
              className={cn(buttonVariants(
                {
                  variant: "ghost",
                  className: "w-full justify-start text-white hover:bg-zinc-800"
                }
              ))}
            >
              <User className='mr-2 size-5' />
              <span>Your Profile</span>
            </Link>
          )}
        </div>
        <div onClick={() => setOpenSideBar(false)} className='absolute top-[10px] right-3 md:hidden'>
          <CircleX className='size-5' />
        </div>
      </div>


      {/* Librery Section */}
      <div className='flex-1 rounded-lg bg-zinc-900 p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center text-white px-2'>
            <Library className='size-5 mr-2' />
            <span> Your Librery</span>
          </div>

          {
            (session && session.user) && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className='flex items-center gap-1 px-4 select-none py-2 cursor-pointer bg-zinc-800 rounded-full'>
                    {
                      isCreatingPlaylist ? (
                        <span className='text-sm font-semibold animate-pulse'>Creating...</span>
                      ) : (
                        <>
                          <Plus className='size-5 font-semibold text-zinc-400' />
                          <span className='text-sm font-semibold'>Create</span>
                        </>
                      )
                    }

                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-zinc-900 text-white rounded-md shadow-lg p-1 border border-zinc-700"
                  align="end"
                >
                  <DropdownMenuItem onClick={() => createPlaylist()} className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-zinc-800 rounded focus:bg-zinc-800 focus:text-white outline-none">
                    <Plus className="size-4" />
                    <span>Create playlist</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }
        </div>
        {
          (session && session.user) ? (
            (playlists.length === 0 && !isGetingPlaylists) ? (
              <EmptyPlaylistUi />
            ) : (
              <ScrollArea className="h-[200px] mb-8">
                <div className='space-y-2'>
                  {isGetingPlaylists ? (
                    <PlaylistSkeleton />
                  ) : (
                    playlists.map((playlist) => (
                      <Link
                        href={`/playlists/${playlist._id}`}
                        key={playlist._id}
                        className='relative p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
                      >
                        <div className="relative size-12 rounded-md flex-shrink-0 bg-zinc-800">
                          {playlist.imageUrl ? (
                            <Image
                              src={playlist.imageUrl}
                              alt={`${playlist.title} cover`}
                              fill
                              sizes="(max-width: 768px) 48px, 48px"
                              quality={85}
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-full h-full group-hover:hidden flex items-center justify-center rounded-md">
                              <Music className="text-zinc-400" />
                            </div>
                          )}
                          <div
                            className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/60 rounded-md z-10"
                            onClick={(e) => e.preventDefault()}
                          >
                            <button onClick={() => {
                              deletePlaylist(playlist._id)
                              router.push("/")
                            }} className="p-1 rounded cursor-pointer hover:bg-zinc-700">
                              {
                                isDeletingPlaylistId === playlist._id ? <Loader2 className="w-4 h-4 text-red-500 animate-spin" /> : <Trash2 className="w-4 h-4 text-red-500" />
                              }
                            </button>
                          </div>
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className="flex items-center w-[60%] overflow-hidden">
                            <p className="font-medium truncate" title={playlist.title}>
                              {playlist.title}
                            </p>
                          </div>
                          <p className='text-sm text-zinc-400 truncate'>
                            Playlist • {session?.user?.fullName}
                          </p>
                        </div>

                        <div
                          className="items-center justify-center md:hidden p-2 bg-black/60 rounded-md z-10"
                          onClick={(e) => e.preventDefault()}
                        >
                          <button onClick={() => {
                            deletePlaylist(playlist._id)
                            router.push("/")
                          }} className="p-1 rounded cursor-pointer hover:bg-zinc-700">
                            {
                              isDeletingPlaylistId === playlist._id ? <Loader2 className="w-4 h-4 text-red-500 animate-spin" /> : <Trash2 className="w-4 h-4 text-red-500" />
                            }
                          </button>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </ScrollArea>
            )
          ) : (
            <PlayListPrompt />
          )
        }

        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center text-white px-2'>
            <Library className='size-5 mr-2' />
            <span>Discover</span>
          </div>
        </div>

        <ScrollArea className="h-[200px]">
          <div className='space-y-2'>
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  href={`/albums/${album._id}-${encodeURIComponent(album.title.toLowerCase().replace(/\s+/g, '-'))}`}
                  key={album._id}
                  className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
                >
                  <div className='relative size-12 rounded-md flex-shrink-0'>
                    <Image
                      src={album.imageUrl}
                      alt={`${album.title} cover`}
                      fill
                      sizes="(max-width: 768px) 48px, 48px"
                      quality={85}
                      className='object-cover rounded-md'
                      priority={false}
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className="flex items-center w-[60%] overflow-hidden">
                      <p className="font-medium truncate" title={album.title}>
                        {album.title}
                      </p>
                    </div>
                    <p className='text-sm text-zinc-400 truncate'>
                      Album • {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>

      </div>
    </div >
  )
}

export default LeftSideBar;



const PlayListPrompt = () => (
  <ScrollArea className="h-[350px] mb-8">
    <div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-black/90 to-zinc-900/80 rounded-lg border border-gray-800'>
      {/* Elegant playlist icon with animation */}
      <div className='relative w-24 h-24 flex items-center justify-center'>
        <div className='absolute inset-0 bg-gradient-to-br from-[#1db954]/10 to-[#1db954]/30 rounded-full blur-md' />
        <div className='relative z-10'>
          <svg
            className='w-16 h-16 text-[#1db954] animate-float'
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 11h18v11.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 22.5V11z" />
            <path d="M3 11V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v5" />
            <path d="M7 9V5" />
            <path d="M17 9V5" />
            <path d="M10 15h4" />
          </svg>
        </div>
      </div>

      {/* Refined text styling */}
      <div className='space-y-2 max-w-[280px]'>
        <h3 className='text-xl font-bold text-white tracking-tight'>Your Playlists Await</h3>
        <p className='text-sm text-gray-300/90 leading-relaxed'>
          Sign in to Spotify to explore and manage your music collections
        </p>
      </div>

      <SignInAuthButton />

      {/* Subtle disclaimer */}
      <p className='text-xs text-gray-500/80 pt-1'>
        We'll only access your playlist data
      </p>
    </div>
  </ScrollArea>
)