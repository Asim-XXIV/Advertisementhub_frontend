import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FilterList,
  Category as CategoryIcon,
  AttachMoney as AttachMoneyIcon,
  AccountBalance as AccountBalanceIcon,
  WorkOutline as WorkOutlineIcon,
  Assignment as AssignmentIcon,
  EventAvailable as EventAvailableIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Snackbar, 
  Alert,
  CircularProgress 
} from '@mui/material';

const AdvertiseContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StyledButton = styled(motion.button)`
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
`;

const CreateButton = styled(StyledButton)`
  background-color: #5e72e4;
  color: white;

  &:hover {
    background-color: #4f2bab;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled(motion.div)`
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

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: #4f2bab;
  margin-bottom: 0.5rem;
`;

const CardChip = styled.span`
  background-color: ${props => props.active ? '#4caf50' : '#9e9e9e'};
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  display: inline-block;
`;

const CardInfo = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  color: #333;
  font-size: 0.9rem;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
`;

const LoadMoreButton = styled(StyledButton)`
  background-color: #6c757d;
  color: white;
  margin: 2rem auto;
  display: block;

  &:hover {
    background-color: #5a6268;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Advertise = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [amount, setAmount] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdvertisements = useCallback(async (pageNum = 1, reset = false) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      let url = `http://localhost:8000/api/advertisements/?page=${pageNum}`;
      if (activeTab !== 'all') {
        url += `&status=${activeTab}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newAds = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setAdvertisements(prevAds => reset ? newAds : [...prevAds, ...newAds]);
      setHasMore(Array.isArray(response.data) ? newAds.length > 0 : !!response.data.next);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch advertisements. Please try again.',
        severity: 'error'
      });
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setPage(1);
    fetchAdvertisements(1, true);
  }, [fetchAdvertisements, activeTab]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setPage(1);
  }, []);

  const handleCreateClick = useCallback(() => {
    navigate('/dashboard/Create');
  }, [navigate]);

  const handleDetailsClick = useCallback((id) => {
    navigate(`/dashboard/details/${id}`);
  }, [navigate]);

  const handleAddFundClick = useCallback((id) => {
    setSelectedAdId(id);
    setOpenDialog(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpenDialog(false);
    setSelectedAdId(null);
    setAmount('');
  }, []);

  const handleAddFund = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        'http://localhost:8000/api/add-fund/',
        { advertisement_id: selectedAdId, amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: response.data.detail,
          severity: 'success'
        });
        fetchAdvertisements(1, true);
        handleDialogClose();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to add funds. ${error.response?.data?.detail || 'Please try again.'}`,
        severity: 'error'
      });
    }
  }, [selectedAdId, amount, fetchAdvertisements, handleDialogClose]);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const loadMoreAds = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAdvertisements(nextPage);
    }
  }, [isLoading, hasMore, page, fetchAdvertisements]);

  const tabButtons = useMemo(() => ['all', 'Active', 'completed', 'draft'], []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <AdvertiseContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FilterContainer>
        <FilterButtons>
          {tabButtons.map((tab) => (
            <StyledButton
              key={tab}
              active={activeTab === tab}
              onClick={() => handleTabChange(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </StyledButton>
          ))}
        </FilterButtons>
        <CreateButton
          onClick={handleCreateClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AddIcon /> Create Advertisement
        </CreateButton>
      </FilterContainer>

      {isLoading && advertisements.length === 0 ? (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      ) : advertisements.length > 0 ? (
        <>
          <CardGrid>
            <AnimatePresence>
              {advertisements.map((ad) => (
                <Card
                  key={ad.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <CardImage src={ad.thumbnail || 'https://source.unsplash.com/random'} alt={ad.title} />
                  <CardContent>
                    <CardTitle>{ad.title}</CardTitle>
                    <CardChip active={ad.status === 'Active'}>{ad.status}</CardChip>
                    <CardInfo><CategoryIcon /> {ad.category}</CardInfo>
                    <CardInfo><AttachMoneyIcon /> Budget: ${parseFloat(ad.budget).toFixed(2)}</CardInfo>
                    <CardInfo><AccountBalanceIcon /> Remaining: ${parseFloat(ad.remaining_budget).toFixed(2)}</CardInfo>
                    <CardInfo><WorkOutlineIcon /> Per Job: ${parseFloat(ad.per_job).toFixed(2)}</CardInfo>
                    <CardInfo><AssignmentIcon /> Submissions: {ad.submissions}</CardInfo>
                    <CardInfo><EventAvailableIcon /> Terminate: {new Date(ad.terminate).toLocaleDateString()}</CardInfo>
                  </CardContent>
                  <CardActions>
                    <StyledButton onClick={() => handleAddFundClick(ad.id)}>Add Fund</StyledButton>
                    <StyledButton onClick={() => handleDetailsClick(ad.id)}>Details</StyledButton>
                  </CardActions>
                </Card>
              ))}
            </AnimatePresence>
          </CardGrid>

          {hasMore && (
            <LoadMoreButton 
              onClick={loadMoreAds}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </LoadMoreButton>
          )}
        </>
      ) : (
        <p>No advertisements found for {activeTab === 'all' ? 'any status' : activeTab} status.</p>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Funds</DialogTitle>
        <DialogContent>
          <p>Add funds to advertisement ID: {selectedAdId}</p>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddFund} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdvertiseContainer>
  );
};

export default Advertise;