import { Skeleton } from '@/components/ui/skeleton'

const SectionGridSkeleton = () => {
  return (
    <div className="mb-20">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-1/3 bg-zinc-700 rounded" />
        <Skeleton className="h-5 w-16 bg-zinc-700 rounded-full" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-zinc-800/40 p-4 rounded-md group">
            {/* Album Art Skeleton with Play Button */}
            <div className="relative mb-4">
              <Skeleton className="aspect-square rounded-md bg-zinc-700" />
            </div>

            {/* Text Skeleton */}
            <Skeleton className="h-5 w-3/4 bg-zinc-700 rounded mb-2" />
            <Skeleton className="h-4 w-1/2 bg-zinc-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionGridSkeleton