'use client';

import { Skeleton } from '@/components/ui/skeleton';

const ProfilePageSkeleton = () => {
  return (
    <div className="bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen">
      {/* Gradient Header */}
      <div className="relative">
        <div className="h-64 w-full bg-gradient-to-b from-zinc-700 to-zinc-900 opacity-80"></div>
        <div className="absolute inset-0 flex items-end p-4 md:p-8">
          <div className="flex items-end max-md:flex-col max-md:items-start gap-6 w-full">
            <div className="flex items-end gap-6 flex-1">
              <Skeleton className="h-28 w-28 md:h-42 md:w-42 rounded-full shadow-2xl bg-zinc-700" />
              <div className="mb-4 space-y-3">
                <Skeleton className="h-4 w-24 bg-zinc-700" />
                <Skeleton className="h-10 w-48 md:w-64 bg-zinc-700" />
                <div className="flex gap-6">
                  <Skeleton className="h-4 w-20 bg-zinc-700" />
                  <Skeleton className="h-4 w-28 bg-zinc-700" />
                </div>
              </div>
            </div>
            <div className="mb-8 flex gap-4">
              <Skeleton className="h-10 w-10 rounded-sm bg-zinc-700" />
              <Skeleton className="h-10 w-10 rounded-sm bg-zinc-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 md:px-8 pt-8 max-md:pt-5 pb-32">
        {/* Tabs */}
        <div className="border-b border-zinc-700 pb-2 mb-6">
          <div className="flex gap-8">
            <Skeleton className="h-8 w-24 bg-zinc-700" />
            <Skeleton className="h-8 w-32 bg-zinc-700" />
          </div>
        </div>

        {/* Tab Content - Playlists */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 bg-zinc-700" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-14 max-md:pb-28">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-800/40 p-4 rounded-md">
                <div className="relative mb-4">
                  <Skeleton className="aspect-square w-full rounded-md bg-zinc-700" />
                  <Skeleton className="absolute bottom-3 right-2 h-10 w-10 rounded-full bg-zinc-600" />
                </div>
                <Skeleton className="h-5 w-3/4 mb-2 bg-zinc-700" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16 bg-zinc-700" />
                  <Skeleton className="h-4 w-20 bg-zinc-700" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content - Recently Played (hidden by default) */}
        <div className="hidden space-y-4">
          <Skeleton className="h-8 w-48 bg-zinc-700" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-14 max-md:pb-28">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-800/40 p-4 rounded-md">
                <div className="relative mb-4">
                  <Skeleton className="aspect-square w-full rounded-md bg-zinc-700" />
                  <Skeleton className="absolute bottom-3 right-2 h-10 w-10 rounded-full bg-zinc-600" />
                </div>
                <Skeleton className="h-5 w-3/4 mb-2 bg-zinc-700" />
                <Skeleton className="h-4 w-24 bg-zinc-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;