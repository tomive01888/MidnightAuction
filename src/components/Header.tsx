"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  Container,
  Typography,
  CircularProgress,
  ListItem,
} from "@mui/material";
import {
  Search,
  AccountCircle,
  Menu as MenuIcon,
  Close,
  Logout,
  Create,
  Person,
  Login,
  AppRegistration,
} from "@mui/icons-material";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./Logo";
import { useDebounce } from "@/hooks/useDebounce";
import { useApi } from "@/hooks/useApi";
import AuctionApi from "@/lib/api";
import { Listing } from "@/lib/types";
import SearchResultCard from "./SearchResultCard";

function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const searchApiCall = useCallback(() => {
    if (debouncedQuery.trim() === "") return Promise.resolve({ data: [] as Listing[] });
    return new AuctionApi().searchListings(debouncedQuery);
  }, [debouncedQuery]);

  const { data: results, isLoading } = useApi(searchApiCall);

  const activeResults = useMemo(() => {
    if (!results) {
      return [];
    }
    return results.filter((listing) => new Date(listing.endsAt) > new Date());
  }, [results]);

  if (!isOpen) return null;

  return (
    <Box
      component="section"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        backgroundColor: "rgba(13, 12, 29, 0.95)",
        backdropFilter: "blur(10px)",
        overflowY: "auto",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <TextField
            fullWidth
            autoFocus
            placeholder="Search listings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={onClose} aria-label="Close search">
            <Close />
          </IconButton>
        </Box>
        <Box>
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
          {!isLoading && Array.isArray(results) && results.length > 0 && (
            <List component="ul" aria-label="Search results">
              {activeResults.map((listing) => (
                <ListItem key={listing.id} disablePadding sx={{ width: "100%" }}>
                  <SearchResultCard listing={listing} onResultClick={onClose} />
                </ListItem>
              ))}
            </List>
          )}
          {!isLoading && debouncedQuery && Array.isArray(results) && results.length === 0 && (
            <Typography align="center" sx={{ p: 4 }}>
              No results found.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default function Header() {
  const { userProfile, logout, isLoading: isAuthLoading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const handleDrawerToggle = () => setIsDrawerOpen(!isDrawerOpen);
  const handleSearchToggle = () => setIsSearchOpen(!isSearchOpen);

  const DesktopNav = () => (
    <>
      <Link href="/create-listing">
        <Button variant="contained" color="primary">
          Create Listing
        </Button>
      </Link>
      <Link href="/profile">
        <Button startIcon={<AccountCircle />} sx={{ color: "text.primary" }}>
          {userProfile?.name}
        </Button>
      </Link>
      <Button onClick={logout} variant="outlined" color="secondary">
        Logout
      </Button>
    </>
  );

  const MobileNav = () => (
    <>
      <IconButton color="inherit" aria-label="open search" onClick={handleSearchToggle}>
        <Search />
      </IconButton>
      <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle}>
        <MenuIcon />
      </IconButton>
    </>
  );

  return (
    <Box>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Logo />

            <Box component="nav" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton color="inherit" aria-label="open search" onClick={handleSearchToggle} sx={{ mr: 1 }}>
                <Search />
              </IconButton>
              {isAuthLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isMobile ? (
                <MobileNav />
              ) : userProfile ? (
                <DesktopNav />
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outlined" color="primary">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="contained" color="secondary">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{ sx: { backgroundColor: "background.default", width: "250px" } }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {userProfile ? (
            <>
              <ListItemButton component={Link} href="/profile" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary={userProfile.name} />
              </ListItemButton>
              <ListItemButton component={Link} href="/create-listing" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <Create />
                </ListItemIcon>
                <ListItemText primary="Create Listing" />
              </ListItemButton>
              <Divider sx={{ my: 1 }} />
              <ListItemButton
                onClick={() => {
                  logout();
                  handleDrawerToggle();
                }}
              >
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </>
          ) : (
            <>
              <ListItemButton component={Link} href="/login" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
              <ListItemButton component={Link} href="/register" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <AppRegistration />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>

      <SearchOverlay isOpen={isSearchOpen} onClose={handleSearchToggle} />
    </Box>
  );
}
