"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { Container, Box, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import AuctionApi from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import ListingImageGallery from "./components/ListingImageGallery";
import ListingDetails from "./components/ListingDetails";
import BidHistorySection from "./components/BidHistorySection";

export default function ListingPage() {
  const params = useParams();
  const { userProfile, accessToken } = useAuth();
  const id = params.id as string;
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);

  const getListingApiCall = useCallback(() => new AuctionApi().getListing(id), [id]);
  const { data: listing, isLoading, error, refetch } = useApi(getListingApiCall);

  useDocumentTitle(`${listing?.title} - Midnight Auction House`);

  useEffect(() => {
    if (listing?.media && listing.media.length > 0) {
      setMainImage(listing.media[0].url);
    }
  }, [listing]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !listing) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">{error || "Listing not found."}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Box component="article" sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
        <ListingImageGallery
          media={listing.media}
          title={listing.title}
          mainImage={mainImage}
          onImageSelect={setMainImage}
        />

        <ListingDetails listing={listing} userProfile={userProfile} accessToken={accessToken} onBidSuccess={refetch} />
      </Box>

      <BidHistorySection bids={listing.bids || []} />
    </>
  );
}
