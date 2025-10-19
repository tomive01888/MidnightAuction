"use client";

import { useState } from "react";
import { CardHeader, Avatar, Typography, Box, IconButton, useTheme, Collapse } from "@mui/material";
import { AccountCircle, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { UserProfile } from "@/lib/types";
import { SellerStatsContent } from "./SellersStats";

interface SellerInfoProps {
  seller?: UserProfile;
  createdDate: string;
}

export default function SellerInfo({ seller, createdDate }: SellerInfoProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

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

      {/* The Collapse component now correctly wraps the content BELOW the header */}
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {seller?.name && <SellerStatsContent sellerName={seller.name} />}
      </Collapse>
    </Box>
  );
}
