import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faAd, faChartLine, faUsers, faRocket, faShieldAlt, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const SectionWrapper = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem 0;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled(motion.h1)`
  text-align: center;
  color: #ffffff;
  font-size: 3rem;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled(FontAwesomeIcon)`
  font-size: 3rem;
  color: #FFC107;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h2`
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const FeatureContent = styled.p`
  font-size: 1.1rem;
  color: #e0e0e0;
  margin-bottom: 1rem;
`;

const FeatureDetails = styled(motion.div)`
  margin-top: 1rem;
`;

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FeatureListItem = styled(motion.li)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #e0e0e0;
`;

const CheckIcon = styled(FontAwesomeIcon)`
  color: #4CAF50;
  margin-right: 0.5rem;
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

const features = [
  {
    id: 'earn',
    title: 'Earn Money',
    icon: faDollarSign,
    content: 'Unlock multiple revenue streams through our platform:',
    details: [
      'Complete engaging tasks and surveys',
      'Earn bonuses through our referral program',
      'Watch curated ads and promotional content',
      'Create and sell digital content'
    ]
  },
  {
    id: 'advertise',
    title: 'Create Ads',
    icon: faAd,
    content: 'Launch your ad campaigns with ease:',
    details: [
      'Use our intuitive ad builder',
      'Define your ideal audience',
      'Set your spending limits',
      'Track performance and optimize in real-time'
    ]
  },
  {
    id: 'analytics',
    title: 'Powerful Analytics',
    icon: faChartLine,
    content: 'Gain insights into your performance:',
    details: [
      'Real-time data on your earnings',
      'In-depth audience demographics',
      'Campaign performance metrics',
      'Customizable reports and dashboards'
    ]
  },
  {
    id: 'targeting',
    title: 'Audience Targeting',
    icon: faUsers,
    content: 'Reach the right people at the right time:',
    details: [
      'Advanced audience segmentation',
      'Behavioral targeting options',
      'Geolocation-based advertising',
      'Interest and affinity targeting'
    ]
  },
  {
    id: 'automation',
    title: 'Smart Automation',
    icon: faRocket,
    content: 'Streamline your advertising efforts:',
    details: [
      'Automated bid management',
      'AI-powered ad optimization',
      'Scheduled content publishing',
      'Automated performance reports'
    ]
  },
  {
    id: 'security',
    title: 'Advanced Security',
    icon: faShieldAlt,
    content: 'Protect your data and earnings:',
    details: [
      'End-to-end encryption',
      'Two-factor authentication',
      'Regular security audits',
      'Fraud detection and prevention'
    ]
  }
];

const Features = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <SectionWrapper id="features">
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Powerful Features
        </SectionTitle>
        <FeaturesGrid>
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              onClick={() => handleCardClick(feature.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FeatureIcon icon={feature.icon} />
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureContent>{feature.content}</FeatureContent>
              <AnimatePresence>
                {expandedCard === feature.id && (
                  <FeatureDetails
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FeatureList>
                      {feature.details.map((detail, index) => (
                        <FeatureListItem
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CheckIcon icon="check-circle" />
                          {detail}
                        </FeatureListItem>
                      ))}
                    </FeatureList>
                  </FeatureDetails>
                )}
              </AnimatePresence>
              <ExpandButton>
                {expandedCard === feature.id ? (
                  <>
                    Hide Details <FontAwesomeIcon icon={faChevronUp} style={{ marginLeft: '0.5rem' }} />
                  </>
                ) : (
                  <>
                    Show Details <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '0.5rem' }} />
                  </>
                )}
              </ExpandButton>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Container>
    </SectionWrapper>
  );
};

export default Features;