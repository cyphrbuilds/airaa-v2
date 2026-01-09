export default function ProfileLoading() {
  return (
    <div className="min-h-screen p-6">
      {/* Profile Header Skeleton */}
      <div className="relative rounded-2xl border border-zinc-800 p-8 mb-8 overflow-hidden">
        <div className="relative flex items-start gap-6">
          {/* Avatar */}
          <div className="h-24 w-24 rounded-full bg-zinc-800 animate-pulse" />
          
          <div className="flex-1">
            {/* Name and Badge */}
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
              <div className="h-6 w-24 bg-zinc-800/50 rounded-full animate-pulse" />
            </div>
            <div className="h-4 w-40 bg-zinc-800/30 rounded animate-pulse mb-6" />
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-zinc-800 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-zinc-800/50 rounded animate-pulse" />
                    <div className="h-7 w-24 bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="rounded-xl border border-zinc-800 p-4"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="h-4 w-20 bg-zinc-800/50 rounded animate-pulse mb-2 mx-auto" />
            <div className="h-8 w-24 bg-zinc-800 rounded animate-pulse mx-auto" />
          </div>
        ))}
      </div>

      {/* Guilds Section Skeleton */}
      <div className="rounded-xl border border-zinc-800 mb-8">
        <div className="p-4 border-b border-zinc-800">
          <div className="h-5 w-28 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-3">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="h-16 w-48 rounded-lg bg-zinc-800/30 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800">
            <div className="p-4 border-b border-zinc-800">
              <div className="h-5 w-36 bg-zinc-800 rounded animate-pulse" />
            </div>
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, j) => (
                <div 
                  key={j} 
                  className="h-16 rounded-lg bg-zinc-800/30 animate-pulse"
                  style={{ animationDelay: `${j * 100}ms` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
