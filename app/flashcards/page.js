'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { createFlashcardSet } from '../firebase/flashcardOperations'; 
import Navbar from '../components/Navbar';
import LoadingAnimation from '../components/LoadingAnimation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  TextField
} from '@mui/material';

export default function FlashcardsPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const flashcardsParam = searchParams.get('flashcards');
    if (flashcardsParam) {
      const flashcardsData = JSON.parse(decodeURIComponent(flashcardsParam));
      const { flashcards, flashcardCollectionName, flashcardCollectionDescription } = flashcardsData;
      setFlashcards(flashcards);
      setCollectionName(flashcardCollectionName);
      setCollectionDescription(flashcardCollectionDescription);
    }
  }, [searchParams]);

  const handleLogoClick = () => {
    router.push('/dashboard');
  };

  const handleFlip = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleEdit = (index, field, value) => {
    setFlashcards(prev =>
      prev.map((card, i) => i === index ? { ...card, [field]: value } : card)
    );
  };

  const handleDelete = (index) => {
    setFlashcards(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const setId = await createFlashcardSet(userId, {
        name: collectionName,
        description: collectionDescription
      }, flashcards);

      console.log('Flashcards saved successfully!');
      alert('Flashcards saved successfully!');
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert('Error saving flashcards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      <Navbar/>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'black' }}>
          {collectionName || 'New Flashcard Set'}
        </Typography>
        <TextField
          fullWidth
          label="Collection Name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Collection Description"
          value={collectionDescription}
          onChange={(e) => setCollectionDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ mb: 2 }}>
          Save Flashcards
        </Button>
        <Grid container spacing={2}>
          {flashcards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onClick={() => handleFlip(index)}
              >
                <CardContent>
                  {flippedCards[index] ? (
                    <TextField
                      fullWidth
                      multiline
                      value={card.back}
                      onChange={(e) => handleEdit(index, 'back', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      multiline
                      value={card.front}
                      onChange={(e) => handleEdit(index, 'front', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </CardContent>
                <Box sx={{ mt: 'auto', p: 1 }}>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {isLoading && <LoadingAnimation />}
    </Box>
  );
}