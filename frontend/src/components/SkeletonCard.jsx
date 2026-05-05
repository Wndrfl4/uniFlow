export default function SkeletonCard() {
  return (
    <div className="card p-6 h-full flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 rounded-t-2xl" />
      <div className="flex gap-1.5 mb-3">
        <div className="h-5 w-14 bg-slate-100 rounded-full animate-pulse" />
        <div className="h-5 w-10 bg-slate-100 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
      </div>
      <div className="h-5 bg-slate-100 rounded-lg mb-2 w-5/6 animate-pulse" style={{ animationDelay: '50ms' }} />
      <div className="h-4 bg-slate-100 rounded-lg mb-1.5 w-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <div className="h-4 bg-slate-100 rounded-lg mb-1.5 w-full animate-pulse" style={{ animationDelay: '200ms' }} />
      <div className="h-4 bg-slate-100 rounded-lg mb-1.5 w-3/4 animate-pulse" style={{ animationDelay: '250ms' }} />
      <div className="flex-1" />
      <div className="border-t border-slate-50 pt-4 mt-4 flex items-center justify-between">
        <div className="h-3.5 w-20 bg-slate-100 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
        <div className="flex gap-3">
          <div className="h-3.5 w-8 bg-slate-100 rounded animate-pulse" style={{ animationDelay: '350ms' }} />
          <div className="h-3.5 w-8 bg-slate-100 rounded animate-pulse" style={{ animationDelay: '400ms' }} />
          <div className="h-3.5 w-16 bg-slate-100 rounded animate-pulse" style={{ animationDelay: '450ms' }} />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative">
          <SkeletonCard />
        </div>
      ))}
    </div>
  )
}
