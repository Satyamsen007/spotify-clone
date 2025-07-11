import { Button } from '@/components/ui/button'
import { userStore } from '@/store/userStore'
import { Loader2, Trash2 } from 'lucide-react';

const RemoveSongFromHistoryButton = ({ song }) => {
  const { removePlayedSongs, isRemovingSongId } = userStore();
  const handleRemoveSong = () => {
    removePlayedSongs(song?._id);
  }
  return (
    <Button
      size="icon"
      onClick={handleRemoveSong}
      className={`absolute bottom-14 cursor-pointer right-2 bg-black/80 hover:bg-black/70 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 ${isRemovingSongId === song._id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
    >
      {isRemovingSongId === song._id ? (
        <Loader2 className="size-5 text-red-500 animate-spin" />
      ) : (
        <Trash2 className="size-5 text-red-500" />
      )}
    </Button>
  )
}

export default RemoveSongFromHistoryButton