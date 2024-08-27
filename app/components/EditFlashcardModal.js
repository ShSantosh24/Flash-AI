import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

export default function EditFlashcardModal({ isOpen, onClose, flashcard, onSave }) {
  const [front, setFront] = useState(flashcard?.front || '');
  const [back, setBack] = useState(flashcard?.back || '');

  const handleSave = () => {
    onSave({ ...flashcard, front, back });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="edit-flashcard-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="edit-flashcard-modal" variant="h6" component="h2" gutterBottom>
          Edit Flashcard
        </Typography>
        <TextField
          fullWidth
          label="Front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          margin="normal"
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </Box>
      </Box>
    </Modal>
  );
}