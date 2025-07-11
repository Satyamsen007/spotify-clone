'use client';

import { SessionProvider } from 'next-auth/react';

const AuthProvider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <InnerAuth>{children}</InnerAuth>
    </SessionProvider>
  );
};

export default AuthProvider;

// This component safely uses useSession inside SessionProvider
import { useSession } from 'next-auth/react';

const InnerAuth = ({ children }) => {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className='h-screen w-full bg-black flex items-center justify-center p-4'>
        <div className="w-full max-w-sm bg-[#121212] rounded-lg p-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
              <img
                src="/spotify.png"
                alt="Spotify"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8"
              />
            </div>
          </div>
          <h3 className='text-white text-2xl font-bold mb-3'>Welcome to Spotify</h3>
          <p className='text-[#b3b3b3] text-sm mb-8'>We're preparing your music experience</p>
          <div className="flex justify-center space-x-1.5 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 h-6 bg-green-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
          <p className="text-xs text-[#727272]">Loading your library...</p>
        </div>
      </div>
    );
  }

  return children;
};
