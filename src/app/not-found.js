import NotFoundPage from '@/pages/NotFoundPage';

export const metadata = {
  title: 'Page Not Found - Spotify Clone',
  description: 'The page you are looking for does not exist. Please try searching for something else.',
  icons: {
    icon: '/spotify.png',
  },
};

const NotFound = () => {
  return (
    <NotFoundPage />
  )
}

export default NotFound;