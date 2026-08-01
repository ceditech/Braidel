import type { BookingProviderDTO } from "@/lib/booking-domain";

export interface ProviderReviewHistoryDTO {
  action: "created" | "updated";
  previousScore: number | null;
  previousComment: string;
  newScore: number;
  newComment: string;
  createdAt: string;
}

export interface ProviderReviewDTO {
  id: string;
  bookingId: string;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  serviceName: string;
  appointmentStartsAt: string;
  appointmentEndsAt: string;
  timezone: string;
  client: {
    name: string;
    email: string;
  };
  history: ProviderReviewHistoryDTO[];
}

export interface ProviderReviewDashboardDTO {
  provider: BookingProviderDTO | null;
  totalReviews: number;
  averageRating: number;
  fiveStarShare: number;
  editedReviews: number;
  latestReviewAt: string | null;
  distribution: Array<{ score: 1 | 2 | 3 | 4 | 5; count: number; percentage: number }>;
  reviews: ProviderReviewDTO[];
}
