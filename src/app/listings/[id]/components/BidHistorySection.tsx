"use client";

import { useState } from "react";
import {
  Paper,
  CardActions,
  Typography,
  IconButton,
  Collapse,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { Bid } from "@/lib/types";
import SmartAvatar from "@/components/SmartAvatar";

interface BidHistorySectionProps {
  bids: Bid[];
}

export default function BidHistorySection({ bids }: BidHistorySectionProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);

  return (
    <Paper component="section" sx={{ mt: 6, borderRadius: 4 }}>
      <CardActions sx={{ justifyContent: "space-between", p: 2, cursor: "pointer" }} onClick={handleExpandClick}>
        <Typography variant="h5" component="h2" sx={{ fontFamily: "var(--font-orbitron)" }}>
          Bid History
        </Typography>
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded || isMobile}
          aria-label="show bid history"
          sx={{
            transform: expanded || isMobile ? "rotate(180deg)" : "rotate(0deg)",
            transition: theme.transitions.create("transform", { duration: theme.transitions.duration.shortest }),
            display: { xs: "none", md: "inline-flex" },
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded || isMobile} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 0 }}>
          {sortedBids.length > 0 ? (
            <List>
              {sortedBids.map((bid) => (
                <ListItem key={bid.id}>
                  <ListItemAvatar>
                    <SmartAvatar src={bid.bidder?.avatar?.url} alt={bid.bidder?.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${bid.bidder.name} bid ${bid.amount} credits`}
                    secondary={format(new Date(bid.created), "PPpp")}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography component="p" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
              No bids have been placed yet. Be the first!
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Paper>
  );
}
