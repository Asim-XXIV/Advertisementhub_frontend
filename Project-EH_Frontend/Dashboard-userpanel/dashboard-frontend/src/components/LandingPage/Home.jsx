import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAd, faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BackgroundShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Shape = styled.div`
  position: absolute;
  opacity: 0.1;
  animation: ${float} 6s ease-in-out infinite;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 300px;
  padding-right: 2rem;
  margin-bottom: 2rem;
`;

const ImageWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FeaturedImage = styled(motion.img)`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #ffffff;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #e0e0e0;
`;

const CTAButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #FFC107;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #FFD54F;
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.div`
  margin-top: 4rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureIcon = styled(FontAwesomeIcon)`
  font-size: 3rem;
  color: #FFC107;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #e0e0e0;
`;

const Home = () => {
  return (
    <Section id="home">
      <BackgroundShapes>
        <Shape style={{ top: '10%', left: '5%' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="50" fill="white" />
          </svg>
        </Shape>
        <Shape style={{ top: '60%', right: '10%' }}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect width="120" height="120" fill="white" />
          </svg>
        </Shape>
        <Shape style={{ bottom: '10%', left: '15%' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <polygon points="40,0 80,80 0,80" fill="white" />
          </svg>
        </Shape>
      </BackgroundShapes>
      <Container>
        <ContentWrapper>
          <MainContent>
            <Title
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Maximize Your Ad Revenue
            </Title>
            <Subtitle
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Turn your social media presence into a profitable venture. Our platform connects you with top advertisers to monetize your content effectively.
            </Subtitle>
            <CTAButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Earning Now
            </CTAButton>
          </MainContent>
          <ImageWrapper>
            <FeaturedImage
              src="https://source.unsplash.com/random/600x400/?social-media"
              alt="Social Media Advertising"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </ImageWrapper>
        </ContentWrapper>
        <FeaturesSection>
          <FeaturesGrid>
            {[
              { icon: faAd, title: 'Premium Ads', description: 'Access high-quality, relevant advertisements for your audience.' },
              { icon: faChartLine, title: 'Analytics', description: 'Detailed insights to optimize your ad performance and earnings.' },
              { icon: faUsers, title: 'Audience Targeting', description: 'Connect with advertisers that match your audience demographics.' },
            ].map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FeatureIcon icon={feature.icon} />
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesSection>
      </Container>
    </Section>
  );
};

export default Home;