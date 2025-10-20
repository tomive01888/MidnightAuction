"use client";

import { useState } from "react";
import { Box, Chip, Button, CircularProgress } from "@mui/material";
import { Bid } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import { AttachMoney, HelpOutline, CheckCircle, ErrorOutline } from "@mui/icons-material";
import AuctionApi from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface BidCardProps {
  bid: Bid;
  index: number;
}

type Status = "idle" | "loading" | "leading" | "outbid";

export default function BidCard({ bid, index }: BidCardProps) {
  const { userProfile } = useAuth();
  const listing = bid.listing!;
  const [status, setStatus] = useState<Status>("idle");

  const checkBidStatus = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setStatus("loading");
    try {
      const api = new AuctionApi();
      const response = await api.getListing(listing.id);
      const fullListing = response.data;

      const highestBid =
        fullListing.bids && fullListing.bids.length > 0
          ? fullListing.bids.sort((a, b) => b.amount - a.amount)[0]
          : null;

      if (highestBid && highestBid.bidder.name === userProfile?.name) {
        setStatus("leading");
      } else {
        setStatus("outbid");
      }

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Failed to check bid status", error);
      setStatus("idle");
    }
  };

  const getStatusButton = () => {
    switch (status) {
      case "loading":
        return <CircularProgress size={24} />;
      case "leading":
        return <Chip icon={<CheckCircle />} label="You are leading!" color="success" size="small" />;
      case "outbid":
        return <Chip icon={<ErrorOutline />} label="You've been outbid" color="error" size="small" />;
      case "idle":
      default:
        return (
          <Button
            size="small"
            variant="outlined"
            startIcon={<HelpOutline />}
            onClick={checkBidStatus}
            sx={{
              backgroundColor: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(5px)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
            }}
          >
            Check Status
          </Button>
        );
    }
  };

  return (
    <Box component={"article"} sx={{ position: "relative" }}>
      <ListingCard listing={listing} index={index} />

      <Chip
        icon={<AttachMoney />}
        label={`Your Bid: ${bid.amount}`}
        color="secondary"
        sx={{
          position: "absolute",
          bottom: 66,
          left: 10,
          zIndex: 10,
          fontSize: "0.8rem",
          fontWeight: "bold",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
        }}
      >
        {getStatusButton()}
      </Box>
    </Box>
  );
}
