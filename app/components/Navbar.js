'use client'

import React from 'react';
import { useAuth } from "@clerk/nextjs";
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Flash-AI
        </Typography>
        {isSignedIn && (
          <Button color="inherit" component={Link} href="/dashboard">
            Dashboard
          </Button>
        )}
        {isSignedIn ? (
          <UserButton />
        ) : (
          <>
            <SignInButton mode="modal">
              <Button color="inherit">Login</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button color="inherit">Sign Up</Button>
            </SignUpButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}