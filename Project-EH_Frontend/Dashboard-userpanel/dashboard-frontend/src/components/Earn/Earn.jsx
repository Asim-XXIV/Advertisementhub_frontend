import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterList, Close, KeyboardArrowDown, Delete } from '@mui/icons-material';

const EarnContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f8f9fa;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Button = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background-color: ${props => props.active ? '#4f2bab' : '#e0e0e0'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? 'bold' : 'normal'};

  &:hover {
    background-color: ${props => props.active ? '#4f2bab' : '#5e72e4'};
    color: white;
  }

  @media (max-width: 768px) {
    flex: 1;
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const SortButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #5e72e4;
  color: white;

  &:hover {
    background-color: #4f2bab;
  }
`;

const JobList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const JobCard = styled(motion.div)`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const JobContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ThumbnailContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const JobThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const JobDetails = styled.div`
  padding: 1rem;
`;

const JobHeader = styled.div`
  background-color: #4f2bab;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const JobTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const JobId = styled.span`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const JobBody = styled.div`
  padding: 1rem 0;
`;

const JobDescription = styled.div`
  margin-bottom: 1rem;
  color: #333;
  font-size: 0.9rem;
  max-height: ${props => (props.showFull ? 'none' : '80px')};
  overflow: hidden;
  position: relative;
  display: -webkit-box;
  -webkit-line-clamp: ${props => (props.showFull ? 'none' : '4')};
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const JobConfirmation = styled.div`
  margin-bottom: 1rem;
  color: #333;
  font-size: 0.9rem;
  max-height: ${props => (props.showFull ? 'none' : '80px')};
  overflow: hidden;
  position: relative;
  display: -webkit-box;
  -webkit-line-clamp: ${props => (props.showFull ? 'none' : '4')};
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;

const JobInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const InfoItem = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4f2bab;
  font-size: 0.9rem;
`;

const JobFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
`;

const JobReward = styled.span`
  font-weight: bold;
  color: #4f2bab;
  font-size: 1.1rem;
`;

const StartButton = styled(Button)`
  background-color: #5e72e4;
  color: white;

  &:hover {
    background-color: #4f2bab;
  }
`;

const ProofCard = styled(JobCard)`
  // Specific styles for proof cards if needed
`;

const ProofContent = styled.div`
  padding: 1rem;
`;

const ProofMedia = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const MediaItem = styled.div`
  max-width: 45%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 640px) {
    max-width: 100%;
  }
`;

const ProofImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ProofVideo = styled.video`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const FullscreenModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FullscreenContent = styled.div`
  max-width: 90%;
  max-height: 90%;
  position: relative;
`;

const FullscreenImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
`;

const FullscreenVideo = styled.video`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
`;

const LoadMoreButton = styled(Button)`
  margin: 1rem auto;
  display: block;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;
  align: right;

  &:hover {
    background-color: #c82333;
  }
`;

const Earn = () => {
  const [jobs, setJobs] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortOption, setSortOption] = useState('high-to-low');
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = useCallback(async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/advertisements/all/?page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      const newJobs = response.data;
      setJobs(prevJobs => pageNum === 1 ? newJobs : [...prevJobs, ...newJobs]);
      setHasMore(newJobs.length > 0);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setIsLoading(false);
    }
  }, []);

  const fetchProofs = useCallback(async (status, pageNum = 1) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/proofs/?status=${status}&page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      const newProofs = Array.isArray(response.data) ? response.data : response.data.results;
      setProofs(prevProofs => pageNum === 1 ? newProofs : [...prevProofs, ...newProofs]);
      setHasMore(Array.isArray(response.data) ? newProofs.length > 0 : !!response.data.next);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching proofs:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    if (filter === 'all') {
      fetchJobs(1);
    } else {
      fetchProofs(filter, 1);
    }
  }, [filter, fetchJobs, fetchProofs]);

  const handleFilterClick = (status) => {
    setFilter(status);
    setPage(1);
  };

  const handleStart = async (jobId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/advertisements/${jobId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      const advertisementData = response.data;

      navigate(`/dashboard/submit-proof/${jobId}`, {
        state: { job: advertisementData },
      });
    } catch (error) {
      console.error('Error fetching advertisement data:', error);
    }
  };

  const handleSort = () => {
    setSortOption(prev => prev === 'high-to-low' ? 'low-to-high' : 'high-to-low');
  };

  const sortedJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
    return [...jobs].sort((a, b) => {
      if (sortOption === 'high-to-low') {
        return b.reward - a.reward;
      } else {
        return a.reward - b.reward;
      }
    });
  }, [jobs, sortOption]);

  const openFullscreenMedia = (media) => {
    setFullscreenMedia(media);
  };

  const closeFullscreenMedia = () => {
    setFullscreenMedia(null);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    if (filter === 'all') {
      fetchJobs(nextPage);
    } else {
      fetchProofs(filter, nextPage);
    }
  };

  const handleDelete = async (proofId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No token found');
        return;
      }

      await axios.delete(
        `http://localhost:8000/api/proofs/delete/${proofId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      // Remove the deleted proof from the state
      setProofs(prevProofs => prevProofs.filter(proof => proof.proof_id !== proofId));
    } catch (error) {
      console.error('Error deleting proof:', error);
    }
  };

  const renderJobCard = (job) => (
    <JobCard
      key={job.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <JobHeader>
        <JobTitle>{job.title}</JobTitle>
        <JobId>ID: {job.id}</JobId>
      </JobHeader>
      <JobContent>
        <ThumbnailContainer>
          {job.thumbnail && <JobThumbnail src={job.thumbnail} alt={job.title} />}
        </ThumbnailContainer>
        <JobDetails>
          <JobBody>
            <label>Description<JobDescription dangerouslySetInnerHTML={{ __html: job.description }} /></label>
            <br />
            <label>Confirmation Requirements<JobConfirmation dangerouslySetInnerHTML={{__html: job.confirmation_requirements}} /></label>
            <JobInfo>
              <InfoItem>Budget: ${job.budget}</InfoItem>
              <InfoItem>Remaining: ${job.remaining_budget}</InfoItem>
            </JobInfo>
          </JobBody>
          <JobFooter>
            <JobReward>Per Job: ${job.reward}</JobReward>
            <StartButton
              onClick={() => handleStart(job.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Job
            </StartButton>
          </JobFooter>
        </JobDetails>
      </JobContent>
    </JobCard>
  );

  const renderProofCard = (proof) => (
    <ProofCard
      key={proof.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <JobHeader>
        <JobTitle>{proof.advertisement_title}</JobTitle>
        <JobId>Proof ID: {proof.proof_id}</JobId>
      </JobHeader>
      <ProofContent>
        <JobInfo>
          <InfoItem>Status: {proof.status}</InfoItem>
          <InfoItem>Advertisement: {proof.advertisement_title}</InfoItem>
        </JobInfo>
        <ProofMedia>
          {proof.photo && (
            <MediaItem onClick={() => openFullscreenMedia({ type: 'image', src: proof.photo })}>
              <ProofImage src={proof.photo} alt="Proof Photo" />
            </MediaItem>
          )}
          {proof.video && (
            <MediaItem onClick={() => openFullscreenMedia({ type: 'video', src: proof.video })}>
              <ProofVideo>
                <source src={proof.video} type="video/mp4" />
                Your browser does not support the video tag.
              </ProofVideo>
            </MediaItem>
          )}
        </ProofMedia>
        {(proof.status === 'approved' || proof.status === 'denied') && (
          <DeleteButton
            onClick={() => handleDelete(proof.proof_id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Delete /> Delete Proof
          </DeleteButton>
        )}
      </ProofContent>
    </ProofCard>
  );

  return (
    <EarnContainer>
      <FilterContainer>
        <FilterButtons>
          {['all', 'unapproved', 'approved', 'denied'].map((status) => (
            <Button
              key={status}
              active={filter === status}
              onClick={() => handleFilterClick(status)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </FilterButtons>
        {filter === 'all' && (
          <SortButton
            onClick={handleSort}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FilterList />
            Sort {sortOption === 'high-to-low' ? 'High to Low' : 'Low to High'}
            <KeyboardArrowDown />
          </SortButton>
        )}
      </FilterContainer>
      <JobList>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <AnimatePresence>
            {filter === 'all'
              ? sortedJobs.map(renderJobCard)
              : proofs.map(renderProofCard)}
          </AnimatePresence>
        )}
      </JobList>
      {hasMore && !isLoading && (
        <LoadMoreButton
          onClick={handleLoadMore}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Load More
        </LoadMoreButton>
      )}
      <AnimatePresence>
        {fullscreenMedia && (
          <FullscreenModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFullscreenMedia}
          >
            <FullscreenContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={closeFullscreenMedia}>
                <Close />
              </CloseButton>
              {fullscreenMedia.type === 'image' ? (
                <FullscreenImage src={fullscreenMedia.src} alt="Fullscreen" />
              ) : (
                <FullscreenVideo controls>
                  <source src={fullscreenMedia.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </FullscreenVideo>
              )}
            </FullscreenContent>
          </FullscreenModal>
        )}
      </AnimatePresence>
    </EarnContainer>
  );
};

export default Earn;