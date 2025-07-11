'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { playlistStore } from '@/store/playlistStore';
import { CheckCheck, Loader2, Music, Plus, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useMemo } from 'react';

const AlbumSongSearchDialog = ({ songs, playlistId }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = useMemo(() => {
    if (!searchQuery) return songs;
    const query = searchQuery.toLowerCase();
    return songs.filter(song =>
      song.title.toLowerCase().includes(query) ||
      song.artist?.toLowerCase().includes(query)
    );
  }, [songs, searchQuery]);
  const { addSongToPlaylist, removeSongFromPlaylist, addingSongId, playlists, removingSongId } = playlistStore();
  return (
    <div className="py-4">
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search songs..."
          className="flex-1 max-md:flex-[0.7] bg-zinc-800 border-zinc-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline" className="bg-zinc-800 max-md:hidden border-zinc-700 cursor-pointer">
          <Search className="size-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => {
            const isAdding = addingSongId === song._id;
            const isRemoving = removingSongId === song._id;
            const currentPlaylist = playlists.find(p => p._id === playlistId);
            const isAlreadyInPlaylist = currentPlaylist?.songs?.some(playlistSong =>
              typeof playlistSong === 'object' ? playlistSong._id === song?._id : playlistSong === song?._id
            );
            return (
              <div key={song._id} className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 relative rounded-sm flex-shrink-0">
                    {song.imageUrl ? (
                      <Image
                        src={song.imageUrl}
                        alt={`${song.title} cover`}
                        fill
                        sizes="40px"
                        className="object-cover rounded-sm"
                      />
                    ) : (
                      <div className="size-full bg-zinc-700 rounded-sm flex items-center justify-center">
                        <Music className="size-4 text-zinc-400" />
                      </div>
                    )}
                    <div className='absolute w-full h-full bg-black/80 md:hidden'>
                      {isAlreadyInPlaylist ? (
                        isRemoving ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled
                            className="text-red-500"
                          >
                            <Loader2 className="size-4 animate-spin" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 cursor-pointer hover:text-red-400"
                            onClick={() => removeSongFromPlaylist(song._id, playlistId)}
                          >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        )
                      ) : isAdding ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled
                          className="text-green-500"
                        >
                          <Loader2 className="size-4 animate-spin" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-500 hover:text-green-400 cursor-pointer"
                          onClick={() => addSongToPlaylist(song._id, playlistId)}
                        >
                          <Plus className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{song.title}</p>
                    <div className="flex items-center w-[80%] overflow-hidden">
                      <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 max-md:hidden">
                  {isAlreadyInPlaylist ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-500 hover:text-green-400"
                        disabled
                      >
                        <CheckCheck className="size-4 mr-2" />
                        <span className='max-md:hidden'>Added</span>
                      </Button>
                      {isRemoving ? (
                        <Loader2 className='size-4 text-red-500 animate-spin shrink-1' />
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 cursor-pointer hover:text-red-400"
                          onClick={() => removeSongFromPlaylist(song._id, playlistId)}
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </>
                  ) : isAdding ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="text-green-500"
                    >
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      <span className='max-md:hidden'>Adding...</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-500 hover:text-green-400 cursor-pointer"
                      onClick={() => addSongToPlaylist(song._id, playlistId)}
                    >
                      <Plus className="size-4 mr-2" />
                      <span className='max-md:hidden'> Add</span>
                    </Button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-400">No songs found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div >
  );
};


export default AlbumSongSearchDialog;