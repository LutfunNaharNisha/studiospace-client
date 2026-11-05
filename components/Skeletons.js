import { FiAperture } from 'react-icons/fi';

export function StudioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100">
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="flex justify-between pt-4">
          <div className="skeleton h-7 w-20" />
          <div className="skeleton h-8 w-28" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <StudioCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageLoader({ label = 'Loading' }) {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status">
      <div className="flex flex-col items-center gap-3">
        <FiAperture className="h-12 w-12 animate-spin text-primary [animation-duration:2.4s]" />
        <p className="text-sm text-base-content/60">{label}...</p>
      </div>
    </div>
  );
}

export function RowsSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-24 w-full rounded-2xl" />
      ))}
    </div>
  );
}
