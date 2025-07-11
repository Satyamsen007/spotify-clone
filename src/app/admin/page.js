import AdminPage from "@/pages/AdminPage";

export const metadata = {
  title: 'Admin Dashboard | Spotify Clone',
  description: 'Manage the Spotify Clone platform. Add songs, artists, and albums, moderate content, and view user statistics in the admin dashboard.',
  icons: {
    icon: '/spotify.png',
  },
};

const page = () => {
  return (
    <AdminPage />
  )
}

export default page;