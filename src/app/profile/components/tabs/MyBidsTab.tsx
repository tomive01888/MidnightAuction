"use client";

import { useState, useMemo, useCallback } from "react";
import { Box, Typography, Switch, FormControlLabel, Grid } from "@mui/material";
import { useApi } from "@/hooks/useApi";
import AuctionApi from "@/lib/api";
import { Bid } from "@/lib/types";
import SkeletonGrid from "@/components/SkeletonGrid";
import BidCard from "../BidCard";

export default function MyBidsTab({ userName, accessToken }: { userName: string; accessToken: string }) {
  const [showEnded, setShowEnded] = useState(false);

  const getBidsApiCall = useCallback(
    () => new AuctionApi(accessToken).getProfileBids(userName),
    [userName, accessToken]
  );

  const { data: bids, isLoading } = useApi(getBidsApiCall);

  const uniqueHighestBids = useMemo(() => {
    if (!bids) return [];
    const highestBidsMap = bids.reduce((acc, currentBid) => {
      if (!currentBid.listing) return acc;
      const listingId = currentBid.listing.id;
      if (!acc[listingId] || currentBid.amount > acc[listingId].amount) {
        acc[listingId] = currentBid;
      }
      return acc;
    }, {} as Record<string, Bid>);
    return Object.values(highestBidsMap);
  }, [bids]);

  const filteredBids = useMemo(() => {
    if (showEnded) return uniqueHighestBids;
    return uniqueHighestBids.filter((bid) => new Date(bid.listing!.endsAt) > new Date());
  }, [uniqueHighestBids, showEnded]);

  if (isLoading) {
    return <SkeletonGrid count={filteredBids.length} />;
  }

  if (!isLoading && filteredBids.length === 0) {
    return (
      <Typography component={"p"} align="center" sx={{ p: 5, color: "text.secondary" }}>
        {showEnded ? "You have no bid history." : "You have no active bids."}
      </Typography>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={showEnded} onChange={(e) => setShowEnded(e.target.checked)} />}
          label="Show Bids on Ended Auctions"
        />
      </Box>

      <Grid container spacing={3}>
        {filteredBids.length === 0 ? (
          <Grid size={{ xs: 12 }} sx={{ bgcolor: "#313131ff", borderRadius: 2 }}>
            <Typography component={"p"} align="center" sx={{ p: 5, color: "text.secondary" }}>
              {showEnded ? "You have no bid history." : "You have no active bids."}
            </Typography>
          </Grid>
        ) : (
          filteredBids.map((bid, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={bid.id}>
              <BidCard bid={bid} index={index} />
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
}
