"use client";

import { Box, Container, Typography, Link as MuiLink, Divider } from "@mui/material";
import Link from "next/link";

const TechLink = ({ href, name }: { href: string; name: string }) => (
  <MuiLink
    component={Link}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      color: "text.secondary",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "primary.main",
      },
    }}
  >
    {name}
  </MuiLink>
);

const CreditSection = ({ title, name, href }: { title: string; name: string; href: string }) => (
  <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      {title}
    </Typography>
    <MuiLink
      component={Link}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        fontWeight: "bold",
        color: "text.primary",
        textDecoration: "none",
        transition: "color 0.3s ease",
        "&:hover": {
          color: "primary.main",
        },
      }}
    >
      {name}
    </MuiLink>
  </Box>
);

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        pt: 4,
        pb: 4,
        backgroundColor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* Left Section: Built With */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography component={"p"} variant="h6" sx={{ fontFamily: "var(--font-orbitron)", mb: 1 }}>
              Built with
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <TechLink href="https://nextjs.org/" name="Next.js" />
              <Divider orientation="vertical" flexItem />
              <TechLink href="https://mui.com/" name="Material UI" />
              <Divider orientation="vertical" flexItem />
              <TechLink href="https://www.typescriptlang.org/" name="TypeScript" />
            </Box>
          </Box>

          {/* Right Section: Credits */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
            <CreditSection title="Powered by" name="Noroff API" href="https://www.noroff.no/" />
            <CreditSection title="AI Assistance" name="Gemini" href="https://gemini.google.com/" />
            <CreditSection title="Lead Developer" name="Tom Andre Iversen" href="https://github.com/tomive01888" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
