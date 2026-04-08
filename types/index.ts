// API Request/Response Types

export interface Member {
  id: string;
  name: string;
  role: string;
}

export interface MembersListResponse {
  count: number;
  members: Member[];
}

export interface AvailabilityCheckRequest {
  msp_id: string;
  date: string;
}

export interface AvailabilityCheckResponse {
  requested_date: string;
  id: string;
  name: string;
  role: string;
  status: 'available' | 'busy';
  reason?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}
