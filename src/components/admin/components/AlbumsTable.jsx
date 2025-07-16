import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { musicStore } from '@/store/musicStore';
import { Calendar, Loader2, Music, Trash } from 'lucide-react';
import Image from 'next/image';
import AdminSongsSkeleton from '../skeletons/AdminSongsSkeleton';

const AlbumsTable = () => {
  const { albums, isLoading, deletingAlbumId, error, deleteAlbum } = musicStore();

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
          <TableHead>Release Year</TableHead>
          <TableHead>Songs</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {albums.map((album) => (
          <TableRow key={album._id} className="hover:bg-zinc-800/50">
            <TableCell>
              <div className="relative size-10 rounded overflow-hidden">
                <Image
                  src={album.imageUrl}
                  alt={album.title}
                  fill
                  sizes="(max-width: 640px) 40px, 40px"
                  quality={85}
                  className="object-cover"
                  priority={albums.indexOf(album) < 5} // Prioritize first 5 images
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">
              {album.title}
            </TableCell>
            <TableCell>
              {album.artist}
            </TableCell>
            <TableCell>
              <span className='inline-flex items-center gap-1 text-zinc-400'>
                <Calendar className='size-4' />
                {album.releaseYear}
              </span>
            </TableCell>
            <TableCell>
              <span className='inline-flex items-center gap-1 text-zinc-400'>
                <Music className='size-4' />
                {album.songs.length} songs
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className='flex gap-2 justify-end'>
                <Button variant="ghost" size="sm"
                  className="text-rose-400 cursor-pointer hover:text-red-300 hover:bg-red-400/50"
                  onClick={() => deleteAlbum(album._id)}
                >
                  {deletingAlbumId === album._id ? <Loader2 className="size-4 animate-spin" /> : <Trash className='size-4' />}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default AlbumsTable;