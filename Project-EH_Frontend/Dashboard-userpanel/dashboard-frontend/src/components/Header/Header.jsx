import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaBell, FaTimes, FaHome, FaWallet, FaAd, FaMoneyBillWave, FaUser, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';
import NotificationDialog from './NotificationDialog';
import LogoutConfirmationDialog from '../LogoutConfirmationDialog/LogoutConfirmationDialog ';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({
        fullName: '',
        profilePicture: ''
    });
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

    useEffect(() => {
        fetchUserDetails();
        fetchNotifications();
    }, []);

    useEffect(() => {
        document.body.style.overflow = isSidebarOpen ? 'hidden' : 'visible';
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [isSidebarOpen]);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://localhost:8000/api/profile/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { first_name, last_name, photo } = response.data;
            setUser({
                fullName: `${first_name} ${last_name}`,
                profilePicture: photo || 'https://via.placeholder.com/40'
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://localhost:8000/api/notifications/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedNotifications = response.data;
            setNotifications(fetchedNotifications);
            const unreadCount = fetchedNotifications.filter(notification => !notification.is_read).length;
            setNotificationCount(unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleProfileClick = () => {
        navigate('/dashboard/profile');
        setIsSidebarOpen(false);
    };

    const toggleNotifications = () => {
        setShowNotifications(prevState => !prevState);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogoutClick = (e) => {
        e.preventDefault();
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = () => {
        localStorage.clear();
        setLogoutDialogOpen(false);
        navigate('/');
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Home';
        if (path === '/dashboard/profile') return 'Profile';
        if (path === '/dashboard/wallet') return 'Wallet';
        if (path === '/dashboard/advertise') return 'Advertise';
        if (path === '/dashboard/earn') return 'Earn';
        if (path === '/dashboard/adcategory') return 'Category';
    };

    const sidebarLinks = [
        { title: 'Home', path: '/dashboard', icon: FaHome },
        { title: 'Wallet', path: '/dashboard/wallet', icon: FaWallet },
        { title: 'Advertise', path: '/dashboard/advertise', icon: FaAd },
        { title: 'Earn', path: '/dashboard/earn', icon: FaMoneyBillWave },
        { title: 'Profile', path: '/dashboard/profile', icon: FaUser },
        { title: 'Category', path: '/dashboard/adcategory', icon: FaClipboardList },
    ];

    const handleNotificationChange = (unreadCount) => {
        setNotificationCount(unreadCount);
    };

    return (
        <>
            <header className="header">
                <div className="header-container">
                    <div className="header-left">
                        <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                            <FaBars />
                        </button>
                        <h1 className="header-title">{getPageTitle()}</h1>
                    </div>
                    <div className="header-right">
                        <div className="notification-wrapper">
                            <button className="notification-btn" onClick={toggleNotifications} aria-label="Notifications">
                                <FaBell />
                                {notificationCount > 0 && (
                                    <span className="notification-badge">{notificationCount}</span>
                                )}
                            </button>
                        </div>
                        <div className="profile-wrapper">
                            <button className="profile-btn" onClick={handleProfileClick} aria-label="User Profile">
                                <span className="user-name">{user.fullName}</span>
                                <img src={user.profilePicture} alt="Profile" className="profile-avatar1" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <div className={`sideNavBar ${isSidebarOpen ? 'open' : ''}`}>
                <button className="close-sidebar" onClick={toggleSidebar}>
                    <FaTimes />
                </button>
                <nav className="sidebar">
                    <ul>
                        {sidebarLinks.map((link, index) => (
                            <li key={index}>
                                <Link to={link.path} onClick={toggleSidebar}>
                                    <link.icon className="sidebar-icon" />
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link to="/dashboard/logout" onClick={handleLogoutClick}>
                                <FaSignOutAlt className="sidebar-icon" />
                                Logout
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
            <NotificationDialog
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                onNotificationChange={handleNotificationChange}
            />
            <LogoutConfirmationDialog
                isOpen={isLogoutDialogOpen}
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />
        </>
    );
};

export default Header;
