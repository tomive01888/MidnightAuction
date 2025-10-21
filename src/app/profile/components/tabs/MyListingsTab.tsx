"use client";

import { useState, useMemo, useCallback } from "react";
import { Box, Typography, Switch, FormControlLabel, Grid } from "@mui/material";
import AuctionApi from "@/lib/api";
import ManagedListingCard from "../ManagedListingCard";
import { useApi } from "@/hooks/useApi";
import SkeletonGrid from "@/components/SkeletonGrid";
import { Listing } from "@/lib/types";

interface MyListingsTabProps {
  userName: string;
  accessToken: string;
}

export default function MyListingsTab({ userName, accessToken }: MyListingsTabProps) {
  const [showEnded, setShowEnded] = useState(false);

  const getListingsApiCall = useCallback(
    () => new AuctionApi(accessToken).getProfileListings(userName),
    [userName, accessToken]
  );

  const { data: listings, isLoading, refetch } = useApi(getListingsApiCall);

  const filteredListings = useMemo(() => {
    if (!listings) return [];
    if (showEnded) return listings;
    return listings.filter((listing) => new Date(listing.endsAt) > new Date());
  }, [listings, showEnded]);

  if (isLoading && !listings) {
    return <SkeletonGrid count={filteredListings.length} />;
  }

  if (!isLoading && filteredListings.length === 0) {
    return (
      <Typography align="center" sx={{ p: 5, color: "text.secondary" }}>
        {showEnded ? "You have no listing history." : "You have no active listings."}
      </Typography>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={showEnded} onChange={(e) => setShowEnded(e.target.checked)} />}
          label="Show Ended Listings"
        />
      </Box>
      <Grid container spacing={3}>
        {filteredListings.map((listing: Listing, index: number) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={listing.id}>
            <ManagedListingCard listing={listing} index={index} onDeleteSuccess={refetch} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
