import axios, { AxiosInstance, AxiosError } from "axios";
import { Listing, UserProfile, Bid, ApiResponse, ApiError } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_NOROFF_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_NOROFF_API_KEY;

export interface AuthResponse {
  data: UserProfile & {
    accessToken: string;
  };
}

export interface ListingPayload {
  title: string;
  description?: string;
  tags?: string[];
  media?: { url: string; alt: string }[];
  endsAt?: Date;
}

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
  avatar?: { url: string; alt?: string };
  banner?: { url: string; alt?: string };
  bio?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw error;
  }
);

export interface FullUserProfileStats extends UserProfile {
  listingsCount: number;
  winsCount: number;
  bidsCount: number;
}

/**
 * Fetches the core profile data and ALL necessary counts for the stats chart
 * in a highly optimized, parallelized way. This is for the initial page load.
 * @param name - The name of the profile to fetch.
 * @param token - The auth token.
 */
export async function getFullProfileStats(name: string, token: string): Promise<ApiResponse<FullUserProfileStats>> {
  const api = new AuctionApi(token);

  const profilePromise = api.getProfile(name);
  const bidsPromise = api.getProfileBids(name);

  try {
    const [profileResponse, bidsResponse] = await Promise.all([profilePromise, bidsPromise]);

    const fullProfileStats: FullUserProfileStats = {
      ...profileResponse.data,
      listingsCount: profileResponse.data._count?.listings || 0,
      winsCount: profileResponse.data._count?.wins || 0,
      bidsCount: bidsResponse.meta?.totalCount || 0,
    };

    return { data: fullProfileStats };
  } catch (error) {
    console.error("Failed to fetch full profile stats in parallel", error);
    throw error;
  }
}

export async function registerUser(credentials: RegisterCredentials) {
  const { data } = await authApi.post<AuthResponse>("/register", credentials);
  return data;
}

export async function loginUser(credentials: LoginCredentials) {
  const { data } = await authApi.post<AuthResponse>("/login", credentials);
  return data;
}

export interface UpdateProfilePayload {
  bio?: string;
  avatar?: {
    url: string;
    alt: string;
  };
}

export type ListingSortKey = "created" | "title" | "endsAt" | "updated";

class AuctionApi {
  private api: AxiosInstance;

  constructor(token?: string) {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/auction`,
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.data) {
          throw error.response.data;
        }
        throw error;
      }
    );
  }

  async getListings(page = 1, limit = 12, sort: ListingSortKey = "created", sortOrder = "desc") {
    const { data } = await this.api.get<ApiResponse<Listing[]>>("/listings", {
      params: { page, limit, sort, sortOrder, _active: true },
    });
    return data;
  }

  async getAllListings(page = 1, limit = 12) {
    const { data } = await this.api.get<ApiResponse<Listing[]>>("/listings", {
      params: { page, limit },
    });
    return data;
  }

  async getListing(id: string, includeAll = true) {
    const { data } = await this.api.get<ApiResponse<Listing>>(`/listings/${id}`, {
      params: { _seller: includeAll, _bids: includeAll },
    });
    return data;
  }

  async searchListings(query: string, page = 1, limit = 12) {
    const { data } = await this.api.get<ApiResponse<Listing[]>>("/listings/search", {
      params: { q: query, page, limit },
    });
    return data;
  }

  async createListing(listingData: ListingPayload) {
    const payload = {
      ...listingData,

      endsAt: listingData.endsAt?.toISOString(),
    };
    const { data } = await this.api.post<ApiResponse<Listing>>("/listings", payload);
    return data;
  }

  async updateListing(id: string, listingData: Partial<ListingPayload>) {
    const payload = {
      ...listingData,

      ...(listingData.endsAt && { endsAt: listingData.endsAt.toISOString() }),
    };
    const { data } = await this.api.put<ApiResponse<Listing>>(`/listings/${id}`, payload);
    return data;
  }

  async deleteListing(id: string) {
    await this.api.delete(`/listings/${id}`);
  }

  async placeBid(listingId: string, amount: number) {
    const { data } = await this.api.post<ApiResponse<Bid>>(`/listings/${listingId}/bids`, { amount });
    return data;
  }

  async getProfile(name: string, includeAll = true) {
    const { data } = await this.api.get<ApiResponse<UserProfile>>(`/profiles/${name}`, {
      params: { _listings: includeAll, _wins: includeAll },
    });
    return data;
  }

  async updateProfile(name: string, profile: UpdateProfilePayload): Promise<ApiResponse<UserProfile>> {
    const { data } = await this.api.put<ApiResponse<UserProfile>>(`/profiles/${name}`, profile);
    return data;
  }

  async getProfileListings(name: string) {
    const { data } = await this.api.get<ApiResponse<Listing[]>>(`/profiles/${name}/listings`);
    return data;
  }

  async getProfileBids(name: string) {
    const { data } = await this.api.get<ApiResponse<Bid[]>>(`/profiles/${name}/bids`, {
      params: { _listings: true, _seller: true },
    });
    return data;
  }

  async getProfileWins(name: string, includeAll = true) {
    const { data } = await this.api.get<ApiResponse<Listing[]>>(`/profiles/${name}/wins`, {
      params: { _listings: includeAll },
    });
    return data;
  }

  async searchProfiles(query: string, page = 1, limit = 12) {
    const { data } = await this.api.get<ApiResponse<UserProfile[]>>("/profiles/search", {
      params: { q: query, page, limit },
    });
    return data;
  }
}

export default AuctionApi;
