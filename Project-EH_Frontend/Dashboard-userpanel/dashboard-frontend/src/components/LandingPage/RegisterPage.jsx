import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import axios from 'axios';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    reEnterPassword: '',
    referralCode: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (formData.password !== formData.reEnterPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false); // Allow resubmission if error
      return;
    }

    const userData = {
      username: formData.userName,
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      referral_code: formData.referralCode,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/register/', userData);
      setSuccess(response.data.detail);
      setError('');
      setOtpModalOpen(true);  // Open OTP modal after successful registration
    } catch (error) {
      setError('Registration failed. Please try again.');
      setSuccess('');
    } finally {
      setIsSubmitting(false); // Re-enable submission after handling the response
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      const response = await axios.post('http://localhost:8000/api/verify-otp/', {
        email: formData.email,
        otp: otp,
      });
      setSuccess(response.data.detail);
      setError('');
      setOtpModalOpen(false);

      localStorage.setItem('email', formData.email);
      localStorage.setItem('password', formData.password);

      navigate('/login');
    } catch (error) {
      setError('OTP verification failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="register-page">
      <div className="register-content">
        <h1 className="company-name">Your Company Name</h1>
        <p className="enter-details">Enter your details to create an account</p>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaUserTag className="input-icon" />
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="reEnterPassword"
              placeholder="Re-enter Password"
              value={formData.reEnterPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <FaUserTag className="input-icon" />
            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code (optional)"
              value={formData.referralCode}
              onChange={handleChange}
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" disabled={isSubmitting}>Create an Account</button>
        </form>
        <div className="alternative-login">
          <p>OR</p>
          <button className="google-login">
            <FaGoogle /> Signup with Google
          </button>
        </div>
        <p className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      {otpModalOpen && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <h2>Verify OTP</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const otpValue = e.target.elements.otp.value;
              handleVerifyOTP(otpValue);
            }}>
              <div className="input-container">
                <FaLock className="input-icon" />
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <div className="otp-buttons">
                <button type="submit" className="verify-button">VERIFY OTP</button>
                <button type="button" className="close-button" onClick={() => setOtpModalOpen(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
