"use client";

import { Box, Typography } from "@mui/material";
import { purple } from "@mui/material/colors";
import Link from "next/link";

export default function Logo() {
  const subWord = "AUCTION";
  const letters = subWord.split("");

  return (
    <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        {/* The main word: "Midnight" */}
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontFamily: "var(--font-orbitron)",
            color: "primary.main",
            fontWeight: 700,
            lineHeight: 1,
            textShadow: "0 0 10px rgba(0, 245, 212, 0.6)",
          }}
        >
          Midnight
        </Typography>

        {/* The spaced-out sub-word: "AUCTION" */}
        <Box
          component="div"
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            mt: 0.5,
          }}
        >
          {letters.map((letter, index) => (
            <Typography
              key={index}
              component="span"
              sx={{
                color: purple[400],
                fontWeight: 700,
                fontSize: { xs: "0.6rem", sm: "0.7rem" },
                textTransform: "uppercase",
                opacity: 100,
                animation: "fadeIn 0.5s ease forwards",
                animationDelay: `calc(${index} * 50ms)`,
              }}
            >
              {letter}
            </Typography>
          ))}
        </Box>
      </Box>
    </Link>
  );
}
