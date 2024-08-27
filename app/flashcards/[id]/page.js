'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { useParams } from 'next/navigation';
import { fetchFlashcardSet} from '../../firebase/flashcardOperations'; 
import Navbar from '@/app/components/Navbar';
import {
  AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Box,
} from '@mui/material';
import { motion } from 'framer-motion';

export default function FlashcardSetPage() {
  const router = useRouter();
  const { userId } = useAuth(); 
  const params = useParams();
  const { id } = params;
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (userId && id) {
      loadFlashcardSet();
    }
  }, [userId, id]);

  const loadFlashcardSet = async () => {
    try {
      const set = await fetchFlashcardSet(userId, id);
      setFlashcardSet(set);
    } catch (error) {
      console.error('Error fetching flashcard set:', error);
    }
  };

  const handleLogoClick = () => {
    router.push('/dashboard');
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCardIndex < flashcardSet.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  if (!flashcardSet) return <div>Loading...</div>;

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
     <Navbar/>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'black' }}>
          {flashcardSet.name}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'gray' }}>
          {flashcardSet.description}
        </Typography>

        {flashcardSet.flashcards.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Card 
                sx={{ 
                  width: 300, 
                  height: 200, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  perspective: '1000px'
                }} 
                onClick={handleFlip}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}>
                    {isFlipped 
                      ? flashcardSet.flashcards[currentCardIndex].back 
                      : flashcardSet.flashcards[currentCardIndex].front}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
            <Box sx={{ mt: 2 }}>
              <Button onClick={handlePrev} disabled={currentCardIndex === 0}>Previous</Button>
              <Button onClick={handleNext} disabled={currentCardIndex === flashcardSet.flashcards.length - 1}>Next</Button>
            </Box>
            <Typography sx={{ mt: 2, color: 'black'}}>
              Card {currentCardIndex + 1} of {flashcardSet.flashcards.length}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}