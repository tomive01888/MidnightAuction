import SmartAvatar from "@/components/SmartAvatar";
import { AccountBalanceWallet } from "@mui/icons-material";
import { Box, Divider, Paper, Typography } from "@mui/material";
import ProfileStatsChart from "./ProfileStatsChart";
import { JSX } from "react";
import EditProfile from "./EditProfileButton";
import ProfileContentTabs from "./ProfileContentTabs";
import { FullUserProfileStats } from "@/lib/api";

interface ProfileHeaderProps {
  profileData: FullUserProfileStats;
  isOwnProfile: boolean;
  accessToken: string;
  refetch: () => void;
}

export default function ProfileHeader({
  profileData,
  isOwnProfile,
  accessToken,
  refetch,
}: ProfileHeaderProps): JSX.Element {
  return (
    <>
      <Box
        component="section"
        sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 4, md: 6 } }}
      >
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SmartAvatar
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
            listingsCount={profileData?.listingsCount}
            bidsCount={profileData?.bidsCount}
            winsCount={profileData?.winsCount}
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
    </>
  );
}
