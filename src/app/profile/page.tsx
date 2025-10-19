"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, Avatar, CircularProgress, Alert, Divider, Paper } from "@mui/material";
import { AccountBalanceWallet } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { getFullProfileStats } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import Header from "@/components/Header";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import ProfileStatsChart from "./components/ProfileStatsChart";
import ProfileContentTabs from "./components/ProfileContentTabs";
import EditProfile from "./components/EditProfileButton";

export default function ProfilePage() {
  const { userProfile, accessToken, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useDocumentTitle(userProfile ? `${userProfile.name} - Midnight Auction` : "Profile");

  const getProfileApiCall = useCallback(() => {
    if (userProfile?.name && accessToken) {
      return getFullProfileStats(userProfile.name, accessToken);
    }
    return new Promise<never>(() => {});
  }, [userProfile?.name, accessToken]);

  const { data: profileData, isLoading, error, refetch } = useApi(getProfileApiCall);

  useEffect(() => {
    if (!isAuthLoading && !userProfile) {
      router.push("/login");
    }
  }, [isAuthLoading, userProfile, router]);

  const isOwnProfile = userProfile?.name === profileData?.name;

  if (isAuthLoading || (isLoading && !profileData)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profileData) {
    return (
      <>
        <Header />
        <Container sx={{ py: 5 }}>
          <Alert severity="error">{error || "Could not load profile."}</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
        {/* --- NEW RESPONSIVE TWO-COLUMN LAYOUT --- */}
        <Box
          component="section"
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 4, md: 6 } }}
        >
          {/* --- LEFT COLUMN: USER INFO & CREDITS --- */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Avatar
              src={profileData.avatar?.url}
              alt={profileData.name}
              sx={{ width: 220, height: 220, mb: 2, border: "4px solid", borderColor: "primary.main" }}
            />
            <Typography variant="h3" component="h1" sx={{ fontFamily: "var(--font-orbitron)" }}>
              {profileData.name}
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 1 }}>{profileData.email}</Typography>
            <Typography align="center" sx={{ maxWidth: "600px", mb: 4 }}>
              {profileData.bio || "This user prefers to be mysterious."}
            </Typography>

            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 4,
                textAlign: "center",
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 0 20px rgba(0, 245, 212, 0.1)",
                width: "100%",
                maxWidth: "300px",
              }}
            >
              <AccountBalanceWallet sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography
                aria-label={`Credits: ${profileData.credits}`}
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: "var(--font-orbitron)",
                  color: "primary.main",
                  textShadow: "0 0 10px rgba(0, 245, 212, 0.5)",
                }}
              >
                {profileData.credits}
              </Typography>
              <Typography variant="overline" sx={{ color: "text.secondary" }}>
                Credits
              </Typography>
            </Paper>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              gap: "2rem",
            }}
          >
            <ProfileStatsChart
              listingsCount={profileData.listingsCount}
              bidsCount={profileData.bidsCount}
              winsCount={profileData.winsCount}
              size={340}
              strokeWidth={25}
            />

            {isOwnProfile && (
              <Box
                sx={{
                  position: { xs: "block", md: "absolute" },
                  alignSelf: "end",
                  top: { xs: 16, md: 24 },
                  right: { xs: 16, md: 24 },
                }}
              >
                <EditProfile onUpdateSuccess={refetch} />
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 6 }} />

        <ProfileContentTabs userName={profileData.name} accessToken={accessToken} />
      </Container>
    </>
  );
}
