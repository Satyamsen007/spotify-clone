import { Skeleton } from "@/components/ui/skeleton";

const FeaturedGridSkeleton = () => {
	return (
		<div className="mb-8">
			<Skeleton className="h-8 w-48 mb-6 bg-zinc-700" />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className="flex items-center bg-zinc-800/50 rounded-md overflow-hidden group relative"
					>
						{/* Album Cover Skeleton */}
						<Skeleton className="size-16 sm:size-20 rounded-none bg-zinc-700" />

						{/* Text Skeleton */}
						<div className="flex-1 p-4 space-y-2">
							<Skeleton className="h-4 w-3/4 bg-zinc-700" />
							<Skeleton className="h-3 w-1/2 bg-zinc-700" />
						</div>
					</div>
				))}
			</div>
		</div>

	);
};
export default FeaturedGridSkeleton;