"use client";

import { useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { Gavel, Schedule } from "@mui/icons-material";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { Listing } from "@/lib/types";
import { FallbackImg } from "./ui/FallbackImg";
import GhostListingCard from "./GhostListingCard";

interface ListingCardProps {
  listing: Listing;
  index: number;
}

export default function ListingCard({ listing, index }: ListingCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const isEnded = listing.endsAt ? new Date(listing.endsAt) < new Date() : false;
  const timeUntilEnd = listing.endsAt
    ? formatDistanceToNowStrict(new Date(listing.endsAt), { addSuffix: true })
    : "Invalid date";
  const bidCount = listing._count?.bids;
  return (
    <Box component={"article"} sx={{ position: "relative", borderRadius: 4 }}>
      <Box
        sx={{
          opacity: imageLoaded ? 0 : 1,
          transition: "opacity 0.6s ease-in-out",
          transitionDelay: imageLoaded ? `${index * 100}ms` : "0ms",
        }}
      >
        <GhostListingCard />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: imageLoaded ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
          transitionDelay: imageLoaded ? `${index * 100}ms` : "0ms",
          pointerEvents: imageLoaded ? "auto" : "none",
          borderRadius: 4,
          "&:hover": {
            border: "1px solid #f6b3ffff",
            boxShadow: "0 0 12px #FF00E1",
          },
        }}
      >
        <Link
          href={`/listings/${listing.id}`}
          style={{ textDecoration: "none", display: "block", height: "100%", borderRadius: 4 }}
        >
          <Box
            sx={{
              height: "100%",
              borderRadius: 4,
              overflow: "hidden",
              cursor: "pointer",
              position: "relative",
              "&:hover img": {
                transform: "scale(1.05)",
              },
            }}
          >
            <FallbackImg
              src={listing.media[0]?.url}
              alt={listing.title}
              onImageReady={() => setImageLoaded(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease-in-out" }}
            />

            {/* Content Overlay */}
            <Box
              component={"figcaption"}
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 1.5,
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%)",
              }}
            >
              {isEnded ||
                (typeof bidCount === "number" && (
                  <Chip
                    icon={<Gavel sx={{ fontSize: 16, color: "inherit" }} />}
                    label={`${bidCount} bids`}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      backgroundColor: "rgba(231, 76, 60, 0.9)",
                      color: "white",
                      backdropFilter: "blur(5px)",
                      maxWidth: "fit",
                      boxShadow: "1px 5px 5px rgba(0,0,0,0.7)",
                    }}
                  />
                ))}

              <Box component={"footer"} sx={{ position: " absolute", bottom: 16, left: 16, right: 16 }}>
                <Typography
                  component={"h3"}
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    textShadow: "0 0px 1px rgba(0,0,0,1)",
                    lineHeight: 1.2,
                    mb: 0.5,
                  }}
                >
                  {listing.title}
                </Typography>
                <Box
                  component={"p"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.8rem",
                    userSelect: "none",
                  }}
                >
                  <Schedule sx={{ fontSize: 14 }} />
                  {isEnded ? "Auction has ended" : `Ends ${timeUntilEnd}`}
                </Box>
              </Box>
            </Box>
          </Box>
        </Link>
      </Box>
    </Box>
  );
}
