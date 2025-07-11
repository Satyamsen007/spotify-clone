import { ScrollArea } from '@/components/ui/scroll-area';
import { playlistStore } from '@/store/playlistStore';
import { Loader2, Plus } from 'lucide-react';

const EmptyPlaylistUi = () => {
  const { isCreatingPlaylist, createPlaylist } = playlistStore();
  return (
    <ScrollArea className="h-[250px] mb-8">
      <div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-black/90 to-zinc-900/80 rounded-lg border border-gray-800'>
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
    </ScrollArea>
  )
}

export default EmptyPlaylistUi;