'use client';

import { Member } from '@/types';
import { MemberCard } from './MemberCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';
import { DateSelector } from './DateSelector';

interface MemberListProps {
  members: Member[];
  loading: boolean;
  error: { message: string } | null;
  selectedMemberId: string | null;
  onMemberSelect: (memberId: string) => void;
  selectedDate: string | null;
  onDateChange: (date: string) => void;
}

export function MemberList({
  members,
  loading,
  error,
  selectedMemberId,
  onMemberSelect,
  selectedDate,
  onDateChange,
}: MemberListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error.message} title="Failed to load members" />;
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted text-lg">No members found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="mb-2 sm:mb-0">
          <p className="text-muted">
            <span className="text-accent-yellow font-semibold">{members.length}</span> members
          </p>
        </div>

        <div className="w-full sm:w-auto max-w-sm">
          <DateSelector selectedDate={selectedDate} onDateChange={onDateChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isSelected={selectedMemberId === member.id}
            onSelect={onMemberSelect}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * LAYOUT CHOICE RATIONALE: Card Layout
 * 
 * Why Cards over Grid:
 * 1. Information Density: Cards allow showing member ID, name, and role together
 * 2. Interaction Clarity: Clear visual feedback with border highlight when selected
 * 3. Responsive Design: Better scaling from mobile to desktop with automatic wrapping
 * 4. Visual Hierarchy: Clear separation of members makes it easy to scan
 * 5. Accessibility: Larger touch targets (important for mobile/accessibility)
 * 6. Future Extensibility: Easy to add badges, badges, or quick action buttons
 * 
 * This design prioritizes usability and information architecture over pure efficiency.
 */
