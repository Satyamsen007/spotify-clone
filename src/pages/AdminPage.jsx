'use client';

import AdminNavbar from '@/components/admin/components/AdminNavbar';
import AlbumsTabContent from '@/components/admin/components/AlbumsTabContent';
import DashBoardStats from '@/components/admin/components/DashBoardStats';
import SongsTabContent from '@/components/admin/components/SongsTabContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { musicStore } from '@/store/musicStore';
import { Album, Music } from 'lucide-react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const AdminPage = () => {
  if (typeof window === "undefined") return null;
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = session?.user?.admin;
  const { fetchAlbums, fetchSongs, fetchStats } = musicStore();

  useEffect(() => {
    if (user) {
      fetchAlbums();
      fetchSongs();
      fetchStats();
    }
  }, [user, fetchAlbums, fetchSongs, fetchStats]);

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="mt-2 text-neutral-400">You do not have admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8 max-md:p-5'>
      <AdminNavbar />
      <DashBoardStats />
      <Tabs defaultValue="songs" className="space-y-6">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger value="songs" className="data-[state=active]:bg-zinc-700 cursor-pointer">
            <Music className='mr-2 size-4' />
            Songs
          </TabsTrigger>
          <TabsTrigger value="albums" className="data-[state=active]:bg-zinc-700 cursor-pointer">
            <Album className='mr-2 size-4' />
            Albums
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>
        <TabsContent value="albums">
          <AlbumsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPage;