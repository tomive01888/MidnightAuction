"use client";

import { useState, useMemo, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Timer } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

interface CountdownTimerProps {
  endsAt: string;
}

export default function CountdownTimer({ endsAt }: CountdownTimerProps) {
  const endsAtDate = useMemo(() => new Date(endsAt), [endsAt]);
  const [timeLeft, setTimeLeft] = useState(() =>
    !isNaN(endsAtDate.getTime()) ? formatDistanceToNow(endsAtDate, { addSuffix: true }) : "Invalid date"
  );

  useEffect(() => {
    if (isNaN(endsAtDate.getTime())) return;
    const interval = setInterval(() => {
      setTimeLeft(formatDistanceToNow(endsAtDate, { addSuffix: true }));
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAtDate]);

  return (
    <Box
      component="time"
      dateTime={endsAt}
      sx={{ display: "flex", alignItems: "center", gap: 1, color: "warning.main", mb: 2 }}
    >
      <Timer />
      <Typography variant="h6">{new Date() > endsAtDate ? "Auction Ended" : `Ends ${timeLeft}`}</Typography>
    </Box>
  );
}