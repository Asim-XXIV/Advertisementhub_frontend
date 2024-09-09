import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './Advdetails.css';

const API_BASE_URL = 'http://localhost:8000/api';

const AdvDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState(null);
  const [error, setError] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editedFields, setEditedFields] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isThumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAdvertisementDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await axios.get(`${API_BASE_URL}/advertisements/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdvertisement(response.data);
      setThumbnailPreview(response.data.thumbnail);
    } catch (error) {
      console.error('Error fetching advertisement details:', error);
      setError(error.message || 'An error occurred while fetching advertisement details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAdvertisementDetails();
  }, [fetchAdvertisementDetails]);

  const handleViewSubmissions = useCallback(() => {
    navigate(`/dashboard/advertisements/${id}/submissions`);
  }, [navigate, id]);

  const handleEdit = useCallback(async () => {
    try {
      await fetchAdvertisementDetails();
      setEditedFields({
        ...advertisement,
        category_name: advertisement.category_name || '',
        terminate: advertisement.terminate ? new Date(advertisement.terminate).toISOString().split('T')[0] : '',
      });
      setThumbnailPreview(advertisement.thumbnail);
      setShowEditPopup(true);
    } catch (error) {
      console.error('Error preparing edit form:', error);
      setError('Failed to load the latest advertisement data for editing.');
    }
  }, [advertisement, fetchAdvertisementDetails]);

  const handleDelete = useCallback(async () => {
    if (advertisement.status === 'Active' && advertisement.submissions > 0) {
      alert('Please manage all submissions before deleting this advertisement.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`${API_BASE_URL}/advertisements/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting advertisement:', error);
        setError(error.message || 'An error occurred while deleting the advertisement.');
      }
    }
  }, [id, navigate, advertisement]);

  const handleEditSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
  
      Object.entries(editedFields).forEach(([key, value]) => {
        if (value != null && value !== '') {
          if (key === 'requires_media') {
            formData.append(key, value ? 'true' : 'false');
          } else if (key !== 'thumbnail' || typeof value !== 'string') {
            formData.append(key, value);
          }
        }
      });
  
      if (advertisement.status === 'draft') {
        formData.append('status', 'unapproved');
      }
  
      const response = await axios.patch(`${API_BASE_URL}/advertisements/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setAdvertisement(response.data);
      setShowEditPopup(false);
      setEditedFields({});
      setThumbnailPreview(response.data.thumbnail);
      alert(advertisement.status === 'draft' ? 'Advertisement published successfully!' : 'Advertisement updated successfully!');
      fetchAdvertisementDetails();
    } catch (error) {
      console.error('Error updating advertisement:', error);
      setError(error.response?.data?.error || 'An error occurred while updating the advertisement.');
    }
  }, [advertisement, editedFields, fetchAdvertisementDetails, id]);

  const calculateBudget = useCallback((terminateDate) => {
    const currentDate = new Date();
    const terminate = new Date(terminateDate);
    const timeDiff = terminate - currentDate;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days * 100;
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    setEditedFields(prevData => {
      const newData = { ...prevData };

      if (name === 'limit') {
        newData[name] = value;
        newData.budget = advertisement.budget;
        newData.terminate = advertisement.terminate;
      } else if (name === 'terminate' && prevData.limit === 'days') {
        newData[name] = value;
        newData.budget = calculateBudget(value);
      } else {
        newData[name] = type === 'file' ? files[0] : 
                        type === 'checkbox' ? checked : 
                        name === 'requires_media' ? (value === 'true' || value === true) : 
                        value;
      }

      return newData;
    });
  
    if (name === 'thumbnail' && files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(files[0]);
    }
  }, [advertisement, calculateBudget]);

  const handleCKEditorChange = useCallback((event, editor, name) => {
    const data = editor.getData();
    setEditedFields(prevData => ({ ...prevData, [name]: data }));
  }, []);

  const renderEditForm = useMemo(() => {
    if (!showEditPopup) return null;
    return (
      <form onSubmit={handleEditSubmit}>
        <h2>{advertisement.status === 'draft' ? 'Complete Your Advertisement' : 'Edit Your Advertisement'}</h2>
        
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={editedFields.title || ''}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Category Name:
          <input
            type="text"
            name="category_name"
            value={editedFields.category || ''}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Budget:
          <input
            type="number"
            name="budget"
            value={editedFields.budget || 0}
            onChange={handleInputChange}
            disabled={editedFields.limit === 'days'}
            required
          />
        </label>

        <label>
          Per Job:
          <input
            type="number"
            name="per_job"
            value={editedFields.per_job || 0}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Limit:
          <select
            name="limit"
            value={editedFields.limit || ''}
            onChange={handleInputChange}
            disabled={advertisement.status === 'active'}
            required
          >
            <option value="days">Days</option>
            <option value="jobs">Jobs</option>
          </select>
        </label>

        {editedFields.limit === 'days' && (
          <label>
            Termination Date:
            <input
              type="date"
              name="terminate"
              value={editedFields.terminate || ''}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </label>
        )}

        <label>
          Description:
          <CKEditor
            editor={ClassicEditor}
            data={editedFields.description || ''}
            onChange={(event, editor) => handleCKEditorChange(event, editor, 'description')}
          />
        </label>

        <label>
          Confirmation Requirements:
          <CKEditor
            editor={ClassicEditor}
            data={editedFields.confirmation_requirements || ''}
            onChange={(event, editor) => handleCKEditorChange(event, editor, 'confirmation_requirements')}
          />
        </label>

        <label>
          Requires Media:
          <input
            type="checkbox"
            name="requires_media"
            checked={editedFields.requires_media || false}
            onChange={handleInputChange}
          />
        </label>

        {editedFields.requires_media && (
          <label>
            Media Type:
            <select
              name="media_type"
              value={editedFields.media_type || ''}
              onChange={handleInputChange}
              required
            >
              <option value="photo">Photo</option>
              <option value="video">Video</option>
              <option value="both">Both</option>
            </select>
          </label>
        )}

        <div className="thumbnail-upload">
          <label htmlFor="thumbnail-input" className="thumbnail-label">
            Thumbnail:
            <input
              id="thumbnail-input"
              type="file"
              name="thumbnail"
              onChange={handleInputChange}
              accept="image/*"
              className="thumbnail-input"
            />
            <span className="thumbnail-button">
              {thumbnailPreview ? 'Change Image' : 'Choose Image'}
            </span>
          </label>
          {thumbnailPreview && (
            <div className="thumbnail-preview" onClick={() => setThumbnailModalOpen(true)}>
              <img src={thumbnailPreview} alt="Thumbnail preview" />
            </div>
          )}
        </div>

        <div className="edit-popup-buttons">
          <button type="submit">
            {advertisement.status === 'draft' ? 'Save and Publish' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => setShowEditPopup(false)}>Cancel</button>
        </div>
      </form>
    );
  }, [advertisement, editedFields, handleCKEditorChange, handleEditSubmit, handleInputChange, showEditPopup, thumbnailPreview]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!advertisement) {
    return <div className="loading">Advertisement not found.</div>;
  }

  return (
    <div className="details-container">
      <div className="ad-card">
        <div className="media-section thumbnail" onClick={() => setThumbnailModalOpen(true)}>
          <img src={thumbnailPreview || 'placeholder-image-url.jpg'} alt="Thumbnail" className="thumbnail-image" />
        </div>
        <div className="ad-content">
          <h2 className="ad-title">Title: {advertisement.title}</h2>
          <div className="text-box ad-description">
            <h3>Description</h3>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(advertisement.description) }} />
          </div>
          <div className="text-box confirmation-requirements">
            <h3>Confirmation Requirements</h3>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(advertisement.confirmation_requirements) }} />
          </div>
          <div className="ad-info">
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">{advertisement.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Budget:</span>
              <span className="info-value">${advertisement.budget}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Per Job:</span>
              <span className="info-value">${advertisement.per_job}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Limit:</span>
              <span className="info-value">{advertisement.limit}</span>
            </div>
            {advertisement.limit === 'days' && (
              <div className="info-item">
                <span className="info-label">Termination Date:</span>
                <span className="info-value">{advertisement.terminate}</span>
              </div>
            )}
          </div>
          <div className="ad-details">
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value status-tag">{advertisement.status}</span>
            </div>
            <br></br>
            <span>***NOTE: YOU CANT DELETE YOUR ADVERTISEMENT IF YOU HAVE ANY PENDING SUBMISSION</span>
          </div>
        </div>

        {advertisement.video && (
          <div className="media-section video-section">
            <h3>Video Tutorial</h3>
            <video src={advertisement.video} controls />
          </div>
        )}

        <div className="action-buttons">
          <button className="edit-button" onClick={handleEdit}>Edit</button>
          <button 
            className="delete-button" 
            onClick={handleDelete}
            disabled={advertisement.status === 'Active' && advertisement.submissions > 0}
          >
            Delete
          </button>
          <button className="view-submission-button" onClick={handleViewSubmissions}>View Submissions</button>
        </div>
      </div>

      {showEditPopup && (
        <div className="edit-popup">
          {renderEditForm}
        </div>
      )}

      {isThumbnailModalOpen && (
        <div className="modal" onClick={() => setThumbnailModalOpen(false)}>
          <div className="modal-content">
            <span className="close-button" onClick={() => setThumbnailModalOpen(false)}>&times;</span>
            <img src={thumbnailPreview} alt="Full-size thumbnail" className="full-size-thumbnail" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvDetails;