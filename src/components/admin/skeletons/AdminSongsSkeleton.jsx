import { Skeleton } from "@/components/ui/skeleton";

const AdminSongsSkeleton = () => {
  return (
    <div className="rounded-md bg-[#121212] border border-zinc-800 overflow-hidden">
      <div className="w-full">
        <div className="border-b border-zinc-800 grid grid-cols-12 px-4 py-3">
          <div className="col-span-1"><Skeleton className="h-4 w-4 bg-zinc-700" /></div>
          <div className="col-span-3"><Skeleton className="h-4 w-24 bg-zinc-700" /></div>
          <div className="col-span-4"><Skeleton className="h-4 w-24 bg-zinc-700" /></div>
          <div className="col-span-2"><Skeleton className="h-4 w-24 bg-zinc-700" /></div>
          <div className="col-span-2 flex justify-end"><Skeleton className="h-4 w-8 bg-zinc-700" /></div>
        </div>

        {[...Array(8)].map((_, i) => (
          <div key={i} className="border-b border-zinc-800 grid grid-cols-12 px-4 py-3 items-center">
            <div className="col-span-1">
              <Skeleton className="h-10 w-10 rounded bg-zinc-700" />
            </div>
            <div className="col-span-3">
              <Skeleton className="h-4 w-32 bg-zinc-700" />
            </div>
            <div className="col-span-4">
              <Skeleton className="h-4 w-24 bg-zinc-700" />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Skeleton className="h-4 w-4 bg-zinc-700" />
              <Skeleton className="h-4 w-20 bg-zinc-700" />
            </div>
            <div className="col-span-2 flex justify-end">
              <Skeleton className="h-8 w-8 rounded-full bg-zinc-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminSongsSkeleton;