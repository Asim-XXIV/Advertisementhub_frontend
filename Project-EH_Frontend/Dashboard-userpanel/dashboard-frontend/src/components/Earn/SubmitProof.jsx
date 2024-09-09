import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, CheckCircleOutline } from '@mui/icons-material';

const SubmitProofContainer = styled(motion.div)`
  max-width: 1100px;
  margin: 20px auto;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #4f2bab;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
`;

const JobDetails = styled(motion.div)`
  background-color: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const JobTitle = styled.h2`
  font-size: 24px;
  color: #4f2bab;
  margin-bottom: 15px;
  font-weight: 600;
`;

const JobInfo = styled.p`
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;

  strong {
    font-weight: 600;
    color: #5e72e4;
    margin-right: 10px;
    min-width: 120px;
  }
`;

const ThumbnailContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Thumbnail = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ProofUpload = styled(motion.div)`
  background-color: #f8f9fa;
  border: 2px dashed #5e72e4;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4f2bab;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const UploadTitle = styled.h3`
  margin-bottom: 15px;
  color: #4f2bab;
  font-size: 20px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  background-color: #5e72e4;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #4f2bab;
    transform: translateY(-2px);
  }
`;

const FileName = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: #666;
`;

const SubmitButton = styled(motion.button)`
  display: block;
  width: 100%;
  padding: 15px 20px;
  background-color: #5e72e4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #4f2bab;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Message = styled(motion.p)`
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  ${props => props.isError 
    ? 'background-color: #ffebee; color: #c62828;' 
    : 'background-color: #e8f5e9; color: #2e7d32;'}
`;

const SubmitProof = () => {
  const location = useLocation();
  const { job } = location.state;
  const [message, setMessage] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [selectedFile, setSelectedFile] = useState({ photo: null, video: null });
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setSelectedFile(prev => ({ ...prev, [name]: files[0] }));
    if (files.length > 0) {
      console.log(`${name} selected:`, files[0]);
      if (name === 'photo') {
        setPhoto(files[0]);
      } else if (name === 'video') {
        setVideo(files[0]);
      }
    }
  };

  const clearInputs = () => {
    setPhoto(null);
    setVideo(null);
    setSelectedFile({ photo: null, video: null });
    if (document.querySelector('input[name="photo"]')) {
      document.querySelector('input[name="photo"]').value = '';
    }
    if (document.querySelector('input[name="video"]')) {
      document.querySelector('input[name="video"]').value = '';
    }
  };

  const handleSubmitProof = async () => {
    if (job.requires_media && !photo && !video) {
      setMessage({ text: "Please select a file before submitting.", isError: true });
      return;
    }
    const formData = new FormData();
    formData.append('advertisement_id', job.id);
  
    if (photo) {
      formData.append('photo', photo);
    }
    if (video) {
      formData.append('video', video);
    }
  
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
  
      const response = await fetch('http://localhost:8000/api/submit-proof/', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        setMessage({ text: responseData.detail || 'Proof submitted successfully.', isError: false });
        clearInputs();
        setIsSubmitted(true); // Set the submission state to true
      } else {
        throw new Error(responseData.detail || 'Failed to submit proof.');
      }
    } catch (error) {
      console.error("Error submitting proof:", error);
      setMessage({ text: `Error: ${error.message}`, isError: true });
    }
  };

  return (
    <SubmitProofContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Submit Proof for Advertisement</Title>
      <JobDetails
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <JobTitle>{job.title}</JobTitle>
        <JobInfo><strong>Job ID:</strong> {job.id}</JobInfo>
        <JobInfo><strong>Category:</strong> {job.category}</JobInfo>
        <JobInfo><strong>Budget:</strong> ${job.budget}</JobInfo>
        <JobInfo><strong>Per Job:</strong> ${job.per_job}</JobInfo>
        <JobInfo><strong>Status:</strong> {job.status}</JobInfo>
        <JobInfo><strong>Description:</strong></JobInfo>
        <div dangerouslySetInnerHTML={{ __html: job.description }} />
        <JobInfo><strong>Confirmation Requirements:</strong></JobInfo>
        <div dangerouslySetInnerHTML={{ __html: job.confirmation_requirements }} />
      </JobDetails>

      {job.thumbnail && (
        <ThumbnailContainer>
          <Thumbnail src={job.thumbnail} alt={job.title} />
        </ThumbnailContainer>
      )}

      {job.requires_media && (
        <ProofUpload
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <UploadTitle>Upload Your Proof</UploadTitle>
          {(job.media_type === 'photo' || job.media_type === 'both') && (
            <div>
              <FileLabel htmlFor="photo-upload">
                <CloudUpload /> Choose Photo
              </FileLabel>
              <FileInput
                id="photo-upload"
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
              />
              {selectedFile.photo && <FileName>{selectedFile.photo.name}</FileName>}
            </div>
          )}
          {(job.media_type === 'video' || job.media_type === 'both') && (
            <div>
              <FileLabel htmlFor="video-upload">
                <CloudUpload /> Choose Video
              </FileLabel>
              <FileInput
                id="video-upload"
                type="file"
                name="video"
                accept="video/*"
                onChange={handleFileChange}
              />
              {selectedFile.video && <FileName>{selectedFile.video.name}</FileName>}
            </div>
          )}
        </ProofUpload>
      )}

      <SubmitButton
        onClick={handleSubmitProof}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isSubmitted} // Disable after submission
      >
        <CheckCircleOutline /> {isSubmitted ? "Proof Submitted" : "Submit Proof"}
      </SubmitButton>

      <AnimatePresence>
        {message && (
          <Message
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            isError={message.isError}
          >
            {message.text}
          </Message>
        )}
      </AnimatePresence>
    </SubmitProofContainer>
  );
};

export default SubmitProof;
