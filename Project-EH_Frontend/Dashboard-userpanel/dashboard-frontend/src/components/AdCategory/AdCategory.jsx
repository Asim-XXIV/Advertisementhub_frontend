import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Category as CategoryIcon,
  AttachMoney as AttachMoneyIcon,
  AccountBalance as AccountBalanceIcon,
  WorkOutline as WorkOutlineIcon,
  EventAvailable as EventAvailableIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton } from '@mui/material';

// Styled components
const AdvertiseContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f9fa;
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h2`
  color: #4f2bab;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const CategoryDivider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #e0e0e0;
  margin-bottom: 2rem;
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

const Button = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background-color: ${props => props.color || '#5e72e4'};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    background-color: ${props => props.hoverColor || '#4f2bab'};
  }
`;

const AdCategory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchAdvertisements = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No access token found. Please log in.');

      const { data } = await axios.get('http://localhost:8000/api/advertisements/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const groupedData = data.reduce((acc, ad) => {
        acc[ad.category] = acc[ad.category] || [];
        acc[ad.category].push(ad);
        return acc;
      }, {});

      const formattedData = Object.entries(groupedData).map(([category, advertisements]) => ({
        category,
        advertisements,
      }));

      setData(formattedData);
    } catch (err) {
      console.error('Error fetching advertisements:', err);
      setError(err.message || 'An error occurred while fetching advertisements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvertisements();
  }, [fetchAdvertisements]);

  const handleDelete = async () => {
    if (adToDelete) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/advertisements/${adToDelete}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAdvertisements();  // Refresh data after deletion
      } catch (err) {
        console.error('Error deleting advertisement:', err);
        setError(err.message || 'An error occurred while deleting the advertisement.');
      } finally {
        setDialogOpen(false);  // Close dialog after deletion
      }
    }
  };

  const openDeleteDialog = (id) => {
    setAdToDelete(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setAdToDelete(null);
  };

  const handleDetailsClick = (id) => {
    navigate(`/dashboard/details/${id}`);
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <AdvertiseContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {data.map((category, index) => (
            <React.Fragment key={category.category}>
              <CategorySection>
                <CategoryTitle>{category.category}</CategoryTitle>
                <CardGrid>
                  {category.advertisements.map((ad) => (
                    <Card
                      key={ad.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardImage src={ad.thumbnail || 'https://source.unsplash.com/random'} alt={ad.title} />
                      <CardContent>
                        <CardTitle>{ad.title}</CardTitle>
                        <CardChip active={ad.status === 'Active'}>{ad.status}</CardChip>
                        <CardInfo><CategoryIcon /> {category.category}</CardInfo>
                        <CardInfo><AttachMoneyIcon /> Budget: ${ad.budget}</CardInfo>
                        <CardInfo><AccountBalanceIcon /> Remaining: ${ad.remaining_budget}</CardInfo>
                        <CardInfo><WorkOutlineIcon /> Per Job: ${ad.per_job}</CardInfo>
                        <CardInfo><EventAvailableIcon /> Created: {new Date(ad.created_at).toLocaleDateString()}</CardInfo>
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={() => handleDetailsClick(ad.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Details
                        </Button>
                        <Button
                          color="#dc3545"
                          hoverColor="#c82333"
                          onClick={() => openDeleteDialog(ad.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <DeleteIcon /> Delete
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </CardGrid>
              </CategorySection>
              {index < data.length - 1 && <CategoryDivider />}
            </React.Fragment>
          ))}
        </AnimatePresence>
      </AdvertiseContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Advertisement</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this advertisement? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={closeDeleteDialog} color="primary">Cancel</MuiButton>
          <MuiButton onClick={handleDelete} color="secondary">Delete</MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdCategory;
