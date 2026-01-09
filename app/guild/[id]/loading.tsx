export default function GuildLoading() {
  return (
    <div className="flex h-full flex-col">
      {/* App Header Skeleton */}
      <div className="sticky top-0 z-20 flex-shrink-0 border-b border-zinc-800/50 bg-[#111111]/95">
        <div className="flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-zinc-800/50 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-zinc-800/50 rounded animate-pulse" />
              <div className="h-3 w-40 bg-zinc-800/30 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-9 w-24 bg-zinc-800/50 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 p-6">
        {/* Banner Skeleton */}
        <div className="h-48 rounded-xl bg-zinc-800/30 animate-pulse mb-6" />
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="h-24 rounded-xl bg-zinc-800/30 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        
        {/* Two Column Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="h-64 rounded-xl bg-zinc-800/30 animate-pulse" />
          <div className="h-64 rounded-xl bg-zinc-800/30 animate-pulse" style={{ animationDelay: '100ms' }} />
        </div>

        {/* Campaign Cards Skeleton */}
        <div className="mb-4">
          <div className="h-6 w-40 bg-zinc-800/30 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="h-48 rounded-xl bg-zinc-800/30 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
