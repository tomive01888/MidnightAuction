"use client";

import { useEffect, useCallback } from "react";
import { Container, Box, CircularProgress, Alert } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ListingForm, { ListingFormData } from "@/components/ListingForm";
import { useApi } from "@/hooks/useApi";
import { useMutation } from "@/hooks/useMutation";
import AuctionApi, { ListingPayload } from "@/lib/api";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile, accessToken, isLoading: isAuthLoading } = useAuth();
  const id = params.id as string;

  const getListingApiCall = useCallback(() => new AuctionApi().getListing(id), [id]);
  const { data: listing, isLoading: isFetching, error: fetchError } = useApi(getListingApiCall);

  const updateListingMutation = useMutation(
    (updatedListing: ListingPayload) => {
      const api = new AuctionApi(accessToken!);
      return api.updateListing(id, updatedListing);
    },
    {
      onSuccess: (result) => {
        router.push(`/listings/${result.data.id}`);
      },
    }
  );

  const handleSubmit = (data: ListingFormData) => {
    updateListingMutation.mutate(data);
  };

  useEffect(() => {
    if (!isAuthLoading && !userProfile) {
      router.push("/login");
    }

    if (listing && userProfile && listing.seller?.name !== userProfile.name) {
      router.push(`/listings/${id}`);
    }
  }, [isAuthLoading, userProfile, listing, router, id]);

  if (isFetching || isAuthLoading || !listing) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">{fetchError}</Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ py: 5 }}>
      {updateListingMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {updateListingMutation.error}
        </Alert>
      )}
      <ListingForm
        initialData={listing}
        onSubmit={handleSubmit}
        isLoading={updateListingMutation.isLoading}
        submitButtonText="Save Changes"
      />
    </Container>
  );
}
