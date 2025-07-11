import { Skeleton } from "@/components/ui/skeleton";

const PlaylistSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="p-2 rounded-md flex items-center gap-3">
          {/* Album cover skeleton */}
          <Skeleton className="size-12 rounded-md bg-zinc-800" />

          {/* Text skeleton (hidden on mobile like the original) */}
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-3/4 bg-zinc-800" />
            <Skeleton className="h-3 w-1/2 bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  )
};
export default PlaylistSkeleton;