"use client";

import { Box, Paper, Typography, ImageList } from "@mui/material";
import { FallbackImg } from "@/components/ui/FallbackImg";
import GalleryThumbnail from "./GalleryThumbnail";
import { Media } from "@/lib/types";

interface ListingImageGalleryProps {
  media: Media[];
  title: string;
  mainImage: string | undefined;
  onImageSelect: (url: string) => void;
}

export default function ListingImageGallery({ media, title, mainImage, onImageSelect }: ListingImageGalleryProps) {
  return (
    <Box component="figure" sx={{ width: { xs: "70%", md: "60%" }, margin: "0 auto" }}>
      <Paper elevation={4} sx={{ borderRadius: 4, overflow: "hidden", mb: 2 }}>
        <Box sx={{ position: "relative", width: "100%", aspectRatio: "3/4", backgroundColor: "background.paper" }}>
          <FallbackImg
            src={mainImage}
            alt={title}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
            onImageReady={() => {}}
          />
        </Box>
      </Paper>

      {media.length > 1 && (
        <ImageList sx={{ width: "100%", overflowX: "clip", overflowY: "clip" }} cols={4} gap={8}>
          {media.map((item, index) => (
            <GalleryThumbnail
              key={item.url}
              item={item}
              listingTitle={title}
              index={index}
              isSelected={mainImage === item.url}
              onSelect={onImageSelect}
            />
          ))}
        </ImageList>
      )}

      <Typography component="figcaption" sx={{ mt: 1, fontSize: "0.875rem", color: "text.secondary" }}>
        {title}
      </Typography>
    </Box>
  );
}
