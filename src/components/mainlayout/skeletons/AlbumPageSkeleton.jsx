import { Skeleton } from '@/components/ui/skeleton';

const AlbumPageSkeleton = () => {
  return (
    <div className="h-full">
      <div className="h-full rounded-md max-md:rounded-none">
        <div className="relative min-h-full">
          {/* Background skeleton */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 via-zinc-900/50 to-zinc-900" />

          {/* Content skeleton */}
          <div className="relative z-10">
            {/* Album Header Skeleton */}
            <div className="flex flex-wrap p-6 gap-6 pb-8">
              <Skeleton className="w-[240px] h-[240px] max-md:size-[200px] rounded shadow-xl" />
              <div className="flex flex-col justify-end flex-1 gap-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-16 w-full max-w-[500px] max-md:h-12" />
                <div className="flex gap-4 flex-wrap">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>

            {/* Play Button Skeleton */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Skeleton className="w-14 h-14 max-md:size-10 rounded-full" />
            </div>

            {/* Songs Table Skeleton */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* Table Head Skeleton */}
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-6 py-3">
                <Skeleton className="h-4 w-4 mx-auto" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24 hidden md:block" />
                <div className="flex justify-end pr-4">
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>

              {/* Songs List Skeleton */}
              <div className="px-2">
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={`row-${i}`}
                      className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-2 py-3"
                    >
                      <Skeleton className="h-4 w-4 mx-auto" />
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Skeleton className="size-10 rounded-sm" />
                        <div className="min-w-0 flex flex-col w-[50%] overflow-hidden gap-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-24 hidden md:block" />
                      <Skeleton className="h-4 w-10 ml-auto mr-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumPageSkeleton;