import { FallbackImg } from "@/components/ui/FallbackImg";
import { Media } from "@/lib/types"; // Assuming you have this type
import { ImageListItem, useTheme } from "@mui/material";
import React from "react";

interface GalleryThumbnailProps {
  item: Media; // or { url: string; alt?: string } if no Media type exists
  listingTitle: string;
  index: number;
  isSelected: boolean;
  onSelect: (url: string) => void;
}

export default function GalleryThumbnail({ item, listingTitle, index, isSelected, onSelect }: GalleryThumbnailProps) {
  const theme = useTheme();

  return (
    <ImageListItem
      key={item.url}
      sx={{
        cursor: "pointer",
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.3s ease",
        "&:hover img": {
          transform: "scale(1.05)",
        },
        border: isSelected ? `3px solid ${theme.palette.secondary.main}` : "3px solid transparent",
      }}
      onClick={() => onSelect(item.url)}
    >
      <FallbackImg
        src={item.url}
        alt={`${listingTitle} - Thumbnail ${index + 1}`}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 4,
          transition: "transform 0.3s ease",
        }}
      />
    </ImageListItem>
  );
}
