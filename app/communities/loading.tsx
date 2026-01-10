export default function CommunitiesLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section Skeleton */}
      <div className="border-b border-zinc-800/50 bg-gradient-to-b from-zinc-900/50 to-transparent">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="h-9 w-64 bg-zinc-800 rounded-lg animate-pulse mx-auto mb-3" />
            <div className="h-5 w-96 bg-zinc-800/50 rounded animate-pulse mx-auto" />
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="h-14 bg-zinc-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Section Skeleton */}
        {[1, 2, 3].map((section) => (
          <div key={section} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-zinc-800 rounded animate-pulse" />
                <div className="h-8 w-8 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((card) => (
                <div 
                  key={card}
                  className="min-w-[240px] h-[180px] bg-zinc-800/50 rounded-xl animate-pulse flex-shrink-0"
                />
              ))}
            </div>
          </div>
        ))}

        {/* List Skeleton */}
        <div className="mt-8">
          <div className="h-7 w-56 bg-zinc-800 rounded animate-pulse mb-6" />
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((pill) => (
              <div key={pill} className="h-8 w-20 bg-zinc-800 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((row) => (
              <div 
                key={row}
                className="h-20 bg-zinc-800/30 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
