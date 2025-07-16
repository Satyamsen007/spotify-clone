import ProfilePage from "@/pages/ProfilePage";

export const metadata = {
  title: 'Your Profile | Spotify Clone',
  description: 'View and edit your Spotify Clone profile. Manage your account details, see your listening history, and check your favorite playlists and artists.',
  icons: {
    icon: '/spotify.png',
  },
};

const page = () => {
  return (
    <ProfilePage />
  )
}

export default page