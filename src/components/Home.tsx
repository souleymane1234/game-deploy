import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 30%, #1e293b 70%, #0f172a 100%);
  overflow-x: hidden;
  position: relative; 
`;

const Header = styled.header`
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #334155;
`;

const HeaderContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const FreeMoney = styled.div`
  background: #facc15;
  color: black;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const Navigation = styled.nav`
  display: none;
  align-items: center;
  gap: 0.25rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavButton = styled.button<{ active?: boolean; highlight?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;

  ${props => {
    if (props.active) {
      return `
        background: #2563eb;
        color: white;
      `;
    } else if (props.highlight) {
      return `
        background: linear-gradient(90deg, #ec4899, #9333ea);
        color: white;
      `;
    } else {
      return `
        background: transparent;
        color: #d1d5db;
        
        &:hover {
          color: white;
          background: #374151;
        }
      `;
    }
  }}
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LoginButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #60a5fa;
  }
`;

const SignupButton = styled.button`
  background: #22c55e;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #16a34a;
  }
`;

const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const HeroSection = styled.div`
  position: relative;
  background: linear-gradient(90deg, #1e293b, #374151);
  border-radius: 1rem;
  overflow: hidden;
  height: 20rem;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.5), transparent);
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroContent = styled.div`
  position: absolute;
  inset: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroButton = styled.button`
  background: white;
  color: black;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  width: fit-content;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const PromotionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PromotionCard = styled.div<{ gradient?: string }>`
  background: ${props => props.gradient || 'linear-gradient(135deg, #7c3aed, #ec4899)'};
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
`;

const PromotionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const PromotionSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
`;

const PromotionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 2.5rem;
`;

const PromotionButton = styled.button<{ textColor?: string }>`
  background: white;
  color: ${props => props.textColor || '#7c3aed'};
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CategoryCard = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #334155;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(51, 65, 85, 0.5);
  }
`;

const CategoryIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: ${props => props.color || '#eab308'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

const CategorySubtitle = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
`;

const GamesSection = styled.div`
  margin-top: 3rem;
`;

const GamesSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const GamesHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const GamesLogo = styled.div`
  width: 2rem;
  height: 2rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GamesLogoText = styled.span`
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
`;

const GamesTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const ViewAllButton = styled.button`
  color: #60a5fa;
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #93c5fd;
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const GameCard = styled.div`
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const GameCardContent = styled.div<{ gradient?: string }>`
  background: ${props => props.gradient || 'linear-gradient(135deg, #3b82f6, #1e40af)'};
  border-radius: 1.5rem;
  padding: 0;
  height: 14rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const GameIcon = styled.div`
  font-size: 4.5rem;
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
`;

const GameInfo = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
`;

const GameProvider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ProviderLogo = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: bold;
  color: #1e40af;
`;

const ProviderText = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const GameTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
`;

const GameHoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${GameCard}:hover & {
    opacity: 1;
  }
`;

