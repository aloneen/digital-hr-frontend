export type RequestType = 'VACATION' | 'ADVANCE' | 'SICK_LEAVE' | 'OTHER';
export type RequestStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type HrRequest = {
  id: number;
  employeeId: number;
  employeeName: string;
  type: RequestType;
  status: RequestStatus;
  startDate?: string | null;
  endDate?: string | null;
  durationDays?: number | null;
  amount?: number | null;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: number | null;
  reviewerName?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
};

export type HrRequestCreateRequest = {
  type: RequestType;
  startDate?: string | null;
  endDate?: string | null;
  amount?: number | null;
  comment?: string | null;
};

export type HrRequestReviewRequest = {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
};
