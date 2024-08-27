import { useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button, Stepper, Step, StepLabel, Switch, FormControlLabel
} from '@mui/material';

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [activeStep, setActiveStep] = useState(0);
  const [setName, setSetName] = useState('');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSetNameChange = (event) => {
    setSetName(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (setName && description && (isFileUpload ? file : textInput)) {
      await onUpload(isFileUpload ? file : textInput, setName, description, isFileUpload);
    }
    onClose();
  };

  const steps = ['Name your set', 'Add a description', 'Choose input method', 'Enter content'];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
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
        <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
          Create New Study Set
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>
          {activeStep === 0 && (
            <TextField
              label="Set Name"
              value={setName}
              onChange={handleSetNameChange}
              fullWidth
              required
              margin="normal"
            />
          )}
          {activeStep === 1 && (
            <TextField
              label="Description"
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              required
              multiline
              margin="normal"
            />
          )}
          {activeStep === 2 && (
            <FormControlLabel
              control={
                <Switch
                  checked={isFileUpload}
                  onChange={() => setIsFileUpload(!isFileUpload)}
                  name="inputMethod"
                />
              }
              label={isFileUpload ? "File Upload" : "Text Input"}
            />
          )}
          {activeStep === 3 && (
            isFileUpload ? (
              <TextField
                type="file"
                accept="image/*,jpeg,png"
                onChange={handleFileChange}
                fullWidth
                margin="normal"
              />
            ) : (
              <TextField
                label="Enter text for flashcards"
                value={textInput}
                onChange={handleTextInputChange}
                fullWidth
                required
                multiline
                rows={4}
                margin="normal"
              />
            )
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button onClick={handleSubmit} disabled={!setName || !description || (isFileUpload ? !file : !textInput)}>
              Create Set
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={
              (activeStep === 0 && !setName) ||
              (activeStep === 1 && !description)
            }>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}