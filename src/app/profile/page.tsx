"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { getFullProfileStats } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { UserProfile } from "@/lib/types";
import ProfileHeaderSkeleton from "./components/ProfileHeaderSkeleton";
import ProfileHeader from "./components/ProfileHeader";

function ProfileDataView({ userProfile, accessToken }: { userProfile: UserProfile; accessToken: string }) {
  const getProfileApiCall = useCallback(() => {
    return getFullProfileStats(userProfile.name, accessToken);
  }, [userProfile.name, accessToken]);

  const { data: profileData, isLoading, error, refetch } = useApi(getProfileApiCall);

  const isOwnProfile = userProfile?.name === profileData?.name;

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  if (error || !profileData) {
    return <Alert severity="error">{error || "Could not load profile data."}</Alert>;
  }

  return (
    <ProfileHeader profileData={profileData} isOwnProfile={isOwnProfile} accessToken={accessToken} refetch={refetch} />
  );
}

export default function ProfilePage() {
  const { userProfile, accessToken, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useDocumentTitle(userProfile ? `${userProfile.name} - Midnight Auction` : "Profile");

  useEffect(() => {
    if (!isAuthLoading && !userProfile) {
      router.push("/login");
    }
  }, [isAuthLoading, userProfile, router]);

  return (
    <>
      <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
        {isAuthLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : userProfile && accessToken ? (
          <ProfileDataView userProfile={userProfile} accessToken={accessToken} />
        ) : null}
      </Container>
    </>
  );
}
