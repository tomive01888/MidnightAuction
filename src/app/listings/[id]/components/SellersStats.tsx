"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getFullProfileStats } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProfileStatsChart from "@/app/profile/components/ProfileStatsChart";

interface SellerStatsContentProps {
  sellerName: string;
}

export function SellerStatsContent({ sellerName }: SellerStatsContentProps) {
  const { accessToken } = useAuth();

  const {
    data: sellerStats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profileStats", sellerName],
    queryFn: () => getFullProfileStats(sellerName, accessToken || undefined),
    enabled: true,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Could not load stats.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2, backgroundColor: "background.default", borderRadius: 2 }}>
     
    </Box>
  );
}
