"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Paper, Typography, TextField, Button, Alert, CircularProgress, useTheme } from "@mui/material";
import { registerUser, RegisterCredentials } from "@/lib/api";
import { ApiError } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function RegisterPage() {
  const theme = useTheme();
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegisterCredentials>({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useDocumentTitle("Register - Midnight Auction House");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!/^[a-zA-Z0-9_]+$/.test(formData.name)) {
      setError("Username can only contain letters, numbers, and underscores.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(formData);
      const { accessToken, ...profile } = response.data;
      login(accessToken, profile);

      toast.success(`Welcome, ${profile.name}! Your account has been created.`);
      router.push("/");
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
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Username"
            name="name"
            autoComplete="username"
            autoFocus
            value={formData.name}
            onChange={handleChange}
            helperText="Can only contain letters, numbers, and underscores."
            sx={autofillStyles}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
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
            {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Typography sx={{ color: "primary.main", "&:hover": { textDecoration: "underline" } }}>
                {"Already have an account? Sign In"}
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
