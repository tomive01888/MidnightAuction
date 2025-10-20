"use client";

import { useEffect, useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { ArrowDownward, NewReleases, Timer, Whatshot } from "@mui/icons-material";
import AuctionApi, { ListingSortKey } from "@/lib/api";
import { Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import GhostListingCard from "@/components/GhostListingCard";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<ListingSortKey>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const api = new AuctionApi();
        const response = await api.getListings(currentPage, 20, sortBy, sortOrder);
        setListings(response.data);
        if (response.meta) {
          setTotalPages(response.meta.pageCount);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [currentPage, sortBy, sortOrder]);

  const handleSortChange = (newSortBy: ListingSortKey) => {
    if (newSortBy === "endsAt") {
      setSortOrder("asc");
    } else {
      setSortOrder("desc");
    }
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleScrollToListings = () => {
    document.getElementById("listings-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroSortAndScroll = () => {
    handleSortChange("updated");
    handleScrollToListings();
  };

  const getTitle = () => {
    if (sortBy === "endsAt") return "Ending Soon";
    if (sortBy === "updated") return "Most Active";
    return "Latest Listings";
  };

  return (
    <>
      <Box
        component={"section"}
        sx={{
          minHeight: { xs: "70vh", md: "80vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "800px",
            height: "800px",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(0, 245, 212, 0.1), transparent 70%)",
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="md">
          <Typography
            component={"h1"}
            variant="h1"
            sx={{
              fontFamily: "var(--font-orbitron)",
              color: "primary.main",
              textShadow: "0 0 15px rgba(0, 245, 212, 0.7)",
              mb: 2,
              fontSize: {
                xs: "3rem",
                sm: "4.5rem",
                md: "6rem",
              },
            }}
          >
            Midnight: <br /> The Auction is Live
          </Typography>
          <Typography component={"p"} sx={{ color: "text.secondary", mb: 4, mx: "auto", fontSize: "1.2rem" }}>
            Your source for exclusive digital collectibles and rare items. The hammer drops when the clock hits zero.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Whatshot />}
              onClick={handleHeroSortAndScroll}
              sx={{
                width: "200px",
              }}
            >
              View Most Active
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<ArrowDownward />}
              onClick={handleScrollToListings}
              sx={{
                width: "200px",
              }}
            >
              Browse Latest
            </Button>
          </Box>
        </Container>
      </Box>

      <Container component={"section"} maxWidth="lg" sx={{ py: 6, scrollMarginTop: "50px" }} id="listings-grid">
        <Box
          component={"header"}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
          }}
        >
          <Typography
            component={"h2"}
            variant="h2"
            sx={{
              fontFamily: "var(--font-orbitron)",
              fontSize: {
                xs: "2.4rem",
                sm: "3.7",
              },
            }}
          >
            {getTitle()}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              startIcon={<NewReleases />}
              variant={sortBy === "created" ? "contained" : "outlined"}
              onClick={() => handleSortChange("created")}
            >
              Latest
            </Button>
            <Button
              startIcon={<Timer />}
              variant={sortBy === "endsAt" ? "contained" : "outlined"}
              onClick={() => handleSortChange("endsAt")}
            >
              Ending Soon
            </Button>
            <Button
              startIcon={<Whatshot />}
              variant={sortBy === "updated" ? "contained" : "outlined"}
              onClick={() => handleSortChange("updated")}
            >
              Most Active
            </Button>
          </Box>
        </Box>

        <Box
          display="grid"
          gap={3}
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
        >
          {isLoading ? (
            Array.from({ length: 12 }).map((_, index) => <GhostListingCard key={index} />)
          ) : listings.length > 0 ? (
            listings.map((listing, index) => (
              <Box component={"article"} key={listing.id}>
                <ListingCard listing={listing} index={index} />
              </Box>
            ))
          ) : (
            <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 6 }}>
              <Typography variant="h6" sx={{ color: "text.secondary" }}>
                No listings found.
              </Typography>
            </Box>
          )}
        </Box>

        {totalPages > 1 && (
          <Box
            component="nav"
            aria-label="Listings pagination"
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4, userSelect: "none" }}
          >
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </Button>
            <Typography component={"p"} sx={{ display: "flex", alignItems: "center" }}>
              Page {currentPage} of {totalPages}
            </Typography>
            <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}
