"use client";

import { Box, useTheme, styled } from "@mui/material";

const pulseKeyframes = `
  @keyframes pulse {
    0%, 100% { 
      opacity: 0.7; 
    }
    50% { 
      opacity: 1; 
    }
  }
  
  @keyframes spin {
    0% { 
      transform: rotate(0deg); 
    }
    100% { 
      transform: rotate(360deg); 
    }
  }
`;

const StyledRect = styled("rect")(({ theme }) => ({
  animation: "pulse 2s ease-in-out infinite",
  filter: "url(#neon-glow)",
  stroke: theme.palette.primary.main,
  strokeWidth: 2,
  fill: "none",
  rx: 8,
}));

/**
 * A themed, animated skeleton loading card with a consistent aspect ratio
 * to prevent Cumulative Layout Shift. Designed to be used as a placeholder
 * for the MasonryListingCard.
 */
export default function GhostListingCard() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: "3/4",
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "rgba(26, 26, 46, 0.5)",
        border: "1px solid",
        borderColor: "rgba(0, 245, 212, 0.2)",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{pulseKeyframes}</style>

      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="neon-glow">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={theme.palette.primary.main} />
          </filter>
        </defs>

        <StyledRect x="5%" y="5%" width="90%" height="90%" />

        <line x1="10%" y1="80%" x2="70%" y2="80%" stroke={theme.palette.primary.main} strokeWidth="2" />
        <line x1="10%" y1="90%" x2="40%" y2="90%" stroke={theme.palette.primary.main} strokeWidth="2" />
      </svg>

      {/* Centered loading spinner with purple glow */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: theme.palette.secondary.main,
            borderRightColor: theme.palette.secondary.main,
            animation: "spin 1s linear infinite",
            filter: `drop-shadow(0 0 8px ${theme.palette.secondary.main})`,
          }}
        />
      </Box>
    </Box>
  );
}
