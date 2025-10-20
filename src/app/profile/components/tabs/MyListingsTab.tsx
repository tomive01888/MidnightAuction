"use client";

import { useState, useMemo, useCallback } from "react";
import { Box, CircularProgress, Typography, Switch, FormControlLabel } from "@mui/material";
import { Masonry } from "@mui/lab";
import AuctionApi from "@/lib/api";
import ManagedListingCard from "../ManagedListingCard";
import { useApi } from "@/hooks/useApi";

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

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, width: "100%" }}>
        <FormControlLabel
          control={<Switch checked={showEnded} onChange={(e) => setShowEnded(e.target.checked)} />}
          label="Show Ended Listings"
        />
      </Box>
      {filteredListings.length === 0 ? (
        <Typography align="center" sx={{ p: 5, color: "text.secondary" }}>
          No listings to display.
        </Typography>
      ) : (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {filteredListings.map((listing, index) => (
            <ManagedListingCard listing={listing} index={index} key={listing.id} onDeleteSuccess={refetch} />
          ))}
        </Masonry>
      )}
    </>
  );
}
