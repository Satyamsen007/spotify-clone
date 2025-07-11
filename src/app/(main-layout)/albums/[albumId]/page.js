import AlbumPage from '@/pages/AlbumPage'

export async function generateMetadata({ params }) {
  const parts = await params.albumId.split('-');
  const albumName = parts.slice(1).join(' ');
  return {
    title: `${albumName} | Album | Spotify Clone`,
    description: `Listen to ${albumName} album on Spotify Clone. Stream all tracks, see artist details, and add songs to your playlists.`,
    icons: {
      icon: '/spotify.png',
    },
  };
}

const page = async ({ params }) => {
  const parts = await params.albumId.split('-');
  const albumId = parts[0]
  return (
    <AlbumPage albumId={albumId} />
  )
}

export default page;