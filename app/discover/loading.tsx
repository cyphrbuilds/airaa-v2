export default function DiscoverLoading() {
  return (
    <div className="pb-8">
      {/* Ticker Skeleton */}
      <div className="h-10 border-b border-zinc-800/50 bg-zinc-900/30 animate-pulse" />

      {/* Search Bar Skeleton */}
      <div className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="h-12 bg-zinc-800/50 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Featured Section */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-zinc-800/50 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-zinc-800/50 rounded animate-pulse" />
                </div>
              </div>
              
              {/* Carousel Skeleton */}
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className="min-w-[320px] h-[280px] rounded-xl bg-zinc-800/30 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </section>

            {/* Browse Section */}
            <section>
              <div className="h-6 w-40 bg-zinc-800 rounded animate-pulse mb-4" />
              
              {/* Category Pills Skeleton */}
              <div className="flex gap-2 mb-6">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-8 w-20 bg-zinc-800/30 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>

              {/* Community List Skeleton */}
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-20 rounded-xl bg-zinc-800/30 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Skeleton */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="rounded-xl border border-zinc-800 p-4">
              <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-16 rounded-lg bg-zinc-800/30 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
