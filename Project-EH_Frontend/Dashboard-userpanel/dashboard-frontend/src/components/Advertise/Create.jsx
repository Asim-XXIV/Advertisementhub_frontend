import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './Create.css';
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

const AnimatedPaper = motion(StyledPaper);

const ThumbnailBox = styled(Box)(({ theme }) => ({
  width: '200px',
  height: '200px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
  },
}));

const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'default',
    budget: 0,
    per_job: 0,
    limit: 'days',
    time: '',
    description: '',
    confirmation_requirements: '',
    requires_media: false,
    media_type: '',
    thumbnail: null,
    status: 'unapproved',
  });

  const [showPreviewPopup, setShowPreviewPopup] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showFullImageDialog, setShowFullImageDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleCKEditorChange = useCallback((event, editor, name) => {
    const data = editor.getData();
    setFormData((prevData) => ({ ...prevData, [name]: data }));
  }, []);

  const calculateBudget = useCallback((terminateDate) => {
    const currentDate = new Date();
    const terminate = new Date(terminateDate);
    const timeDiff = terminate - currentDate;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days * 100;
  }, []);

  const handleTerminateChange = useCallback((e) => {
    const terminateDate = e.target.value;
    const calculatedBudget = calculateBudget(terminateDate);

    setFormData((prevData) => ({
      ...prevData,
      time: terminateDate,
      budget: calculatedBudget,
      remaining_budget: calculatedBudget
    }));
  }, [calculateBudget]);

  const createAdvertisement = useCallback(async (isDraft = false) => {
    const token = localStorage.getItem('access_token');
    const data = new FormData();
  
    const fieldsToInclude = isDraft 
      ? ['title', 'description'] 
      : ['title', 'category', 'budget', 'per_job', 'limit', 'description', 'remaining_budget', 'confirmation_requirements', 'requires_media', 'media_type', 'thumbnail'];
  
    fieldsToInclude.forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });
  
    data.append('status', isDraft ? 'draft' : 'unapproved');
  
    if (!isDraft && formData.limit === 'days' && formData.time) {
      data.append('terminate', formData.time);
    }
  
    try {
      const response = await axios.post(
        'http://localhost:8000/api/advertisements/create/',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setShowSuccessDialog(true);
      setShowPreviewPopup(false);
    } catch (error) {
      console.error(isDraft ? 'Error saving draft:' : 'Error creating advertisement:', error);
      setSnackbar({
        open: true,
        message: isDraft ? 'Failed to save draft. Please try again.' : 'Failed to create advertisement. Please try again.',
        severity: 'error'
      });
    }
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    await createAdvertisement(false);
  }, [createAdvertisement]);

  const handleSaveAsDraft = useCallback(async () => {
    await createAdvertisement(true);
  }, [createAdvertisement]);

  const handlePreview = useCallback(() => {
    setShowPreviewPopup(true);
  }, []);

  const closePreview = useCallback(() => {
    setShowPreviewPopup(false);
  }, []);

  const handleCloseSuccessDialog = useCallback(() => {
    setShowSuccessDialog(false);
    navigate('/dashboard');
  }, [navigate]);

  const handleOpenFullImage = useCallback(() => {
    setShowFullImageDialog(true);
  }, []);

  const handleCloseFullImage = useCallback(() => {
    setShowFullImageDialog(false);
  }, []);

  const renderPreviewContent = useMemo(() => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Thumbnail</Typography>
            {formData.thumbnail && (
              <ThumbnailBox onClick={handleOpenFullImage}>
                <img src={URL.createObjectURL(formData.thumbnail)} alt="Thumbnail" />
              </ThumbnailBox>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>{formData.title}</Typography>
            <Typography variant="body1">Category: {formData.category}</Typography>
            <Typography variant="body1">Budget: ${formData.budget}</Typography>
            <Typography variant="body1">Per Job: ${formData.per_job}</Typography>
            <Typography variant="body1">Limit: {formData.limit}</Typography>
            {formData.limit === 'days' && <Typography variant="body1">Time: {formData.time}</Typography>}
            <Typography variant="body1">Requires Media: {formData.requires_media ? 'Yes' : 'No'}</Typography>
            {formData.requires_media && <Typography variant="body1">Media Type: {formData.media_type}</Typography>}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Description:</Typography>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
              disabled={true}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Confirmation Requirements:</Typography>
            <CKEditor
              editor={ClassicEditor}
              data={formData.confirmation_requirements}
              disabled={true}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  ), [formData, handleOpenFullImage]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Create Your Advertisement
      </Typography>
      <form onSubmit={handleSubmit}>
        <AnimatedPaper
          elevation={3}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Category Name"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Budget"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
            disabled={formData.limit === 'days'}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Per Job"
            name="per_job"
            type="number"
            value={formData.per_job}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Limit</InputLabel>
            <Select
              name="limit"
              value={formData.limit}
              onChange={handleChange}
            >
              <MenuItem value="days">Days</MenuItem>
              <MenuItem value="jobs">Jobs</MenuItem>
            </Select>
          </FormControl>
          {formData.limit === 'days' && (
            <TextField
              fullWidth
              label="Termination Date"
              name="time"
              type="date"
              value={formData.time}
              onChange={handleTerminateChange}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          )}
        </AnimatedPaper>

        <AnimatedPaper
          elevation={3}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <CKEditor
            editor={ClassicEditor}
            data={formData.description}
            onChange={(event, editor) => handleCKEditorChange(event, editor, 'description')}
          />
        </AnimatedPaper>

        <AnimatedPaper
          elevation={3}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h6" gutterBottom>
            Confirmation Requirements
          </Typography>
          <CKEditor
            editor={ClassicEditor}
            data={formData.confirmation_requirements}
            onChange={(event, editor) => handleCKEditorChange(event, editor, 'confirmation_requirements')}
          />
        </AnimatedPaper>

        <AnimatedPaper
          elevation={3}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FormControl component="fieldset" margin="normal">
            <Typography variant="h6" gutterBottom>
              Media Requirements
            </Typography>
            <RadioGroup
              name="requires_media"
              value={formData.requires_media.toString()}
              onChange={handleChange}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
          {formData.requires_media && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Media Type</InputLabel>
              <Select
                name="media_type"
                value={formData.media_type}
                onChange={handleChange}
              >
                <MenuItem value="photo">Photo</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </Select>
            </FormControl>
          )}
        </AnimatedPaper>

        <AnimatedPaper
          elevation={3}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Typography variant="h6" gutterBottom>
            Thumbnail
          </Typography>
          <input
            type="file"
            name="thumbnail"
            onChange={handleChange}
            accept="image/*"
          />
          {formData.thumbnail && (
            <Typography variant="body2" gutterBottom>
              Selected file: {formData.thumbnail.name}
            </Typography>
          )}
        </AnimatedPaper>

        <Box mt={3}>
          <StyledButton variant="contained" color="primary" onClick={handlePreview}>
            Preview
          </StyledButton>
          <StyledButton variant="contained" color="secondary" type="submit">
            Create Advertisement
          </StyledButton>
          <StyledButton variant="outlined" color="primary" onClick={handleSaveAsDraft}>
            Save as Draft
          </StyledButton>
        </Box>
      </form>

      <Dialog open={showPreviewPopup} onClose={closePreview} maxWidth="md" fullWidth>
        <DialogTitle>Advertisement Preview</DialogTitle>
        <DialogContent>
          {renderPreviewContent}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePreview} color="primary">
            Close
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Create Advertisement
          </Button>
          <Button onClick={handleSaveAsDraft} color="secondary" variant="contained">
            Save as Draft
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showSuccessDialog} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your advertisement has been created successfully and is waiting for approval.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showFullImageDialog} onClose={handleCloseFullImage} maxWidth="md" fullWidth>
        <DialogTitle>Full Size Thumbnail</DialogTitle>
        <DialogContent>
          {formData.thumbnail && (
            <img 
              src={URL.createObjectURL(formData.thumbnail)} 
              alt="Full size thumbnail" 
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFullImage} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default Create;