import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { musicStore } from '@/store/musicStore';
import { Calendar, Loader2, Trash } from 'lucide-react';
import Image from 'next/image';
import AdminSongsSkeleton from '../skeletons/AdminSongsSkeleton';

const SongsTable = () => {
  const { songs, isLoading, deletingSongId, error, deleteSong } = musicStore();

  if (isLoading) {
    return (
      <AdminSongsSkeleton />
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-red-400'>
          {error}
        </div>
      </div>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Release Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {songs.map((song) => (
          <TableRow key={song._id} className="hover:bg-zinc-800/50">
            <TableCell>
              <div className="relative size-10 rounded overflow-hidden">
                <Image
                  src={song.imageUrl}
                  alt={song.title}
                  fill
                  sizes="(max-width: 640px) 40px, 40px"
                  quality={85}
                  className="object-cover"
                  priority={songs.indexOf(song) < 5}
                />
              </div>
            </TableCell>
            <TableCell>
              {song.title}
            </TableCell>
            <TableCell>
              {song.artist}
            </TableCell>
            <TableCell>
              <span className='inline-flex items-center gap-1 text-zinc-400'>
                <Calendar className='size-4' />
                {song.createdAt.split("T")[0]}
              </span>
            </TableCell>

            <TableCell className="text-right">
              <div className='flex gap-2 justify-end'>
                <Button variant="ghost" size="sm"
                  className="text-rose-400 cursor-pointer hover:text-red-300 hover:bg-red-400/50"
                  onClick={() => deleteSong(song._id)}
                >
                  {deletingSongId === song._id ? <Loader2 className="size-4 animate-spin" /> : <Trash className='size-4' />}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default SongsTable;