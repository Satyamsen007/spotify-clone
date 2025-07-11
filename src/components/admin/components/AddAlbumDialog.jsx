'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { musicStore } from "@/store/musicStore";
import axios from "axios";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const AddAlbumDialog = () => {
  const { fetchAlbums, fetchStats } = musicStore();
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    artist: '',
    releaseYear: new Date().getFullYear()
  });
  const [imagefile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!imagefile) {
        return toast.error("Image FIle are required.")
      }
      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist", newAlbum.artist);
      formData.append("releaseYear", newAlbum.releaseYear.toString());
      formData.append("image", imagefile);

      const response = await axios.post('/api/albums/create-album', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      if (response.status === 200) {
        setAlbumDialogOpen(false);
        setNewAlbum({
          title: "",
          artist: '',
          releaseYear: ''
        });
        setImageFile(null);
        fetchAlbums();
        fetchStats();
        toast.success(response.data.message || "Album Added Successfully");
      }
    } catch (error) {
      console.log("Got Error while Create a Album", error?.response?.data.message);
      toast.error("Something Went wrong", error)
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet-500 cursor-pointer hover:bg-violet-600 text-white">
          <Plus className="mr-2 size-4" />
          Add Album
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto scroll-bar-hidden">
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
          <DialogDescription>
            Add a new album to your collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <input type="file"
            accept="image/*"
            ref={imageInputRef}
            hidden
            onChange={(e) => setImageFile(e.target.files?.[0])}
          />

          {/* Image Upload Area */}
          <div className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
            onClick={() => imageInputRef.current?.click()}
          >
            <div className="text-center">
              {
                imagefile ? (
                  <div className="space-y-2">
                    <div className="text-sm text-violet-500">Image selected</div>
                    <div className="text-xs text-zinc-400">{imagefile.name.slice(0, 20)}</div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                      <Upload className="size-6 text-zinc-400" />
                    </div>
                    <div className="text-sm text-zinc-400 mb-2">Upload album artwork</div>
                    <Button variant="outline" size="sm" className="text-xs cursor-pointer">
                      Choose File
                    </Button>
                  </>
                )
              }
            </div>
          </div>

          {/* Other Feilds */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Album Title</label>
            <Input
              value={newAlbum.title}
              onChange={(e) => setNewAlbum((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter album title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Input
              value={newAlbum.artist}
              onChange={(e) => setNewAlbum((prev) => ({ ...prev, artist: e.target.value }))}
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter artist name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Release Year</label>
            <Input
              type={"number"}
              min={1900}
              max={new Date().getFullYear()}
              value={newAlbum.releaseYear}
              placeholder="Enter realese year"
              onChange={(e) => setNewAlbum((prev) => ({ ...prev, releaseYear: parseInt(e.target.value) }))}
              className="bg-zinc-800 border-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setAlbumDialogOpen(false)} className="cursor-pointer" disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} className="cursor-pointer bg-violet-500 hover:bg-violet-600"
            disabled={isLoading || !imagefile || !newAlbum.title || !newAlbum.artist}
          >
            <p className="text-sm text-zinc-800">
              {isLoading ? "uploading..." : "Add Album"}
            </p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddAlbumDialog;