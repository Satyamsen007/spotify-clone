'use client';

import AudioPlayer from "@/components/mainlayout/components/AudioPlayer";
import LeftSideBar from "@/components/mainlayout/components/LeftSideBar";
import PlayBackControls from "@/components/mainlayout/components/PlayBackControls";
import PlayBackHub from "@/components/mainlayout/components/PlayBackHub";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useCheckIsMobile } from "@/hooks/useCheckIsMobile";
import { musicStore } from "@/store/musicStore";
import { usePlayerStore } from "@/store/playerStore";
import { playlistStore } from "@/store/playlistStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


export default function MainLayout({ children }) {
  const { isMobile } = useCheckIsMobile();
  const { currentSong } = usePlayerStore();
  const { data: session } = useSession()
  const showRightSidebar = !isMobile && currentSong && (session || session?.user);
  const { fetchPlaylists } = playlistStore();
  const { fetchAlbums } = musicStore();

  useEffect(() => {
    fetchAlbums();
    fetchPlaylists();
  }, [fetchAlbums, fetchPlaylists]);
  
  return (
    <div className=" h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full overflow-hidden p-2 max-md:p-0">
        <AudioPlayer />
        {/* Left Side Bar */}
        {!isMobile && (
          <>
            <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
              <LeftSideBar />
            </ResizablePanel>
            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
          </>
        )}

        {/* Main content */}
        <ResizablePanel defaultSize={isMobile ? 100 : 60}>
          {children}
        </ResizablePanel>
        {
          showRightSidebar && (
            <>
              <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
              {/* Right sidebar */}
              <ResizablePanel defaultSize={28} minSize={0} maxSize={32} collapsedSize={0}>
                <PlayBackHub />
              </ResizablePanel>
            </>
          )
        }
      </ResizablePanelGroup>

      <PlayBackControls />
    </div>
  );
}
