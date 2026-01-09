export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo/Spinner */}
        <div className="relative">
          <div className="h-12 w-12 rounded-xl bg-green-500/20 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-zinc-400">Loading</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  )
}
