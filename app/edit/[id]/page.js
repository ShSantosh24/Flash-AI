'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useParams } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs"; 
import Navbar from '@/app/components/Navbar';
import { fetchFlashcardSet, updateFlashcardSet, createFlashcardSet, } from '../../firebase/flashcardOperations';
import LoadingAnimation from '../../components/LoadingAnimation';
import {
  AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Box, TextField
} from '@mui/material';

export default function EditFlashcardsPage() {
  const router = useRouter();
  const { userId } = useAuth(); 
  const params = useParams();
  const { id } = params;
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [setId, setSetId] = useState(null); 

  useEffect(() => {
    if (userId && id) {
      loadFlashcardSet();
    }
  }, [userId, id]); 

  console.log("This is the userID and the id ",userId , id)

  const loadFlashcardSet = async () => {
    setIsLoading(true);
    try { 
      //console.log(`We are starting the retrieval with user id ${userId} and flashcard id of ${id}`) 
      const set = await fetchFlashcardSet(userId, id); 
      //console.log("did we get the set for the correct flashcards", set)
      setFlashcards(set.flashcards);     
      setCollectionName(set.name); 
      setCollectionDescription(set.description); 
      setSetId(id);
    } catch (error) {
      console.error('Error fetching flashcard set:', error);
      alert('Error loading flashcard set. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
    if(flashcards.length > 1){
      setFlashcards(prev => prev.filter((_, i) => i !== index));
    }else{ 
      alert("You must have at least one flashcard in the set! ")
    }
  };

  const handleSave = async () => {
    setIsLoading(true);  

    if(!collectionName || !collectionDescription ){
      alert('Name and Description must be filled out');
      setIsLoading(false);
      return;
    }  

    try {  

      console.log('Flashcards state before save:', flashcards);
      
      console.log('Saving flashcards:', {
        userId,
        setId,
        name: collectionName,
        description: collectionDescription,
        flashcards: flashcards
      });

      await updateFlashcardSet(userId, setId, {
        name: collectionName,
        description: collectionDescription,
        flashcards: flashcards
      });

      alert('Flashcards updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating flashcards:', error);
      alert('Error updating flashcards. Please try again.');
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
