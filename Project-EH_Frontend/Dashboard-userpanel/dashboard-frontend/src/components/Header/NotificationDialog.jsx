import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaInfoCircle, FaTimes, FaCheck, FaBell } from 'react-icons/fa';
import './NotificationDialog.css';

const NotificationDialog = ({ isOpen, onClose, onNotificationChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const notificationsPerPage = 10;

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1, true); // Fetch the first page when the dialog opens
    }
  }, [isOpen]);

  // Fetch paginated notifications
  const fetchNotifications = useCallback(async (page = 1, reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in again.');
      }

      const response = await axios.get(
        `http://localhost:8000/api/notifications/?page=${page}&page_size=${notificationsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = response.data.results || response.data;
      setHasMore(data.length === notificationsPerPage);
      if (reset) {
        setNotifications(data); // Reset the notifications on a new fetch
      } else {
        setNotifications((prevNotifications) => [...prevNotifications, ...data]); // Append to previous
      }
      setCurrentPage(page);
      setNextPageUrl(response.data.next || null); // Track the next page URL
      updateNotificationCount(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.response?.data?.detail || error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Load more notifications (pagination)
  const loadMoreNotifications = () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      fetchNotifications(currentPage + 1); // Load next page
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in again.');
      }

      const response = await axios.post(
        'http://localhost:8000/api/notifications/mark_all_as_read/',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        // Update all notifications in state to mark as read
        const updatedNotifications = notifications.map(notification => ({
          ...notification,
          is_read: true
        }));
        setNotifications(updatedNotifications);
        updateNotificationCount(updatedNotifications); // Update unread count
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setError(`Failed to mark all notifications as read. ${error.message}`);
    }
  };

  // Update unread notification count
  const updateNotificationCount = useCallback((notificationsList) => {
    const unreadCount = notificationsList.filter(notification => !notification.is_read).length;
    if (typeof onNotificationChange === 'function') {
      onNotificationChange(unreadCount);
    }
  }, [onNotificationChange]);

  if (!isOpen) return null;

  return (
    <div className="notification-dialog-overlay" onClick={onClose}>
      <div className="notification-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="notification-dialog-header">
          <h2 className="notification-title">
            <FaBell className="notification-icon" aria-hidden="true" />
            Notifications
          </h2>
          <div className="close-button-container">
            <button className="close-button" onClick={onClose} aria-label="Close notifications">
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="notification-dialog-content">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              {notifications.length > 0 ? (
                <>
                  {/* Mark All as Read Button */}
                  <button
                    className="bg-purple-600 text-white px-3 py-2 rounded-lg flex items-center hover:bg-purple-700 transition duration-300 mb-4"
                    onClick={markAllAsRead}
                  >
                    <FaCheck className="mr-2" /> Mark All as Read
                  </button>

                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                    >
                      <div className="notification-icon-wrapper">
                        <FaInfoCircle className="icon info" />
                      </div>
                      <div className="notification-content">
                        <div className="notification-message">{notification.message || 'No message provided'}</div>
                        <div className="notification-time">
                          {new Date(notification.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {hasMore && (
                    <div className="mt-4 text-center">
                      <button
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                        onClick={loadMoreNotifications}
                      >
                        {loadingMore ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-notifications">
                  <FaInfoCircle className="icon large" />
                  <p>No notifications yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDialog;
