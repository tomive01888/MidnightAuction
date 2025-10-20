"use client";

import { useState } from "react";
import {
  CardHeader,
  Avatar,
  Typography,
  Box,
  IconButton,
  useTheme,
  Collapse,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AccountCircle, ExpandMore as ExpandMoreIcon, Lock } from "@mui/icons-material";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { UserProfile } from "@/lib/types";
import { getFullProfileStats } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProfileStatsChart from "@/app/profile/components/ProfileStatsChart";
interface SellerInfoProps {
  seller?: UserProfile;
  createdDate: string;
}

export default function SellerInfo({ seller, createdDate }: SellerInfoProps) {
  const theme = useTheme();
  const { accessToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: sellerStats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profileStats", seller?.name, !!accessToken],

    queryFn: () => getFullProfileStats(seller!.name, accessToken!),

    enabled: isOpen && !!accessToken,
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box>
      <CardHeader
        avatar={
          <Avatar src={seller?.avatar?.url || undefined}>
            <AccountCircle />
          </Avatar>
        }
        action={
          seller?.name ? (
            <IconButton
              onClick={handleToggle}
              aria-expanded={isOpen}
              aria-label="show seller stats"
              sx={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: theme.transitions.create("transform"),
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          ) : null
        }
        title={
          <Typography component="p" variant="h6" sx={{ fontWeight: "bold" }}>
            {seller?.name || "Unknown"}
          </Typography>
        }
        subheader={
          <Typography component="time" dateTime={createdDate}>{`Listed on ${format(
            new Date(createdDate),
            "PP"
          )}`}</Typography>
        }
      />

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {!accessToken ? (
          <Alert severity="info" icon={<Lock fontSize="inherit" />} sx={{ m: 2 }}>
            You must be logged in to view seller statistics.
          </Alert>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error" sx={{ p: 2 }}>
            Could not load stats.
          </Typography>
        ) : (
          <Box sx={{ p: 2, backgroundColor: "background.default", borderRadius: 2 }}>
            <ProfileStatsChart
              listingsCount={sellerStats!.data.listingsCount}
              bidsCount={sellerStats!.data.bidsCount}
              winsCount={sellerStats!.data.winsCount}
              size={180}
              strokeWidth={12}
            />
          </Box>
        )}
      </Collapse>
    </Box>
  );
}
