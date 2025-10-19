import { Box, Button, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function NoBidAccess() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
        backgroundColor: "primary.50",
        borderRadius: 2,
        border: "2px solid",
        borderColor: "primary.main",
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", fontWeight: 500 }}>
        Want to place a bid?
      </Typography>
      <Button
        component={Link}
        href="/login"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={{
          textTransform: "none",
          fontWeight: 600,
          py: 1.5,
          boxShadow: 2,
          "&:hover": {
            boxShadow: 4,
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        Login to Bid
      </Button>
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
        Don´t have an account?{" "}
        <Link
          href="/register"
          style={{
            color: `${theme.palette.secondary.main}`,
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          Sign up
        </Link>
      </Typography>
    </Box>
  );
}
