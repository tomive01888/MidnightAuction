/**
 * Represents a single error object from the API.
 */
export interface ApiErrorDetail {
  code?: string;
  message: string;
  path?: string[];
}

/**
 * Represents the top-level error response from the API.
 */
export interface ApiError {
  errors: ApiErrorDetail[];
  status: string;
  statusCode: number;
}

/**
 * Represents the pagination and metadata object in API responses.
 
 */
export interface ApiResponseMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

/**
 * A generic type for successful API responses.
 * @template T The type of the data payload.
 */
export interface ApiResponse<T> {
  data: T;
  meta?: ApiResponseMeta;
}

/**
 * Represents an image or media object used in listings and profiles.
 */
export interface Media {
  url: string;
  alt: string;
}

/**
 * Represents a user profile in the auction system.
 */
export interface UserProfile {
  name: string;
  email: string;
  bio?: string | null;
  avatar?: Media | null;
  banner?: Media | null;
  credits: number;
  listings?: Listing[];
  wins?: Listing[];
  _count?: {
    listings: number;
    wins: number;
  };
}

/**
 * Represents a bid made by a user on a listing.
 */
export interface Bid {
  id: string;
  amount: number;
  bidder: UserProfile;
  created: string;
  listing?: Listing;
}

/**
 * Represents an auction listing.
 */
export interface Listing {
  id: string;
  title: string;
  description?: string | null;
  tags: string[];
  media: Media[];
  created: string;
  updated: string;
  endsAt: string;
  seller?: UserProfile;
  bids?: Bid[];
  _count: {
    bids: number;
  };
}
