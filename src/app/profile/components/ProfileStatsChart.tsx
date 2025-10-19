"use client";

import { Box, Typography, useTheme, Stack } from "@mui/material";

interface ProfileStatsChartProps {
  listingsCount: number;
  bidsCount: number;
  winsCount: number;
  size: number;
  strokeWidth: number;
}

const StatSegment = ({
  radius,
  strokeWidth,
  color,
  percentage,
  rotation,
}: {
  radius: number;
  strokeWidth: number;
  color: string;
  percentage: number;
  rotation: number;
}) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <circle
      cx={radius + strokeWidth}
      cy={radius + strokeWidth}
      r={radius}
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={circumference}
      strokeDashoffset={strokeDashoffset}
      strokeLinecap="round"
      transform={`rotate(${rotation} ${radius + strokeWidth} ${radius + strokeWidth})`}
      style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
    />
  );
};

const LegendItem = ({ color, name, value }: { color: string; name: string; value: number }) => (
  <Box component="li" sx={{ display: "flex", alignItems: "center", gap: 1, listStyle: "none" }}>
    <Box sx={{ width: 15, height: 15, borderRadius: "50%", backgroundColor: color }} aria-hidden="true" />
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      {name}: <strong style={{ color: useTheme().palette.text.primary }}>{value}</strong>
    </Typography>
  </Box>
);
export default function ProfileStatsChart({
  listingsCount,
  bidsCount,
  winsCount,
  size,
  strokeWidth,
}: ProfileStatsChartProps) {
  const theme = useTheme();
  const total = listingsCount + bidsCount + winsCount;
  const listingsPercent = total > 0 ? listingsCount / total : 0;
  const bidsPercent = total > 0 ? bidsCount / total : 0;
  const winsPercent = total > 0 ? winsCount / total : 0;
  const bidsRotation = listingsPercent * 360;
  const winsRotation = (listingsPercent + bidsPercent) * 360;
  const radius = (size - strokeWidth) / 2.2;

  return (
    <Box>
      <Box
        sx={{ position: "relative", width: size, height: size, margin: "0 auto", mb: 3 }}
        role="img"
        aria-label={`Profile statistics chart showing ${total} total actions: ${listingsCount} listings, ${bidsCount} bids, and ${winsCount} wins`}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={theme.palette.background.paper}
            strokeWidth={strokeWidth}
          />

          {/* Data Segments */}
          <StatSegment
            radius={radius}
            strokeWidth={strokeWidth}
            color={theme.palette.primary.main}
            percentage={listingsPercent}
            rotation={-90}
          />
          <StatSegment
            radius={radius}
            strokeWidth={strokeWidth}
            color={theme.palette.secondary.main}
            percentage={bidsPercent}
            rotation={-90 + bidsRotation}
          />
          <StatSegment
            radius={radius}
            strokeWidth={strokeWidth}
            color={theme.palette.warning.main}
            percentage={winsPercent}
            rotation={-90 + winsRotation}
          />
        </svg>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden="true"
        >
          <Typography variant="h3" sx={{ fontFamily: "var(--font-orbitron)" }}>
            {total}
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: -1 }}>Total Actions</Typography>
        </Box>
      </Box>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-evenly" }}
        component="ul"
        aria-label="Statistics breakdown"
        role="list"
      >
        <LegendItem color={theme.palette.primary.main} name="Listings" value={listingsCount} />
        <LegendItem color={theme.palette.secondary.main} name="Bids" value={bidsCount} />
        <LegendItem color={theme.palette.warning.main} name="Wins" value={winsCount} />
      </Stack>
    </Box>
  );
}
