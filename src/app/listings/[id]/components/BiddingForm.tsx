"use client";

import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { Gavel } from "@mui/icons-material";

interface BiddingFormProps {
  bidAmount: string;
  onBidAmountChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  minBid: number;
  isLoading: boolean;
}

export default function BiddingForm({ bidAmount, onBidAmountChange, onSubmit, minBid, isLoading }: BiddingFormProps) {
  return (
    <Box component="form" onSubmit={onSubmit}>
      <TextField
        fullWidth
        type="number"
        label="Your Bid Amount"
        value={bidAmount}
        onChange={(e) => onBidAmountChange(e.target.value)}
        placeholder={`Enter more than ${minBid}`}
        InputProps={{ inputProps: { min: minBid + 1 } }}
        sx={{ mb: 2 }}
      />
      <Button type="submit" fullWidth variant="contained" size="large" startIcon={<Gavel />} disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Place Bid"}
      </Button>
    </Box>
  );
}
