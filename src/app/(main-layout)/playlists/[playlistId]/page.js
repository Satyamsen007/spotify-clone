import PlaylistPage from '@/pages/PlaylistPage';

export const metadata = {
  title: 'Your Personal Playlist | Spotify Clone',
  description: 'Dive into your custom music selection. Play, edit and share your unique playlist with friends on our Spotify Clone platform.',
  icons: {
    icon: '/spotify.png',
  },
};

const page = async ({ params }) => {
  const { playlistId } = await params;

  return (
    <PlaylistPage playlistId={playlistId} />
  )
}

export default page;