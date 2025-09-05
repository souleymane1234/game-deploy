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

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
  z-index: 20;
`;

const PartnerContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(22, 33, 62, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
`;

const PartnerText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
`;

const PartnerLogo = styled.div`
  width: 140px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
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



const MultiplierDisplay = styled.div<{ gameState: string }>`
  position: absolute;
  left: 50%;
  bottom: 20%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  
  @media (max-width: 768px) {
    left: 50%;
    bottom: 15%;
    transform: translateX(-50%);
  }
  
  @media (max-width: 480px) {
    left: 50%;
    bottom: 10%;
    transform: translateX(-50%);
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
  transition: color 0.1s ease, text-shadow 0.1s ease;
  padding: 6px 12px;
  border-radius: 10px;
  background: ${props => props.gameState === 'running' ? 'rgba(0, 0, 0, 0.35)' : 'transparent'};
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
  bottom: 10%;
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
    bottom: 8%;
    padding: 10px 20px;
    font-size: 14px;
  }
`;

const CharacterContainer = styled(motion.div)`
  position: absolute;
  left: 45%;
  top: 40%;
  transform: translate(-50%, -50%);
  z-index: 8;
  
  @media (max-width: 768px) {
    left: 45%;
    top: 40%;
  }
  
  @media (max-width: 480px) {
    left: 40%;
    top: 40%;
  }
`;

const Trail = styled.div<{ widthPct: number; angleDeg: number }>`
  position: absolute;
  left: 10%;
  bottom: 20%;
  width: ${props => Math.max(0, Math.min(80, props.widthPct))}%;
  height: 4px;
  background: linear-gradient(90deg, rgba(255,165,0,0.0), rgba(255,165,0,0.8) 40%, rgba(255,255,255,0.9));
  filter: drop-shadow(0 0 10px rgba(255, 165, 0, 0.7));
  transform-origin: left center;
  transform: rotate(${props => props.angleDeg}deg);
  z-index: 7;
  border-radius: 4px;
`;

const Character = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 0 15px rgba(255, 165, 0, 0.6));
  
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
  
  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
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
        return countdown > 0 ? `DÉMARRAGE DANS ${countdown}` : 'PRÉPAREZ-VOUS';
      case 'running':
        return 'PARTIE EN COURS';
      case 'crashed':
        return `CRASH À ${crashPoint.toFixed(2)}x`;
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

  // Calcule une position de l'avion en fonction du multiplicateur
  const progress = Math.max(0, Math.min(1, currentMultiplier / 10)); // normalisé sur 10x
  const planeX = 10 + progress * 70; // 10% -> 80%
  const planeY = 70 - progress * 40; // 70% -> 30%
  const trailWidth = progress * 70; // longueur de la traînée
  const trailAngle = -15; // angle léger vers le haut

  return (
    <GameContainer>
      <SpaceBackground />
      <Stars />
      
      <Planets>
        <Planet size={100} x={5} y={75} color="#6366F1" />
        <Planet size={80} x={85} y={80} color="#14B8A6" />
        <Planet size={60} x={80} y={15} color="#64748B" />
      </Planets>

      {/* {gameState === 'waiting' && countdown > 0 && (
        <LoadingOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <PartnerContainer
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <PartnerLogo>
              <svg width="140" height="40" viewBox="0 0 280 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="276" height="76" rx="12" fill="#0b1220" stroke="#00ff88" strokeWidth="4" />
                <circle cx="40" cy="40" r="18" fill="#00ff88" />
                <path d="M34 40 L40 30 L46 40 L40 50 Z" fill="#0b1220" />
                <text x="80" y="48" fill="#ffffff" fontSize="28" fontWeight="700" fontFamily="Verdana, Geneva, Tahoma, sans-serif">PARTENAIRE</text>
              </svg>
            </PartnerLogo>
            <PartnerText>Chargement de la partie…</PartnerText>
          </PartnerContainer>
        </LoadingOverlay>
      )} */}

      <PreviousResults>
        {gameHistory.slice(0, 10).map((result, index) => (
          <ResultItem key={index} multiplier={result.multiplier}>
            {result.multiplier.toFixed(2)}x
          </ResultItem>
        ))}
      </PreviousResults>



      <MultiplierDisplay gameState={gameState}>
        <motion.div
          key={gameState === 'running' ? Math.floor(currentMultiplier * 100) : 'static'}
          initial={{ scale: 1 }}
          animate={gameState === 'running' ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: gameState === 'running' ? Infinity : 0 }}
        >
          <MultiplierValue gameState={gameState}>
            {getMultiplierText()}
          </MultiplierValue>
        </motion.div>
        <StatusText>{getStatusText()}</StatusText>
      </MultiplierDisplay>

      {gameState === 'running' && (
        <Trail widthPct={trailWidth} angleDeg={trailAngle} />
      )}

      {gameState === 'running' && isPlaying && (
        <CashoutButton
          onClick={onCashout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          RETIRER
        </CashoutButton>
      )}

      {gameState === 'running' && (
        <CharacterContainer
          animate={{
            left: `${planeX}%`,
            top: `${planeY}%`,
            y: [0, -15, 0],
            rotate: [0, 1, -1, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ left: `${planeX}%`, top: `${planeY}%` }}
        >
          <Character src="/players/NewCharacter.png" alt="Character" />
        </CharacterContainer>
      )}

      {gameState === 'waiting' && (
        <CharacterContainer
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Character src="/players/NewCharacter.png" alt="Character" />
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
          <Character src="/players/NewCharacter.png" alt="Character" />
        </CharacterContainer>
      )}
    </GameContainer>
  );
};

export default GameDisplay;

