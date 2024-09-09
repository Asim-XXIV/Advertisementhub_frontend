import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-between h-full">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Your Company Name</h2>
          <p className="text-gray-400 text-lg">Providing quality services since 2024</p>
        </div>
        
        <div className="flex space-x-8 mb-8">
          {[
            { icon: faFacebookF, url: '#', label: 'Facebook' },
            { icon: faTwitter, url: '#', label: 'Twitter' },
            { icon: faInstagram, url: '#', label: 'Instagram' },
            { icon: faLinkedinIn, url: '#', label: 'LinkedIn' },
          ].map((social, index) => (
            <a
            
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition-colors duration-300"
              aria-label={social.label}
            >
              <FontAwesomeIcon icon={social.icon} size="2x" />
            </a>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">&copy; 2024 Your Company Name. All rights reserved.</p>
          <p className="text-xs text-gray-500">
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a> | 
            <a href="#" className="hover:text-blue-400 transition-colors duration-300 ml-2">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;