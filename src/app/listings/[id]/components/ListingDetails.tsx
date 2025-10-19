"use client";

import { useState, useMemo } from "react";
import { Box, Typography, Alert, Chip, Divider, Card, CardContent, CardActions, Button } from "@mui/material";
import { LocalOffer, Share as ShareIcon } from "@mui/icons-material";
import { useMutation } from "@/hooks/useMutation";
import AuctionApi from "@/lib/api";
import toast from "react-hot-toast";
import { Listing, UserProfile } from "@/lib/types";
import CountdownTimer from "./CountdownTimer";
import SellerInfo from "./SellerInfo";
import BiddingForm from "./BiddingForm";
import NoBidAccess from "./NoBidAccess";

interface ListingDetailsProps {
  listing: Listing;
  userProfile: UserProfile | null;
  accessToken: string | null;
  onBidSuccess: () => void;
}

export default function ListingDetails({ listing, userProfile, accessToken, onBidSuccess }: ListingDetailsProps) {
  const [bidAmount, setBidAmount] = useState<string>("");

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const bidMutation = useMutation(
    (newBidAmount: number) => {
      const api = new AuctionApi(accessToken!);
      return api.placeBid(listing.id, newBidAmount);
    },
    {
      onSuccess: () => {
        setBidAmount("");
        onBidSuccess();
      },
    }
  );

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !userProfile || !listing) return;

    const sortedBids = [...(listing.bids || [])].sort((a, b) => b.amount - a.amount);
    const highestBid = sortedBids[0]?.amount || 0;

    if (sortedBids[0]?.bidder.name === userProfile.name) {
      toast.error("You are already the highest bidder.");
      return;
    }

    const amount = Number(bidAmount);
    if (isNaN(amount) || amount <= highestBid) {
      toast.error(`Your bid must be higher than the current bid of ${highestBid} credits.`);
      return;
    }

    if (amount > userProfile.credits) {
      toast.error("You don't have enough credits to place this bid.");
      return;
    }

    bidMutation.mutate(amount);
  };

  const sortedBids = useMemo(() => {
    if (!listing?.bids) return [];
    return [...listing.bids].sort((a, b) => b.amount - a.amount);
  }, [listing]);

  const highestBid = sortedBids[0]?.amount || 0;
  const isOwner = userProfile?.name === listing?.seller?.name;
  const isHighestBidder = userProfile?.name === sortedBids[0]?.bidder.name;
  const canBid = !isOwner && userProfile && listing && new Date(listing.endsAt) > new Date();

  return (
    <Box component="aside" sx={{ width: { xs: "100%", md: "40%" } }}>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontFamily: "var(--font-orbitron)",
              mb: 1,
              wordBreak: "break-word",
              hyphens: "auto",
            }}
            lang="en"
          >
            {listing.title}
          </Typography>

          <CountdownTimer endsAt={listing.endsAt} />

          <Typography component="p" sx={{ mb: 3 }}>
            {listing.description || "No description."}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {listing.tags.map((tag) => (
              <Chip key={tag} label={tag} icon={<LocalOffer />} />
            ))}
          </Box>

          <Divider />

          <SellerInfo seller={listing.seller} createdDate={listing.created} />

          <Divider sx={{ mb: 3 }} />

          <Box component="dl" sx={{ mb: 3 }}>
            <Typography component="dt" sx={{ fontWeight: "bold" }}>
              Current Bid:
            </Typography>
            <Typography component="dd" variant="h5">
              {highestBid} Credits
            </Typography>

            <Typography component="dt" sx={{ fontWeight: "bold", mt: 1 }}>
              Total Bids:
            </Typography>
            <Typography component="dd" variant="body2" sx={{ color: "text.secondary" }}>
              {listing._count.bids} bids
            </Typography>
          </Box>

          {!userProfile && <NoBidAccess />}

          {canBid && !isHighestBidder && (
            <BiddingForm
              bidAmount={bidAmount}
              onBidAmountChange={setBidAmount}
              onSubmit={handleBidSubmit}
              minBid={highestBid}
              isLoading={bidMutation.isLoading}
            />
          )}

          {isOwner && <Alert severity="info">You cannot bid on your own listing.</Alert>}
          {isHighestBidder && <Alert severity="success">You are currently the highest bidder!</Alert>}
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
          <Button startIcon={<ShareIcon />} onClick={handleShare}>
            Share
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
