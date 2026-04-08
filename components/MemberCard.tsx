'use client';

import { Member } from '@/types';

interface MemberCardProps {
  member: Member;
  isSelected: boolean;
  onSelect: (memberId: string) => void;
}

export function MemberCard({ member, isSelected, onSelect }: MemberCardProps) {
  return (
    <div
      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-accent-yellow bg-surface-strong shadow-xl shadow-accent-yellow/15'
          : 'border-surface bg-surface hover:border-accent-yellow/50'
      }`}
      onClick={() => onSelect(member.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(member.id);
        }
      }}
      aria-pressed={isSelected}
      aria-label={`Select ${member.name} - ${member.role}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-body truncate overflow-hidden whitespace-nowrap">
            {member.name}
          </h3>
          <p className="text-sm text-muted mt-1 truncate overflow-hidden whitespace-nowrap">{member.role}</p>
        </div>
        {isSelected && (
          <div className="ml-3 flex-shrink-0">
            <div className="w-6 h-6 rounded-full border-2 border-accent-yellow flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-accent-yellow" />
            </div>
          </div>
        )}
      </div>
      <div className="text-xs text-muted">ID: {member.id}</div>
    </div>
  );
}