const GamePlayButton = styled.button`
  background: rgba(255, 255, 255, 0.95);
  color: #1e40af;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transform: translateY(10px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  ${GameCard}:hover & {
    transform: translateY(0);
  }

  &:hover {
    background: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PokerSection = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PokerCard = styled.div<{ relative?: boolean; overflow?: boolean }>`
  background: rgba(30, 41, 59, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #334155;
  position: ${props => props.relative ? 'relative' : 'static'};
  overflow: ${props => props.overflow ? 'hidden' : 'visible'};
`;

const PokerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const PokerLogo = styled.div`
  width: 2rem;
  height: 2rem;
  background: #7c3aed;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PokerLogoText = styled.span`
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
`;

const PokerTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
`;

const PokerDescription = styled.p`
  color: #9ca3af;
  margin-bottom: 1.5rem;
`;

const PokerButton = styled.button`
  background: #7c3aed;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #6d28d9;
  }
`;

const CardsContainer = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const PlayingCard = styled.div<{ red?: boolean }>`
  width: 4rem;
  height: 5rem;
  background: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${props => props.red ? '#ef4444' : 'black'};
`;

const Badge247 = styled.div`
  background: #2563eb;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 0.5rem;
`;

// Helper function for category colors
function getCategoryColor(color: keyof typeof colors) {
  const colors = {
    'bg-yellow-500': '#eab308',
    'bg-red-500': '#ef4444',
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#22c55e'
  };
  return colors[color] || '#3b82f6';
}

const Home = () => {
  const [activeTab, setActiveTab] = useState('accueil');

  const navigationItems = [
    { id: 'accueil', label: 'Accueil', active: true },
    { id: 'sport', label: 'Sport' },
    { id: 'casino', label: 'Casino' },
    { id: 'live-games', label: 'Live-games' },
    { id: 'lucky-jet', label: 'LuckyJet', highlight: true },
  ];

  const games = [
    {
      id: 'coinflip',
      title: 'Lucky Jet',
      icon: '✈️',
      gradient: 'linear-gradient(135deg, #00d4ff, #0099cc)',
      description: 'Pile ou face ? Misez sur votre intuition et doublez vos gains !',
      provider: '1win Games',
      path: '/lucky-jet'
    },
    {
      id: 'dice',
      title: 'Dice Game',
      icon: '🎲',
      gradient: 'linear-gradient(135deg, #4ade80, #22c55e)',
      description: 'Regardez le multiplicateur monter et encaissez avant le crash !',
      provider: '1win Games',
      path: '/dice'
    },
    // {
    //   id: 'dice',
    //   title: 'DICE',
    //   icon: '🎲',
    //   gradient: 'linear-gradient(135deg, #4ade80, #22c55e)',
    //   description: 'Lancez les dés et devinez le résultat. Un classique revisité avec des graphismes modernes.',
    //   provider: '1win Games'
    // },
    // {
    //   id: 'hilo',
    //   title: 'HILO',
    //   icon: '🃏',
    //   gradient: 'linear-gradient(135deg, #e879f9, #c084fc)',
    //   description: 'Plus haut ou plus bas ? Testez votre chance avec les cartes !',
    //   provider: '1win Games'
    // },
  ];

  const categories: { id: string; title: string; subtitle: string; icon: string; color: 'bg-yellow-500' | 'bg-red-500' | 'bg-blue-500' | 'bg-green-500' }[] = [
    { id: 'tvbet', title: 'TVBET', subtitle: 'Jeux en direct 24/7', icon: '📺', color: 'bg-yellow-500' },
    { id: 'casino', title: 'Casino', subtitle: 'Plus de 3000 jeux', icon: '🎰', color: 'bg-red-500' },
    { id: 'live-games', title: 'Live-Games', subtitle: 'Revendeurs vivants', icon: '🎮', color: 'bg-blue-500' },
    { id: 'poker', title: 'Poker', subtitle: 'Tournois gratuits', icon: '🂡', color: 'bg-green-500' }
  ];

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderContainer>
          <HeaderContent>
            {/* Logo */}
            <LogoSection>
              <Logo>1win</Logo>
              <FreeMoney>Free Money!</FreeMoney>
            </LogoSection>

            {/* Navigation */}
            <Navigation>
              {navigationItems.map((item) => (
                <NavButton
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  active={item.active || activeTab === item.id}
                  highlight={item.highlight}
                >
                  {item.label}
                </NavButton>
              ))}
            </Navigation>

            {/* Right side buttons */}
            <AuthSection>
              <LoginButton>Connexion</LoginButton>
              <SignupButton>+ Inscription</SignupButton>
            </AuthSection>
          </HeaderContent>
        </HeaderContainer>
      </Header>

      {/* Main Content */}
      <Main>
        <HeroGrid>
          {/* Hero Section */}
          <HeroSection>
            <HeroOverlay />
            <HeroImage 
              src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=400&fit=crop&crop=center"
              alt="Ferrari"
            />
            <HeroContent>
              <HeroTitle>
                Ferrari 296 GTB,<br />
                produits Apple et FS<br />
                dans LUCKY DRIVE
              </HeroTitle>
              <HeroButton>Participer</HeroButton>
            </HeroContent>
          </HeroSection>

          {/* Promotions */}
          <PromotionsSection>
            <PromotionCard gradient="linear-gradient(135deg, #7c3aed, #ec4899)">
              <PromotionTitle>Remboursement jusqu'à 30%</PromotionTitle>
              <PromotionSubtitle>sur les casinos</PromotionSubtitle>
              <PromotionIcon>🎰</PromotionIcon>
              <PromotionButton textColor="#7c3aed">Aller au casino</PromotionButton>
            </PromotionCard>

            <PromotionCard gradient="linear-gradient(135deg, #3b82f6, #7c3aed)">
              <PromotionTitle>Bonus +500%</PromotionTitle>
              <PromotionIcon>🎁</PromotionIcon>
              <PromotionButton textColor="#3b82f6">Inscription</PromotionButton>
            </PromotionCard>
          </PromotionsSection>
        </HeroGrid>

        {/* Categories */}
        <CategoriesGrid>
          {categories.map((category) => (
            <CategoryCard key={category.id}>
              <CategoryIcon color={getCategoryColor(category.color)}>
                {category.icon}
              </CategoryIcon>
              <CategoryTitle>{category.title}</CategoryTitle>
              <CategorySubtitle>{category.subtitle}</CategorySubtitle>
            </CategoryCard>
          ))}
        </CategoriesGrid>

        {/* Games Section */}
        <GamesSection>
          <GamesSectionHeader>
            <GamesHeaderLeft>
              <GamesLogo>
                <GamesLogoText>1W</GamesLogoText>
              </GamesLogo>
              <GamesTitle>1win games</GamesTitle>
            </GamesHeaderLeft>
            <ViewAllButton>Tout</ViewAllButton>
          </GamesSectionHeader>

          <GamesGrid>
            {games.map((game) => (
              <GameCard key={game.id}>
                <GameCardContent gradient={game.gradient}>
                  <GameIcon>{game.icon}</GameIcon>
                  <GameInfo>
                    <GameProvider>
                      <ProviderLogo>1W</ProviderLogo>
                      <ProviderText>{game.provider}</ProviderText>
                    </GameProvider>
                    <GameTitle>{game.title}</GameTitle>
                  </GameInfo>
                  <GameHoverOverlay>
                    <GamePlayButton onClick={() => window.location.href = game.path}>
                      Jouer
                    </GamePlayButton>
                  </GameHoverOverlay>
                </GameCardContent>
              </GameCard>
            ))}
          </GamesGrid>
        </GamesSection>

        {/* Poker Section */}
        <PokerSection>
          <PokerCard>
            <PokerHeader>
              <PokerLogo>
                <PokerLogoText>PJ</PokerLogoText>
              </PokerLogo>
              <PokerTitle>Poker</PokerTitle>
            </PokerHeader>
            <PokerDescription>Entrez, jouez et gagnez</PokerDescription>
            <PokerButton>Obtenir un bonus</PokerButton>
          </PokerCard>

          <PokerCard relative overflow>
            <CardsContainer>
              <CardsGrid>
                <PlayingCard>A♠</PlayingCard>
                <PlayingCard red>A♥</PlayingCard>
                <PlayingCard red>A♦</PlayingCard>
                <PlayingCard>A♣</PlayingCard>
              </CardsGrid>
            </CardsContainer>
            <Badge247>24h/7j</Badge247>
          </PokerCard>
        </PokerSection>
      </Main>
    </Container>
  );
};

export default Home;