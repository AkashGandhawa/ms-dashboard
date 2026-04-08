'use client';

import { useEffect, useRef, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Member, MembersListResponse, AvailabilityCheckResponse, AvailabilityCheckRequest } from '@/types';
import { Header } from './Header';
import { MemberList } from './MemberList';
import { AvailabilityStatus } from './AvailabilityStatus';
import { ErrorAlert } from './ErrorAlert';

export function Dashboard() {
  // State management
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dismissedError, setDismissedError] = useState(false);

  // API hooks
  const membersApi = useApi<MembersListResponse>();
  const availabilityApi = useApi<AvailabilityCheckResponse>();

  // Fetch members on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await membersApi.request('/api/members', 'GET');
        setMembers(response.members || []);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };

    fetchMembers();
  }, []);

  const availabilitySectionRef = useRef<HTMLDivElement | null>(null);

  // Fetch availability when member and date are selected
  useEffect(() => {
    if (!selectedMemberId || !selectedDate) {
      return;
    }

    const checkAvailability = async () => {
      try {
        setDismissedError(false);
        const payload: AvailabilityCheckRequest = {
          msp_id: selectedMemberId,
          date: selectedDate,
        };
        await availabilityApi.request('/api/availability/check', 'POST', payload as unknown as Record<string, unknown>);
      } catch (error) {
        console.error('Failed to check availability:', error);
      }
    };

    checkAvailability();
  }, [selectedMemberId, selectedDate]);

  useEffect(() => {
    if (!selectedMemberId || !selectedDate || !availabilitySectionRef.current) {
      return;
    }

    const element = availabilitySectionRef.current;
    const rect = element.getBoundingClientRect();
    const isCompletelyConcealed = rect.bottom <= 0 || rect.top >= window.innerHeight;

    if (isCompletelyConcealed) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.focus({ preventScroll: true });
    }
  }, [selectedMemberId, selectedDate]);

  const selectedMember = members.find(m => m.id === selectedMemberId);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedMember && selectedDate && (
          <section className="mb-10">
            <div
              ref={availabilitySectionRef}
              tabIndex={-1}
              className="rounded-3xl border border-surface bg-surface-strong p-6 shadow-xl shadow-accent-red/10"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-body">Availability Details</h2>
              </div>

              {!dismissedError && availabilityApi.error && (
                <ErrorAlert
                  title="Could not load availability details"
                  message={availabilityApi.error.message}
                  onDismiss={() => setDismissedError(true)}
                />
              )}

              <AvailabilityStatus
                data={availabilityApi.data}
                loading={availabilityApi.loading}
                error={availabilityApi.error && !dismissedError ? availabilityApi.error : null}
              />
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="rounded-3xl border border-surface bg-surface-strong p-6 shadow-xl shadow-accent-yellow/5">
            <MemberList
              members={members}
              loading={membersApi.loading}
              error={membersApi.error}
              selectedMemberId={selectedMemberId}
              onMemberSelect={setSelectedMemberId}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </section>

        <footer className="mt-12 border-t border-surface pt-6 text-center text-sm text-muted">
          © 2026 W.A.G.Rodrigo for MoraSpirit. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
