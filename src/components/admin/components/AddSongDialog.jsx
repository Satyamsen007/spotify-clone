'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { musicStore } from "@/store/musicStore";
import axios from "axios";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const AddSongDialog = () => {
  const { albums, fetchSongs, fetchStats } = musicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSong, setNewSong] = useState({
    title: "",
    artist: '',
    albumId: undefined,
    duration: 0
  });
  const [files, setFiles] = useState({
    audio: null,
    image: null
  });
  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!files.audio && !files.image) {
        return toast.error("Audio File and Image FIle are required.")
      }
      const formData = new FormData();
      formData.append("title", newSong.title);
      formData.append("artist", newSong.artist);
      formData.append("duration", newSong.duration);
      if (newSong.albumId && newSong.albumId !== 'none') {
        formData.append("albumId", newSong.albumId);
      }
      formData.append("audio", files.audio);
      formData.append("image", files.image);

      const response = await axios.post('/api/songs/create-song', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      if (response.status === 200) {
        setSongDialogOpen(false);
        setNewSong({
          title: "",
          artist: '',
          albumId: undefined,
          duration: 0
        });
        setFiles({
          audio: null,
          image: null
        });
        fetchSongs();
        fetchStats();
        toast.success(response.data.message || "Song Added Successfully");
      }
    } catch (error) {
      console.log("Got Error while Create a Song", error?.response?.data.message);
      toast.error("Something Went Wrong", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 cursor-pointer hover:bg-emerald-600 text-black">
          <Plus className="mr-2 size-4" />
          Add Song
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto scroll-bar-hidden">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>
            Add a new song to your music library
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input type="file"
            accept="audio/*"
            ref={audioInputRef}
            hidden
            onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files[0] }))}
          />

          <input type="file"
            accept="image/*"
            ref={imageInputRef}
            hidden
            onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files[0] }))}
          />

          {/* Image Upload Area */}
          <div className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
            onClick={() => imageInputRef.current?.click()}
          >
            <div className="text-center">
              {
                files.image ? (
                  <div className="space-y-2">
                    <div className="text-sm text-emerald-500">Image selected</div>
                    <div className="text-xs text-zinc-400">{files.image.name.slice(0, 20)}</div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                      <Upload className="size-6 text-zinc-400" />
                    </div>
                    <div className="text-sm text-zinc-400 mb-2">Upload artwork</div>
                    <Button variant="outline" size="sm" className="text-xs cursor-pointer">
                      Choose File
                    </Button>
                  </>
                )
              }
            </div>
          </div>

          {/* Audio Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Audio File</label>
            <div className="flex items-center gap-2">
              <Button variant={"outline"} onClick={() => audioInputRef.current?.click()} className="w-full">
                {files.audio ? files.audio.name.slice(0, 32) : "Choose Audio File"}
              </Button>
            </div>
          </div>

          {/* Other Feilds */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={newSong.title}
              onChange={(e) => setNewSong((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Input
              value={newSong.artist}
              onChange={(e) => setNewSong((prev) => ({ ...prev, artist: e.target.value }))}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (seconds)</label>
            <Input
              type={"number"}
              min="0"
              value={newSong.duration}
              onChange={(e) => setNewSong((prev) => ({ ...prev, duration: parseInt(e.target.value) || '' }))}
              className="bg-zinc-800 border-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="space-y-2 w-full">
            <label className="text-sm font-medium">Album (Optional)</label>
            <div className="w-full">
              <Select
                value={newSong.albumId}
                onValueChange={(value) => setNewSong((prev) => ({ ...prev, albumId: value }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 w-full">
                  <SelectValue placeholder="Select album" className="w-full text-left" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 min-w-[var(--radix-select-trigger-width)]">
                  <SelectItem value="none">No Album (Single)</SelectItem>
                  {albums.map((album) => (
                    <SelectItem key={album._id} value={album._id}>
                      {album.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setSongDialogOpen(false)} disabled={isLoading} className="cursor-pointer">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading || (!files.audio && !files.image) || !newSong.title || !newSong.artist || !newSong.duration || !newSong.albumId} className="cursor-pointer">
            <p className="text-sm text-zinc-800">
              {isLoading ? "uploading..." : "Add Song"}
            </p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddSongDialog;