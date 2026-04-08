'use client';

import { useEffect, useState } from 'react';

interface DateSelectorProps {
  selectedDate: string | null;
  onDateChange: (date: string) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [minDate, setMinDate] = useState<string>('');

  useEffect(() => {
    // Set minimum date to today
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];
    setMinDate(isoDate);

    // Set default date to today if not selected
    if (!selectedDate) {
      onDateChange(isoDate);
    }
  }, [selectedDate, onDateChange]);

  return (
    <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <label htmlFor="date-picker" className="whitespace-nowrap text-sm font-semibold text-body">
        Check availability on:
      </label>
      <input
        id="date-picker"
        type="date"
        min={minDate}
        value={selectedDate || ''}
        onChange={(e) => onDateChange(e.target.value)}
        className="w-full max-w-sm px-4 py-2.5 bg-surface-strong border border-surface rounded-2xl text-body focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all"
        aria-label="Select date for availability check"
      />
    </div>
  );
}
