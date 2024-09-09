// Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaWallet,
  FaAd,
  FaMoneyBillWave,
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaTimes
} from 'react-icons/fa';
import LogoutConfirmationDialog from '../LogoutConfirmationDialog/LogoutConfirmationDialog ';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, setTitle }) => {
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'visible';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isOpen]);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentLink = sidebarLinks.find(link => link.path === currentPath);
    if (currentLink) {
      setTitle(currentLink.title);
    }
  }, [location, setTitle]);

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

  const handleNavClick = (title, path) => {
    setTitle(title);
    toggleSidebar();
    navigate(path);
  };

  const sidebarLinks = [
    { title: 'Home', path: '/dashboard', icon: FaHome },
    { title: 'Wallet', path: '/dashboard/wallet', icon: FaWallet },
    { title: 'Advertise', path: '/dashboard/advertise', icon: FaAd },
    { title: 'Earn', path: '/dashboard/earn', icon: FaMoneyBillWave },
    { title: 'Profile', path: '/dashboard/profile', icon: FaUser },
    { title: 'Category', path: '/dashboard/adcategory', icon: FaClipboardList },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
      <div className={`sideNavBar ${isOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={toggleSidebar}>
          <FaTimes />
        </button>
        <div className="sidebar">
          <ul>
            {sidebarLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path} onClick={() => handleNavClick(link.title, link.path)}>
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
        </div>
      </div>
      <LogoutConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
};

export default Sidebar;