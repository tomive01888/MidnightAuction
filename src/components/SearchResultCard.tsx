// /components/SearchResultCard.tsx
"use client";

import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import { Listing } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Timer } from "@mui/icons-material";

interface SearchResultCardProps {
  listing: Listing;
  onResultClick: () => void;
}

export default function SearchResultCard({ listing, onResultClick }: SearchResultCardProps) {
  const timeUntilEnd = formatDistanceToNow(new Date(listing.endsAt), { addSuffix: true });

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        mb: 2,
        backgroundColor: "background.paper",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 0 15px 0 rgba(0, 245, 212, 0.5)",
        },
      }}
      onClick={onResultClick}
    >
      <CardActionArea href={`/listings/${listing.id}`} sx={{ display: "flex", justifyContent: "flex-start" }}>
        <CardMedia
          component="img"
          sx={{ width: 100, height: 100, objectFit: "cover" }}
          image={listing.media[0]?.url || "/placeholder.png"}
          alt={listing.title}
        />
        <CardContent>
          <Typography component="h3" variant="h6" noWrap>
            {listing.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Timer sx={{ fontSize: "1rem" }} /> Ends {timeUntilEnd}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
