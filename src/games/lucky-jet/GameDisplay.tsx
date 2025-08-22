import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface GameResult {
  multiplier: number;
  timestamp: number;
}

interface GameDisplayProps {
  currentMultiplier: number;
  gameState: 'waiting' | 'running' | 'crashed';
  countdown: number;
  gameHistory: GameResult[];
  gameTime: number;
  crashPoint: number;
  isPlaying: boolean;
  onCashout: () => void;
}

const GameContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f1419 70%, #0a0a0f 100%);
  overflow: hidden;
`;

const SpaceBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgba(22, 33, 62, 0.4) 0%, rgba(10, 10, 15, 0.7) 100%);
  z-index: 1;
`;

const Stars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #ffffff, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, #ffffff, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(2px 2px at 160px 30px, #ffffff, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: twinkle 4s ease-in-out infinite;
  z-index: 2;

  @keyframes twinkle {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
`;

const Planets = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
`;

const Planet = styled.div<{ size: number; x: number; y: number; color: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  opacity: 0.3;
  filter: blur(1px);
`;

const PreviousResults = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 10;
  
  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
    right: 10px;
    gap: 4px;
  }
`;

const ResultItem = styled.div<{ multiplier: number }>`
  flex: 1;
  padding: 10px 14px;
  background: rgba(64, 64, 64, 0.8);
  border: 2px solid ${props => {
    if (props.multiplier >= 10) return '#ff6b6b';
    if (props.multiplier >= 5) return '#ffa726';
    if (props.multiplier >= 2) return '#00ff88';
    return 'rgba(255, 255, 255, 0.25)';
  }};
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  color: ${props => {
    if (props.multiplier >= 10) return '#ff6b6b';
    if (props.multiplier >= 5) return '#ffa726';
    if (props.multiplier >= 2) return '#00ff88';
    return '#ffffff';
  }};
  
  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 14px;
  }
`;

const GraphContainer = styled.div`
  position: absolute;
  top: 140px;
  left: 80px;
  right: 80px;
  bottom: 100px;
  background: rgba(22, 33, 62, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  z-index: 5;
  
  @media (max-width: 768px) {
    top: 100px;
    left: 20px;
    right: 20px;
    bottom: 120px;
    min-height: 300px;
  }
  
  @media (max-width: 480px) {
    top: 80px;
    left: 15px;
    right: 15px;
    bottom: 140px;
    min-height: 250px;
  }
`;

const GraphGrid = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const GridLine = styled.line`
  stroke: rgba(255, 255, 255, 0.15);
  stroke-width: 1;
`;

const GridText = styled.text`
  fill: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
`;

const MultiplierDisplay = styled.div<{ gameState: string }>`
  position: absolute;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  
  @media (max-width: 768px) {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  
  @media (max-width: 480px) {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const MultiplierValue = styled.div<{ gameState: string }>`
  font-size: 72px;
  font-weight: bold;
  color: ${props => {
    switch (props.gameState) {
      case 'running': return '#00ff88';
      case 'crashed': return '#ff4444';
      default: return '#ffffff';
    }
  }};
  text-shadow: 0 0 30px ${props => {
    switch (props.gameState) {
      case 'running': return 'rgba(0, 255, 136, 0.6)';
      case 'crashed': return 'rgba(255, 68, 68, 0.6)';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const StatusText = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CashoutButton = styled(motion.button)`
  position: absolute;
  left: 50%;
  top: 60%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: linear-gradient(135deg, #ff6b6b, #ff4444);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
  
  @media (max-width: 768px) {
    top: 65%;
    padding: 10px 20px;
    font-size: 14px;
  }
`;

const CharacterContainer = styled(motion.div)`
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  z-index: 8;
  
  @media (max-width: 768px) {
    left: 50%;
    top: 35%;
  }
  
  @media (max-width: 480px) {
    left: 50%;
    top: 35%;
  }
`;

const Character = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(255, 165, 0, 0.5));
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
  }
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
  }
`;

const GameDisplay: React.FC<GameDisplayProps> = ({
  currentMultiplier,
  gameState,
  countdown,
  gameHistory,
  gameTime,
  crashPoint,
  isPlaying,
  onCashout
}) => {
  const getStatusText = () => {
    switch (gameState) {
      case 'waiting':
        return countdown > 0 ? `STARTING IN ${countdown}` : 'GET READY';
      case 'running':
        return 'GAME RUNNING';
      case 'crashed':
        return `CRASHED AT ${crashPoint.toFixed(2)}x`;
      default:
        return '';
    }
  };

  const getMultiplierText = () => {
    if (gameState === 'crashed') {
      return `${crashPoint.toFixed(2)}x`;
    }
    return `${currentMultiplier.toFixed(2)}x`;
  };

  return (
    <GameContainer>
      <SpaceBackground />
      <Stars />
      
      <Planets>
        <Planet size={100} x={5} y={75} color="#6366F1" />
        <Planet size={80} x={85} y={80} color="#14B8A6" />
        <Planet size={60} x={80} y={15} color="#64748B" />
      </Planets>

      <PreviousResults>
        {gameHistory.slice(0, 10).map((result, index) => (
          <ResultItem key={index} multiplier={result.multiplier}>
            {result.multiplier.toFixed(2)}x
          </ResultItem>
        ))}
      </PreviousResults>

      <GraphContainer>
        <GraphGrid>
          {/* Horizontal grid lines */}
          <GridLine x1="0" y1="0" x2="100%" y2="0" />
          <GridLine x1="0" y1="16.67%" x2="100%" y2="16.67%" />
          <GridLine x1="0" y1="33.33%" x2="100%" y2="33.33%" />
          <GridLine x1="0" y1="50%" x2="100%" y2="50%" />
          <GridLine x1="0" y1="66.67%" x2="100%" y2="66.67%" />
          <GridLine x1="0" y1="83.33%" x2="100%" y2="83.33%" />
          <GridLine x1="0" y1="100%" x2="100%" y2="100%" />
          
          {/* Vertical grid lines */}
          <GridLine x1="0" y1="0" x2="0" y2="100%" />
          <GridLine x1="14.28%" y1="0" x2="14.28%" y2="100%" />
          <GridLine x1="28.57%" y1="0" x2="28.57%" y2="100%" />
          <GridLine x1="42.86%" y1="0" x2="42.86%" y2="100%" />
          <GridLine x1="57.14%" y1="0" x2="57.14%" y2="100%" />
          <GridLine x1="71.43%" y1="0" x2="71.43%" y2="100%" />
          <GridLine x1="85.71%" y1="0" x2="85.71%" y2="100%" />
          <GridLine x1="100%" y1="0" x2="100%" y2="100%" />
        </GraphGrid>
      </GraphContainer>

      <MultiplierDisplay gameState={gameState}>
        <MultiplierValue gameState={gameState}>
          {getMultiplierText()}
        </MultiplierValue>
        <StatusText>{getStatusText()}</StatusText>
      </MultiplierDisplay>

      {gameState === 'running' && isPlaying && (
        <CashoutButton
          onClick={onCashout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          CASHOUT
        </CashoutButton>
      )}

      {gameState === 'running' && (
        <CharacterContainer
          animate={{
            y: [0, -15, 0],
            rotate: [0, 1, -1, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Character src="/players/Character.png" alt="Character" />
        </CharacterContainer>
      )}

      {gameState === 'crashed' && (
        <CharacterContainer
          animate={{
            y: [0, 300],
            rotate: [0, 720],
            scale: [1, 0.5]
          }}
          transition={{
            duration: 2,
            ease: "easeIn"
          }}
        >
          <Character src="/players/Character.png" alt="Character" />
        </CharacterContainer>
      )}
    </GameContainer>
  );
};

export default GameDisplay;

