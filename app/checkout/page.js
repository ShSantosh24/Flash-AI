'use client'

import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '../components/Navbar';
import { Button, Container, Typography, Box, TextField, Paper } from '@mui/material';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: email,
          },
        },
      });

      if (result.error) {
        console.error(result.error.message);
        alert('Payment failed. Please try again.');
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Update user subscription in your database
          await updateUserSubscription(userId, 'premium');
          alert('Payment successful! Your subscription has been upgraded.');
          // Redirect to dashboard or show success message
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
        sx={{ 
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputBase-input': {
            color: 'white',
          },
        }}
      />
      <Box sx={{ my: 3 }}>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: 'white',
                '::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
            },
          }}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!stripe || loading}
        fullWidth
        sx={{ 
          mt: 2, 
          backgroundColor: '#3f51b5',
          '&:hover': {
            backgroundColor: '#303f9f',
          },
        }}
      >
        Pay $9.99/month
      </Button>
    </form>
  );
};

export default function CheckoutPage() {
  const { userId } = useAuth();

  return (
    <Box sx={{ bgcolor: '#121212', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
            Upgrade to Premium
          </Typography>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              width: '100%', 
              bgcolor: '#1e1e1e',
              borderRadius: 2,
            }}
          >
            <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
              Enjoy unlimited flashcard sets and advanced features for just $9.99/month.
            </Typography>
            <Elements stripe={stripePromise}>
              <CheckoutForm userId={userId} />
            </Elements>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}