'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/store/playerStore";
import { playlistStore } from "@/store/playlistStore";
import { CirclePlus, Loader2, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const AddSongToPlaylist = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentSong } = usePlayerStore();
  const { playlists, addSongToPlaylist, addingSongToPlaylistId, removeSongFromPlaylist, removingSongToPlaylistId, createPlaylist, isCreatingPlaylist } = playlistStore();
  const [searchQuery, setSearchQuery] = useState('')
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const filteredPlaylists = playlists?.filter(playlist =>
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreatePlaylist = async () => {
    await createPlaylist(newPlaylistName);
    setShowCreateForm(false)
    setNewPlaylistName('')
  }
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-zinc-400 cursor-pointer hover:text-white">
          <CirclePlus className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#282828] border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add to playlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <Input
              placeholder="Find a playlist"
              className="pl-10 bg-[#3e3e3e] border-none text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Playlists list */}
          <ScrollArea className="h-[200px]">
            {filteredPlaylists.length > 0 ? (
              <div className="space-y-2">
                {filteredPlaylists.map(playlist => {
                  const isSongInPlaylist = playlist?.songs?.some(song =>
                    typeof song === 'object' ? song._id === currentSong?._id : song === currentSong?._id
                  );
                  const isAdding = addingSongToPlaylistId === playlist._id;
                  const isRemoving = removingSongToPlaylistId === playlist._id;

                  return (
                    <div
                      key={playlist._id}
                      className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer"
                      onClick={() => !isSongInPlaylist && console.log(`Adding to ${playlist.title}`)}
                    >
                      <div className="flex flex-col w-[70%] overflow-hidden">
                        <p className="font-medium truncate" title={playlist.title}>
                          {playlist.title}
                        </p>
                        <p className="text-xs text-zinc-400">{playlist.songs.length} songs</p>
                      </div>
                      <div className="w-[20%] flex justify-end">
                        {isSongInPlaylist ? (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSongFromPlaylist(currentSong._id, playlist._id);
                            }}
                            variant="ghost"
                            size="sm"
                            disabled={isRemoving}
                            className="text-green-500 hover:!bg-white/5 cursor-pointer"
                          >
                            {
                              removingSongToPlaylistId === playlist._id ? (
                                <Loader2 className="size-4 animate-spin shrink-0" />
                              ) : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="hover:!bg-transparent cursor-pointer">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem className="text-white cursor-pointer">
                                      <Trash2 className="mr-2 w-4 h-4" />
                                      Remove from Playlist
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>

                              )
                            }

                          </Button>
                        ) : (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              addSongToPlaylist(currentSong._id, playlist._id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-green-500 hover:text-green-400 cursor-pointer"
                            disabled={isAdding}
                          >
                            {isAdding ? (
                              <span className="flex items-center gap-1">
                                <Loader2 className="size-3 animate-spin shrink-0" />
                                Adding...
                              </span>
                            ) : (
                              "Add"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400">
                No playlists found
              </div>
            )}
          </ScrollArea>

          {/* Create new playlist section */}
          {showCreateForm ? (
            <div className="space-y-3 pt-2">
              <Input
                placeholder="Playlist name"
                className="bg-[#3e3e3e] border-none text-white"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCreatePlaylist}
                  className="bg-white hover:!bg-white cursor-pointer text-zinc-800 font-semibold"
                  disabled={isCreatingPlaylist}
                >
                  {
                    isCreatingPlaylist ? (
                      <span className='flex items-center gap-1'>
                        <Loader2 className='size-4 animate-spin shrink-0' />
                        Creating...
                      </span>
                    ) : (
                      "Create"
                    )
                  }

                </Button>
                <Button
                  variant="outline"
                  className="text-white border-zinc-600 cursor-pointer"
                  onClick={() => setShowCreateForm(false)}
                  disabled={isCreatingPlaylist}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full text-white hover:text-green-400 flex items-center justify-end gap-2 cursor-pointer"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="size-4" />
              <span>New playlist</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddSongToPlaylist