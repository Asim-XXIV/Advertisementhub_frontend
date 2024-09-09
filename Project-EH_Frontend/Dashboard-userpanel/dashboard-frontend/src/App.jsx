import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import Wallet from './components/Wallet/Wallet';
import Advertise from './components/Advertise/Advertise';
import Earn from './components/Earn/Earn';
import Profile from './components/Profile/Profile';
import Logout from './components/Logout/Logout';
import Header from './components/Header/Header';
import Footer from './components/LandingPage/Footer';
import AsideAdContent from './components/AsideAdContent/AsideAdContent';
import Create from './components/Advertise/Create';
import AdCategory from './components/AdCategory/AdCategory';
import AdvertisementDetails from './components/AdvertisementDetails/AdvertisementDetails';
import AdvDetails from './components/Advertise/AdvDetails';
import Submissions from './components/Advertise/Submissions';
import AdDetails from './components/AsideAdContent/AdDetails'
import SubmitProof from './components/Earn/SubmitProof';
import Navbar from './components/LandingPage/Navbar';
import Home from './components/LandingPage/Home';
import Details from './components/LandingPage/Details';
import Features from './components/LandingPage/Features';
import Contact from './components/LandingPage/Contact';
import LoginPopup from './components/LandingPage/LoginPopup';
import RegisterPage from './components/LandingPage/RegisterPage';
import ForgotPasswordPopup from './components/LandingPage/ForgotPasswordPopup';
import Userfooter from './components/Footer/Userfooter';

import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

library.add(faFilter);

import './App.css';
import { Category } from '@mui/icons-material';

const ProtectedRoute = ({ element: Element }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('access_token');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Element /> : null;
};

const App = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [title, setTitle] = useState('Home');

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access_token = params.get('access_token');
    const user_id = params.get('user_id');
    const username = params.get('username');

    if (access_token && user_id && username) {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('username', username);

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <Navbar />
              <div id="home"><Home /></div>
              <div id="details"><Details /></div>
              <div id="features"><Features /></div>
              <div id="contact"><Contact /></div>
              <Footer />
            </div>
          }
        />
        <Route path="/login" element={<LoginPopup />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPopup onClose={handleCloseForgotPassword} />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute
              element={() => (
                <div className="main-Container">
                  <div className="main-Inner-Container">
                    <Header 
                      toggleSidebar={toggleSidebar} 
                      title={title} 
                      setIsSidebarOpen={setIsSidebarOpen}
                    />
                    <Sidebar 
                      isOpen={isSidebarOpen} 
                      setTitle={setTitle}
                      setIsSidebarOpen={setIsSidebarOpen}
                    />
                    <div className="app">
                      <div className="content">
                        <div className="routes-container">
                          <div className="inner-Route-container">
                            <Routes>
                              <Route path="/" element={<Dashboard />} />
                              <Route path="wallet" element={<Wallet />} />
                              <Route path="advertise" element={<Advertise />} />
                              <Route path="earn" element={<Earn />} />
                              <Route path="profile" element={<Profile />} />
                              <Route path="logout" element={<Logout />} />
                              <Route path="adcategory" element={<AdCategory/>} />
                              <Route path="create" element={<Create />} />
                              <Route path="advertisement/:id" element={<AdvertisementDetails />} />
                              <Route path="details/:id" element={<AdvDetails />} />
                              <Route path="advertisements/:id/submissions" element={<Submissions />} />
                              <Route path="admin_ads/:id" element={<AdDetails />} />
                              <Route path="submit-proof/:jobId" element={<SubmitProof />} />
                    
                            </Routes>
                          </div>
                        </div>
                        <div className="aside-content-for-ad">
                          <div className="aside-content-inner-container">
                            <AsideAdContent />
                          </div>
                        </div>
                      </div>
                      <div className="for-Footer" >
                        <Userfooter />
                      </div>
                    </div>
                  </div> 
                </div>
              )}  
            />
          }
        />
      </Routes>
      {showForgotPassword && <ForgotPasswordPopup onClose={handleCloseForgotPassword} />}
    </Router>
  );
};

export default App;
