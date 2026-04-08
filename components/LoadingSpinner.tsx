'use client';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-surface/60" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-yellow border-r-accent-red animate-spin" />
      </div>
      <p className="mt-4 text-body font-medium">Loading...</p>
    </div>
  );
}
