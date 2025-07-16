import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/store/playerStore";
import { Pause, Play } from "lucide-react";

const PlayButton = ({ song, }) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(song)
  };
  return (
    <Button
      size="icon"
      onClick={handlePlay}
      className={`absolute bottom-3 cursor-pointer right-2 bg-green-500 hover:bg-green-400 md:hover:scale-105 transition-all md:opacity-0 md:translate-y-2 md:group-hover:translate-y-0 ${isCurrentSong ? "md:opacity-100" : "md:opacity-0 md:group-hover:opacity-100"}`}
    >
      {isCurrentSong && isPlaying ? (
        <Pause className="md:size-5 size-4 text-black" />
      ) : (
        <Play className="md:size-5 size-4 text-black" />
      )}
    </Button>
  )
}

export default PlayButton