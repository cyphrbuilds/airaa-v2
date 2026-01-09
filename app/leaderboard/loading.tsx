export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative border-b border-zinc-800/50">
        <div className="relative px-6 py-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-green-500/20 animate-pulse" />
            <div className="h-10 w-48 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="h-5 w-96 bg-zinc-800/50 rounded animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Tabs and Filter Skeleton */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="h-10 w-64 bg-zinc-800/50 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="h-9 w-24 bg-zinc-800/30 rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Top 3 Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className={`rounded-xl border border-zinc-800 p-6 ${i === 0 ? 'md:order-2' : i === 1 ? 'md:order-1' : 'md:order-3'}`}
            >
              <div className="flex flex-col items-center">
                <div className="h-5 w-5 bg-zinc-800 rounded animate-pulse mb-4" />
                <div className="h-20 w-20 rounded-full bg-zinc-800 animate-pulse mb-4" />
                <div className="h-5 w-28 bg-zinc-800 rounded animate-pulse mb-2" />
                <div className="h-8 w-24 bg-zinc-800 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-zinc-800/50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 py-4 px-4 border-b border-zinc-800 bg-zinc-900/30">
            {['Rank', 'User', 'Earnings', 'Campaigns', 'Score'].map((_, i) => (
              <div 
                key={i} 
                className="h-4 w-16 bg-zinc-800/50 rounded animate-pulse"
              />
            ))}
          </div>
          
          {/* Table Rows */}
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="grid grid-cols-5 gap-4 py-4 px-4 border-b border-zinc-800/50"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="h-5 w-8 bg-zinc-800/30 rounded animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-800 animate-pulse" />
                <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="h-5 w-20 bg-zinc-800/50 rounded animate-pulse ml-auto" />
              <div className="h-5 w-8 bg-zinc-800/30 rounded animate-pulse ml-auto" />
              <div className="h-5 w-16 bg-zinc-800/30 rounded animate-pulse ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
