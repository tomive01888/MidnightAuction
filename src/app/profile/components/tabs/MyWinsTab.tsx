"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AuctionApi from "@/lib/api";
import { Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import SkeletonGrid from "@/components/SkeletonGrid";

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

  if (isLoading) return <SkeletonGrid count={wins.length} />;

  if (!isLoading && wins.length === 0) {
    return (
      <Typography align="center" sx={{ p: 5, color: "text.secondary" }}>
        No won auctions yet!
      </Typography>
    );
  }

  return (
    <Box component={"section"} sx={{ listStyle: "none", p: 0, m: 0 }}>
      <Grid container component="ul" spacing={2} sx={{ minHeight: "50vh" }}>
        {wins.map((win, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            key={win.id}
            component="li"
            sx={{
              position: "relative",
              listStyle: "none",
            }}
          >
            <EmojiEventsIcon
              color="warning"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                fontSize: 32,
                zIndex: 2,
                filter: "drop-shadow(0 0 3px rgba(0,0,0,0.4))",
              }}
            />
            <ListingCard listing={win} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
