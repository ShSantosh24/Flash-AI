'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { fetchFlashcardSets, deleteFlashcardSet } from '../firebase/flashcardOperations';
import LoadingAnimation from '../components/LoadingAnimation'; 
import Navbar from '../components/Navbar';
import UploadModal from '../components/UploadModal';
import { 
  AppBar, Toolbar, Typography, Button, Container, Grid, Card, 
  CardContent, Box, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [studySets, setStudySets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState('free');
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      loadFlashcardSets();
      checkSubscription();
    }
  }, [userId]);

  const loadFlashcardSets = async () => {
    setIsLoading(true);
    try {
      const sets = await fetchFlashcardSets(userId);
      setStudySets(sets);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
    } finally {
      setIsLoading(false);
    }
  }; 

  const checkSubscription = async () => {
    try {
      const response = await fetch('/api/check-subscription', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSubscription(data.subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription('free'); // Default to free if there's an error
    }
  }; 

  const handleCreateSet = () => {
    if (subscription === 'free' && studySets.length >= 5) {
      setIsUpgradeDialogOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };  
  

  const handleUpgrade = () => {
    router.push('/checkout');
  };

  const handleDeleteSet = async (setId) => {
    if (window.confirm('Are you sure you want to delete this study set?')) {
      setIsLoading(true);
      try {
        await deleteFlashcardSet(userId, setId);
        setStudySets(prevSets => prevSets.filter(set => set.id !== setId));
      } catch (error) {
        console.error('Error deleting flashcard set:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpload = async (input, setName, description, isFileUpload) => {
    setIsLoading(true);
    setIsModalOpen(false);
  
    const formData = new FormData();
    if (isFileUpload) {
      formData.append('studyImage', input);
    } else {
      formData.append('studyText', input);
    }
    formData.append('isFileUpload', isFileUpload);
  
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
  
      if (result.error) {
        throw new Error(result.error);
      }
  
      const flashcardsData = {
        flashcards: result.flashcards,
        flashcardCollectionName: setName,
        flashcardCollectionDescription: description
      };
  
      router.push('/flashcards?' + new URLSearchParams({
        flashcards: encodeURIComponent(JSON.stringify(flashcardsData))
      }));
  
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("Error generating flashcards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const StudySetCard = ({ studySet, onDelete }) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {studySet.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {studySet.description || 'No description'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created: {new Date(studySet.createdAt.seconds * 1000).toLocaleDateString()}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Button size="small" onClick={() => router.push(`/flashcards/${studySet.id}`)}>
            Study
          </Button>
          <Button size="small" color="error" onClick={() => onDelete(studySet.id)}>
            Delete
          </Button> 
          <Button size="small" onClick={() => router.push(`/edit/${studySet.id}`)}>
          Edit
        </Button>
        </Box>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      <Navbar/>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'black' }}>
          My Study Sets
        </Typography>

        <Button variant="contained" color="primary" onClick={handleCreateSet} sx={{ mb: 4 }}>
          Create a new Study Set
        </Button>

        <Grid container spacing={4}>
          {studySets.map((set) => (
            <Grid item key={set.id} xs={12} sm={6} md={4}>
              <StudySetCard 
                studySet={set} 
                onDelete={handleDeleteSet}
              />
            </Grid>
          ))}
        </Grid>

        <UploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpload={handleUpload}
        />
        {isLoading && <LoadingAnimation />}
      </Container>

      <Dialog open={isUpgradeDialogOpen} onClose={() => setIsUpgradeDialogOpen(false)}>
        <DialogTitle>Upgrade to Premium</DialogTitle>
        <DialogContent>
          <Typography>
            You've reached the limit of 5 flashcard sets for free users. Upgrade to Premium for unlimited sets and more features!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpgradeDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpgrade} variant="contained" color="primary">
            Upgrade Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}