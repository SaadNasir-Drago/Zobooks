"use client";

import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAuth } from "../AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export default function SignIn() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [notyf, setNotyf] = useState<Notyf | null>(null);
  const redirectTo = searchParams?.get("redirectTo") || "/properties";

  // Initialize Notyf and prevent SSR
  useEffect(() => {
    setIsMounted(true);
    setNotyf(new Notyf()); // Initialize Notyf here
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      await login(data.get("email") as string, data.get("password") as string);
      notyf?.success("Logged in successfully");

      setTimeout(() => {
        router.push(redirectTo);
      }, 500);
    } catch (e) {
      setError("Invalid email or password");
      notyf?.error("Login failed. Please check your credentials.");
    }
  };

  if (!isMounted) {
    return null; // Avoid rendering until the component is mounted
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
