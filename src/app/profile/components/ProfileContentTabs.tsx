"use client";

import { useState } from "react";
import { Box, Tabs, Tab, CircularProgress } from "@mui/material";
import MyListingsTab from "./tabs/MyListingsTab";
import MyBidsTab from "./tabs/MyBidsTab";
import MyWinsTab from "./tabs/MyWinsTab";

interface ProfileContentTabsProps {
  userName: string;
  accessToken: string;
}

export default function ProfileContentTabs({ userName, accessToken }: ProfileContentTabsProps) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="My Listings" sx={{ fontSize: "24px" }} />
          <Tab label="My Bids" sx={{ fontSize: "24px" }} />
          <Tab label="My Wins" sx={{ fontSize: "24px" }} />
        </Tabs>
      </Box>

      <Box sx={{ minHeight: "500px" }}>
        {!accessToken ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {tabIndex === 0 && <MyListingsTab userName={userName} accessToken={accessToken} />}
            {tabIndex === 1 && <MyBidsTab userName={userName} accessToken={accessToken} />}
            {tabIndex === 2 && <MyWinsTab userName={userName} accessToken={accessToken} />}
          </>
        )}
      </Box>
    </Box>
  );
}
