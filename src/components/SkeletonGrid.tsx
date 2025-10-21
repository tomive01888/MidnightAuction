// /components/SkeletonGrid.tsx
"use client";

import { Grid } from "@mui/material";
import GhostListingCard from "./GhostListingCard";

interface SkeletonGridProps {
  count?: number;
}

/**
 * Renders a responsive grid of GhostListingCard components to be used
 * as a skeleton loader, preventing CLS.
 */
export default function SkeletonGrid({ count = 8 }: SkeletonGridProps) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <GhostListingCard />
        </Grid>
      ))}
    </Grid>
  );
}
