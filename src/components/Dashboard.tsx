import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f1419 70%, #0a0a0f 100%);
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const WelcomeTitle = styled.h1`
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
`;

const WelcomeSubtitle = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
`;

const WelcomeDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  line-height: 1.6;
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 800px;
  width: 100%;
`;

const GameCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(0, 255, 136, 0.3);
    transform: translateY(-5px);
  }
`;

const GameIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const GameTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 15px;
`;

const GameDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin-bottom: 20px;
`;

const PlayButton = styled(Link)`
  display: inline-block;
  padding: 12px 30px;
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  color: #000000;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
    text-decoration: none;
    color: #000000;
  }
`;

const StatsSection = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 60px;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #00ff88;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const Dashboard: React.FC = () => {
  const games = [
    {
      id: 'lucky-jet',
      title: 'Lucky Jet',
      icon: '✈️',
      description: 'Pilotez votre avion et encaissez vos gains avant qu\'il ne s\'écrase ! Un jeu de timing et de prise de risque.',
      path: '/lucky-jet'
    },
    {
      id: 'dice',
      title: 'Dice Game',
      icon: '🎲',
      description: 'Lancez les dés et devinez le résultat. Un classique revisité avec des graphismes modernes.',
      path: '/dice'
    },

  ];

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Bienvenue sur 4WIN</WelcomeTitle>
        <WelcomeSubtitle>Votre plateforme de jeux de casino en ligne</WelcomeSubtitle>
        <WelcomeDescription>
          Découvrez notre collection de jeux passionnants. Chaque jeu offre une expérience unique 
          avec des graphismes modernes et des mécaniques de jeu innovantes.
        </WelcomeDescription>
      </WelcomeSection>

      <GamesGrid>
        {games.map((game) => (
          <GameCard
            key={game.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <GameIcon>{game.icon}</GameIcon>
            <GameTitle>{game.title}</GameTitle>
            <GameDescription>{game.description}</GameDescription>
            <PlayButton to={game.path}>Jouer Maintenant</PlayButton>
          </GameCard>
        ))}
      </GamesGrid>

      <StatsSection>
        <StatCard>
          <StatNumber>2</StatNumber>
          <StatLabel>Jeux Disponibles</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>100%</StatNumber>
          <StatLabel>Fair Play</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>24/7</StatNumber>
          <StatLabel>Support</StatLabel>
        </StatCard>
      </StatsSection>
      <StatsSection>
        <StatCard>
          <StatNumber>2</StatNumber>
          <StatLabel>Jeux Disponibles</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>100%</StatNumber>
          <StatLabel>Fair Play</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>24/7</StatNumber>
          <StatLabel>Support</StatLabel>
        </StatCard>
      </StatsSection>
    </DashboardContainer>
  );
};

export default Dashboard;

