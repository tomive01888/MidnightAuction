"use client";
import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Masonry } from "@mui/lab";
import AuctionApi from "@/lib/api";
import { Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";

interface MyWinsTabProps {
  userName: string;
  accessToken: string;
}

export default function MyWinsTab({ userName, accessToken }: MyWinsTabProps) {
  const [wins, setWins] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;
      setIsLoading(true);
      const api = new AuctionApi(accessToken);
      try {
        const response = await api.getProfileWins(userName);
        setWins(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userName, accessToken]);

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );

  return wins.length === 0 ? (
    <Typography align="center" sx={{ p: 5, color: "text.secondary" }}>
      No won auctions yet!
    </Typography>
  ) : (
    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
      {wins.map((win, index) => (
        <ListingCard key={win.id} listing={win} index={index} />
      ))}
    </Masonry>
  );
}
