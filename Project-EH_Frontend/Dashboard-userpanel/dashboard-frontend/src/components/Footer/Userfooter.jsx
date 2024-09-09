import React from 'react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const FooterWrapper = styled.footer`
  background: linear-gradient(45deg, #2c3e50, #34495e);
  color: white;
  padding: 0 10px ;
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px; // Reduced height
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  

  @media (max-width: 768px) {
    height: auto;
    padding: 10px 20px;
    flex-direction: column;
    justify-content: center;
  }
`;

const CompanyName = styled(Typography)`
  font-weight: bold;
  font-size: 1.1rem; // Reduced font size

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 5px;
  }
`;

const Copyright = styled(Typography)`
  font-size: 0.8rem; // Reduced font size
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin: 5px 0;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  align-items: center;

  a {
    color: white;
    margin-left: 15px;
    font-size: 1.2rem; // Reduced icon size
    transition: color 0.3s ease;

    &:hover {
      color: #3498db;
    }
  }

  @media (max-width: 768px) {
    margin-top: 5px;
    a {
      font-size: 1rem;
      margin: 0 8px;
    }
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <CompanyName variant="h6">Your Company Name</CompanyName>
      <Copyright variant="body2">
        © {currentYear} All Rights Reserved
      </Copyright>
      <SocialIcons>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <FaFacebook />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <FaTwitter />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram />
        </a>
      </SocialIcons>
    </FooterWrapper>
  );
};

export default Footer;