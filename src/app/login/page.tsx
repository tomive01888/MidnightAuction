"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Paper, Typography, TextField, Button, Alert, CircularProgress, useTheme } from "@mui/material";
import { loginUser, LoginCredentials } from "@/lib/api";
import { ApiError } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function LoginPage() {
  const theme = useTheme();
  const router = useRouter();
  const { userProfile, login } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useDocumentTitle("Login - Midnight Auction House");

  useEffect(() => {
    if (userProfile === undefined) return;
    if (userProfile) router.push("/profile");
  }, [userProfile, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser(formData);
      const { accessToken, ...profile } = response.data;
      login(accessToken, profile);

      toast.success(`Welcome back, ${profile.name}!`);
      router.push("/profile");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.errors[0]?.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const autofillStyles = {
    "& input:-webkit-autofill": {
      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
      WebkitTextFillColor: `${theme.palette.text.primary} !important`,
      caretColor: theme.palette.text.primary,
      borderRadius: "inherit",
    },
    "& input:-webkit-autofill:hover": {
      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
    },
    "& input:-webkit-autofill:focus": {
      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
    },
    "& input:-webkit-autofill:active": {
      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
    },
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" sx={{ fontFamily: '"Zen Kurenaido", sans-serif' }}>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            sx={autofillStyles}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            sx={autofillStyles}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <Typography sx={{ color: "primary.main", "&:hover": { textDecoration: "underline" } }}>
                {"Don't have an account? Sign Up"}
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
