"use client";
import { useState, useMemo, useCallback } from "react";
import { Box, CircularProgress, Typography, Switch, FormControlLabel } from "@mui/material";
import { useApi } from "@/hooks/useApi";
import AuctionApi from "@/lib/api";
import { Bid } from "@/lib/types";
import BidCard from "../BidCard";
import { Masonry } from "@mui/lab";

export default function MyBidsTab({ userName, accessToken }: { userName: string; accessToken: string }) {
  const [showEnded, setShowEnded] = useState(false);

  const getBidsApiCall = useCallback(() => {
    if (!accessToken) return new Promise<{ data: Bid[] }>(() => {});
    return new AuctionApi(accessToken).getProfileBids(userName);
  }, [userName, accessToken]);

  const { data: bids, isLoading } = useApi(getBidsApiCall);

  const uniqueHighestBids = useMemo(() => {
    if (!bids) return [];

    const highestBidsMap = bids.reduce((acc, currentBid) => {
      if (!currentBid.listing) {
        return acc;
      }

      const listingId = currentBid.listing.id;
      const existingBidForListing = acc[listingId];

      if (!existingBidForListing || currentBid.amount > existingBidForListing.amount) {
        acc[listingId] = currentBid;
      }

      return acc;
    }, {} as Record<string, Bid>);

    return Object.values(highestBidsMap);
  }, [bids]);

  const filteredBids = useMemo(() => {
    if (showEnded) {
      return uniqueHighestBids;
    }

    return uniqueHighestBids.filter((bid) => new Date(bid.listing!.endsAt) > new Date());
  }, [uniqueHighestBids, showEnded]);

  console.log(filteredBids);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", mb: 2, width: "100%", justifyContent: "flex-end" }}>
        <FormControlLabel
          sx={{ justifySelf: "end" }}
          control={<Switch checked={showEnded} onChange={(e) => setShowEnded(e.target.checked)} />}
          label="Show Bids on Ended Auctions"
        />
      </Box>
      <Masonry component={"section"} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
        {filteredBids.length === 0 ? (
          <Box>
            <Typography align="center" sx={{ p: 5, color: "text.secondary" }}>
              {showEnded ? "You have no bid history." : "You have no active bids."}
            </Typography>
          </Box>
        ) : (
          filteredBids.map((bid, index) => <BidCard bid={bid} index={index} key={bid.id} />)
        )}
      </Masonry>
    </>
  );
}
