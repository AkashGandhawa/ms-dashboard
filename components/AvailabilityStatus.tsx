'use client';

import { AvailabilityCheckResponse } from '@/types';

interface AvailabilityStatusProps {
  data: AvailabilityCheckResponse | null;
  loading: boolean;
  error: { message: string } | null;
}

export function AvailabilityStatus({
  data,
  loading,
  error,
}: AvailabilityStatusProps) {
  if (loading) {
    return (
      <div className="p-6 bg-surface-card rounded-3xl border border-surface flex items-center gap-3">
        <span className="inline-flex h-4 w-4 rounded-full border-2 border-transparent border-t-accent-yellow animate-spin" />
        <p className="text-sm text-muted">Loading details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-accent-red/10 border border-accent-red rounded-3xl">
        <p className="text-accent-red font-semibold">Error loading details</p>
        <p className="text-muted text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const isAvailable = data.status === 'available';

  return (
    <div className={`p-6 rounded-3xl border-2 ${
      isAvailable
        ? 'border-green-500/70 bg-green-500/10'
        : 'border-accent-red bg-accent-red/10'
    }`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-2">
          <div className={`w-4 h-4 rounded-full ${
            isAvailable ? 'bg-green-500' : 'bg-accent-red'
          }`} />
        </div>

        <div className="flex-1">
          <div className="mb-4 md:flex md:items-end md:justify-between md:gap-4">
            <div>
              <h3 className="text-xl font-bold text-body">
                {data.name}
              </h3>
              <p className="text-muted text-sm mt-2">
                {data.role} (ID: {data.id})
              </p>
            </div>

            <div className="mt-4 md:mt-0 p-3 bg-surface-card rounded-3xl">
              <p className="text-sm text-muted">
                Availability on <span className="text-accent-yellow font-semibold">{data.requested_date}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isAvailable
                ? 'bg-green-600 text-white'
                : 'bg-accent-red text-white'
            }`}>
              {isAvailable ? '✓ Available' : '✗ Busy'}
            </span>
          </div>

          {!isAvailable && data.reason && (
            <div className="mt-4 p-3 bg-accent-red/10 rounded-3xl">
              <p className="text-body">{data.reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
