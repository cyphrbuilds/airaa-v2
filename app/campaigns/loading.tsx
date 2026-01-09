export default function CampaignsLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden">
        <div className="relative px-6 py-16 max-w-7xl mx-auto text-center">
          {/* Stats badge skeleton */}
          <div className="flex justify-center mb-6">
            <div className="h-9 w-64 bg-green-500/10 rounded-full animate-pulse" />
          </div>
          
          {/* Title skeleton */}
          <div className="h-14 w-80 bg-zinc-800 rounded-lg mx-auto mb-4 animate-pulse" />
          
          {/* Subtitle skeleton */}
          <div className="space-y-2 mb-10">
            <div className="h-5 w-96 bg-zinc-800/50 rounded mx-auto animate-pulse" />
            <div className="h-5 w-64 bg-zinc-800/50 rounded mx-auto animate-pulse" />
          </div>

          {/* Search bar skeleton */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="h-12 bg-zinc-800/50 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Campaign Grid Skeleton */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Filters Row Skeleton */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="h-9 w-24 bg-zinc-800/30 rounded animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
          <div className="h-9 w-32 bg-zinc-800/30 rounded animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="rounded-2xl border border-zinc-800/50 overflow-hidden"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Image skeleton */}
              <div className="aspect-[4/3] bg-zinc-800/50 animate-pulse" />
              
              {/* Content skeleton */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-zinc-800 animate-pulse" />
                    <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-24 bg-zinc-800/50 rounded animate-pulse" />
                </div>
                
                <div className="flex items-center justify-between py-3 border-y border-zinc-800/50">
                  <div className="h-4 w-16 bg-zinc-800/50 rounded animate-pulse" />
                  <div className="h-6 w-24 bg-zinc-800 rounded animate-pulse" />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="space-y-1">
                      <div className="h-3 w-12 bg-zinc-800/30 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-zinc-800/50 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
