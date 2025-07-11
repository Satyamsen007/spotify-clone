import { Button } from '@/components/ui/button'
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { playlistStore } from '@/store/playlistStore'
import { Music, Pencil } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

const PlaylistEditDialog = ({ currentPlaylist }) => {
  const [title, setTitle] = useState(currentPlaylist?.title);
  const [description, setDescription] = useState(currentPlaylist?.description);
  const [newPlaylistImage, setNewPlaylistImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(currentPlaylist?.imageUrl || currentPlaylist?.songs[0]?.imageUrl || '');
  const imageInputRef = useRef(null);
  const { updatePlaylist, isUpdatingPlaylist } = playlistStore()

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPlaylistImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (newPlaylistImage instanceof File) {
      formData.append("image", newPlaylistImage);
    }
    updatePlaylist(formData, currentPlaylist._id);
  };

  return (
    <DialogContent className="md:max-w-[600px] bg-[#282828] border-zinc-700">
      <DialogHeader>
        <DialogTitle>Edit Details</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className='w-full flex max-md:flex-col max-md:overflow-y-scroll max-md:h-[70vh] justify-around items-center gap-4 mb-5'>
          {/* Image Upload Section */}
          <div className='relative group'>
            {imagePreview ? (
              <Image
                src={imagePreview}
                width={240}
                height={240}
                alt={`Album cover for ${title}`}
                className='w-[200px] h-[200px] max-md:size-[250px] shadow-xl rounded object-cover'
              />
            ) : (
              <div className='w-[200px] h-[200px] max-md:size-[250px] rounded-md shadow-xl bg-zinc-700 flex items-center justify-center'>
                <Music className='size-16 text-zinc-400' />
              </div>
            )}
            <div
              onClick={() => imageInputRef.current.click()}
              className='absolute inset-0 bg-black/50 opacity-0 max-md:hidden group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer rounded-md'
            >
              <Pencil className='size-6 text-white' />
            </div>
            <Input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            <div
              onClick={() => imageInputRef.current.click()}
              className='absolute md:hidden w-12 h-10 flex items-center justify-center left-[45%] top-[84%] inset-0 bg-black/50 cursor-pointer rounded-t-full'
            >
              <Pencil className='size-4 text-white' />
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-6 py-2 md:w-[50%] w-[95%] ">
            {/* Playlist Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-white">
                Name
              </Label>
              <Input
                id="name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#3e3e3e] border-none text-white h-12 rounded-md hover:bg-[#4a4a4a] focus-visible:ring-2 focus-visible:ring-green-500"
                placeholder="My Playlist #1"
              />
            </div>


            {/* Playlist Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-white">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[#3e3e3e] border-none text-white min-h-[100px] rounded-md hover:bg-[#4a4a4a] focus-visible:ring-2 focus-visible:ring-green-500"
                placeholder="Add an optional description"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-white hover:!bg-white text-black font-semibold cursor-pointer"
            disabled={isUpdatingPlaylist}
          >
            {
              isUpdatingPlaylist ? "Updating.." : "Save changes"
            }
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>

  )
}

export default PlaylistEditDialog