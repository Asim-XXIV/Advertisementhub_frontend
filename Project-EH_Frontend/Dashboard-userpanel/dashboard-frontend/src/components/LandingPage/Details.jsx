import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faBullseye, faChartLine, faShieldAlt, faRocket, faUsers } from '@fortawesome/free-solid-svg-icons';

const SectionWrapper = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 3rem;
`;

const DetailsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const DetailItem = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const DetailIcon = styled(FontAwesomeIcon)`
  font-size: 2.5rem;
  color: #FFC107;
  margin-bottom: 1rem;
`;

const DetailTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const DetailDescription = styled.p`
  font-size: 1rem;
  color: #e0e0e0;
  margin-bottom: 1rem;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #FFC107;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ExpandedContent = styled(motion.div)`
  margin-top: 1rem;
`;

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FeatureItem = styled(motion.li)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #e0e0e0;
`;

const CheckIcon = styled(FontAwesomeIcon)`
  color: #4CAF50;
  margin-right: 0.5rem;
`;

const ProgressBar = styled(motion.div)`
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  margin-top: 1rem;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background-color: #4CAF50;
`;

const details = [
  {
    id: 'earn',
    title: 'Maximize Earnings',
    icon: faMoneyBillWave,
    description: 'Unlock multiple revenue streams and boost your income.',
    features: [
      'High-paying sponsored content opportunities',
      'Tiered commission structure for referrals',
      'Performance-based bonuses and rewards',
      'Exclusive brand partnership programs'
    ]
  },
  {
    id: 'target',
    title: 'Precision Targeting',
    icon: faBullseye,
    description: 'Reach your ideal audience with laser-focused precision.',
    features: [
      'Advanced demographic targeting options',
      'Behavior-based audience segmentation',
      'Geolocation and time-based targeting',
      'Interest and affinity-based matching'
    ]
  },
  {
    id: 'analytics',
    title: 'In-Depth Analytics',
    icon: faChartLine,
    description: 'Gain valuable insights to optimize your performance.',
    features: [
      'Real-time performance dashboards',
      'Customizable reporting tools',
      'A/B testing for campaign optimization',
      'Predictive analytics for trend forecasting'
    ]
  },
  {
    id: 'security',
    title: 'Robust Security',
    icon: faShieldAlt,
    description: 'Protect your data and earnings with advanced security measures.',
    features: [
      'End-to-end encryption for all transactions',
      'Two-factor authentication (2FA)',
      'Regular security audits and penetration testing',
      'Compliance with global data protection regulations'
    ]
  },
  {
    id: 'automation',
    title: 'Smart Automation',
    icon: faRocket,
    description: 'Streamline your workflow with intelligent automation tools.',
    features: [
      'AI-powered content scheduling and posting',
      'Automated bid management for advertisers',
      'Smart contract generation and management',
      'Automated performance reports and insights'
    ]
  },
  {
    id: 'community',
    title: 'Vibrant Community',
    icon: faUsers,
    description: 'Join a thriving network of creators and advertisers.',
    features: [
      'Exclusive networking events and webinars',
      'Collaborative opportunities with peers',
      'Access to industry experts and mentors',
      'Community-driven feature development'
    ]
  }
];

const Details = () => {
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <SectionWrapper id="details">
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Unlock Your Potential
        </SectionTitle>
        <DetailsList>
          {details.map((detail) => (
            <DetailItem
              key={detail.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <DetailIcon icon={detail.icon} />
              <DetailTitle>{detail.title}</DetailTitle>
              <DetailDescription>{detail.description}</DetailDescription>
              <ExpandButton onClick={() => toggleExpand(detail.id)}>
                {expandedItem === detail.id ? 'Show Less' : 'Learn More'}
              </ExpandButton>
              <AnimatePresence>
                {expandedItem === detail.id && (
                  <ExpandedContent
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FeatureList>
                      {detail.features.map((feature, index) => (
                        <FeatureItem
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CheckIcon icon="check-circle" />
                          {feature}
                        </FeatureItem>
                      ))}
                    </FeatureList>
                    <ProgressBar>
                      <ProgressFill
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                    </ProgressBar>
                  </ExpandedContent>
                )}
              </AnimatePresence>
            </DetailItem>
          ))}
        </DetailsList>
      </Container>
    </SectionWrapper>
  );
};

export default Details;
Details.jsx