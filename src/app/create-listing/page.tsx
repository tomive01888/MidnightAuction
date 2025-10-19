"use client";

import { useCallback, useEffect, useMemo } from "react";
import { Container, Box, CircularProgress, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ListingForm, { ListingFormData } from "@/components/ListingForm";
import { useMutation } from "@/hooks/useMutation";
import AuctionApi, { ListingPayload } from "@/lib/api";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function CreateListingPage() {
  const router = useRouter();
  const { userProfile, accessToken, isLoading: isAuthLoading } = useAuth();

  useDocumentTitle("Creating new listing - Midnight Auction House");

  const createListingMutation = useMutation(
    (newListing: ListingPayload) => {
      const api = new AuctionApi(accessToken!);
      return api.createListing(newListing);
    },
    {
      onSuccess: (result) => {
        router.push(`/listings/${result.data.id}`);
      },
    }
  );

  const handleSubmit = useCallback(
    (data: ListingFormData) => {
      createListingMutation.mutate(data);
    },
    [createListingMutation]
  );

  const initialData = useMemo(() => ({}), []);

  useEffect(() => {
    if (!isAuthLoading && !userProfile) {
      router.push("/login");
    }
  }, [isAuthLoading, userProfile, router]);

  if (isAuthLoading || !userProfile) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Container component="main" maxWidth="md" sx={{ py: 5 }}>
        {createListingMutation.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {createListingMutation.error}
          </Alert>
        )}
        <ListingForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={createListingMutation.isLoading}
          submitButtonText="Create Auction"
        />
      </Container>
    </>
  );
}
