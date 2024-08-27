'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth,SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useSignIn, SignIn} from '@clerk/nextjs'; 
import Navbar from './components/Navbar';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';

// Initializing and setting up Stripe
const stripeKey = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY); 

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const { isSignedIn } = useAuth(); 
  const { openSignIn } = useSignIn();
  const router = useRouter();
  

  useEffect(() => {
    if (isLoaded && userId && router.pathname === '/') {
      router.push('/dashboard');
    }
  }, [isLoaded, userId, router]);

  const handlePremiumClick = () => {
    router.push('/checkout');
  }; 

  const handleStartLearning = () => {
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      alert("Please Login or Sign up")
    }
  };

  return (
    <div>
     <Navbar/>

      {/* Hero Section */}
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
          px: 3,
        }}
      >
        <Typography variant="h2" gutterBottom color="black">
          Generate Flashcards with Intuitive Quizzes In Seconds
        </Typography>
        <Typography variant="h6" paragraph color="black">
          Flashcards made for you from uploaded files
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" size="large" color="primary" onClick={handleStartLearning} sx={{ mr: 2 }}>
            Start Learning
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Container sx={{ mt: 10 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why Choose Flash-AI?
        </Typography>
        <Grid container spacing={4} justifyContent="center" onClick={handleStartLearning} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  AI-Powered Creation
                </Typography>
                <Typography variant="body2">
                  Automatically generate flashcards from any text with intuitive quizzes to test your knowledge, powered by cutting-edge AI technologies.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Easy to Use
                </Typography>
                <Typography variant="body2">
                  Simple, intuitive interface that allows you to focus on studying, not technology.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Study Anywhere
                </Typography>
                <Typography variant="body2">
                  Flashcards are stored in the cloud, so you can access them from any device.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container> 

         {/* Pricing Section */}
         <Container sx={{ mt: 10, mb: 10 }}>
    <Typography variant="h4" align="center" gutterBottom>
      Pricing Plans
    </Typography>
    <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} sm={4}>
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" gutterBottom>
              Free Plan
            </Typography>
            <Typography variant="h6" color="primary">
              $0/month
            </Typography>
            <Typography variant="body2">
              Basic flashcard creation with up to 5 flashcard sets.
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="outlined" fullWidth>
              Get Started
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" gutterBottom>
              Premium Plan
            </Typography>
            <Typography variant="h6" color="primary">
              $9.99/month
            </Typography>
            <Typography variant="body2">
              Unlimited flashcards, advanced features, and priority support.
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" fullWidth onClick={handlePremiumClick}>
              Choose Premium
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  </Container>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: '#333', color: 'white', textAlign: 'center' }}>
        <Typography variant="body2">© {new Date().getFullYear()} Flash-AI. All rights reserved.</Typography>
      </Box>
    </div>
  );
}