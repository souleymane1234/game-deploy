import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';

interface DiceGameProps {
  balance: number;
  setBalance: (balance: number) => void;
}

interface DiceResult {
  number: number;
  timestamp: number;
}

// Animations
const diceRoll = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(0.9); }
  75% { transform: rotate(270deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const GameContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background: url('/sprites/Dice/DiceBG.png') center center / cover no-repeat;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(22, 33, 62, 0.6) 50%, rgba(15, 20, 25, 0.8) 100%);
    pointer-events: none;
  }
`;

const GameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 1;
`;

const GameTitle = styled.h1`
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(45deg, #ffd700, #ff6b6b, #00ff88, #00ccff);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 40px;
  animation: ${css`${bounce} 2s ease-in-out infinite`};
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const DiceTable = styled(motion.div)`
  background: linear-gradient(135deg, #2d5016 0%, #1a3d0e 50%, #0f2a08 100%);
  border-radius: 30px;
  padding: 40px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  border: 3px solid #4a7c59;
  position: relative;
  margin: 20px 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 2px solid #6b8c7a;
    border-radius: 20px;
    opacity: 0.3;
  }
`;

const DiceContainer = styled(motion.div)`
  display: flex;
  gap: 20px;
  margin: 30px 0;
  justify-content: center;
  align-items: center;
`;

const Dice = styled(motion.div)<{ isRolling: boolean; result: number }>`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
  border: 2px solid #333;
  position: relative;
  animation: ${props => props.isRolling ? css`${diceRoll} 0.8s ease-in-out` : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: ${props => {
      const colors = ['#ff6b6b', '#ffd700', '#00ff88', '#00ccff', '#ff69b4', '#8a2be2'];
      return colors[props.result - 1] || '#ff6b6b';
    }};
    border-radius: 8px;
    opacity: 0.1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
    border-radius: 12px;
    pointer-events: none;
  }
`;

const DiceNumber = styled.div<{ result: number }>`
  position: relative;
  z-index: 2;
  color: ${props => {
    const colors = ['#ff6b6b', '#ffd700', '#00ff88', '#00ccff', '#ff69b4', '#8a2be2'];
    return colors[props.result - 1] || '#ff6b6b';
  }};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 900;
  font-size: 28px;
`;

const BettingArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 30px 0;
  background: rgba(0, 0, 0, 0.3);
  padding: 30px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const BetOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  margin: 20px 0;
`;

const BetOption = styled.button<{ isSelected: boolean; isDisabled: boolean }>`
  width: 70px;
  height: 70px;
  border-radius: 12px;
  border: 3px solid ${props => props.isSelected ? '#00ff88' : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.isSelected ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isSelected ? '#00ff88' : '#fff'};
  font-size: 18px;
  font-weight: bold;
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  ${props => props.isSelected && css`
    animation: ${shake} 0.5s ease-in-out;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
  `}
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 255, 136, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover:not(:disabled)::before {
    left: 100%;
  }
`;

const BetControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
`;

const BetInput = styled.input`
  padding: 15px 20px;
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 18px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:focus {
    border-color: #00ff88;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const RollButton = styled(motion.button)<{ isDisabled: boolean }>`
  padding: 20px 40px;
  border-radius: 25px;
  border: none;
  background: linear-gradient(45deg, #00ff88, #00ccff);
  color: #000;
  font-size: 20px;
  font-weight: 700;
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 8px 20px rgba(0, 255, 136, 0.3);
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 12px 30px rgba(0, 255, 136, 0.5);
  }
  
  &:disabled {
    opacity: 0.5;
    background: #666;
  }
`;

const ResultsHistory = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  max-width: 200px;
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
`;

const HistoryItem = styled.div<{ color: string }>`
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const WinMessage = styled(motion.div)<{ color: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.color};
  color: white;
  padding: 20px 40px;
  border-radius: 15px;
  font-size: 24px;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  text-align: center;
`;

const StatsDisplay = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatItem = styled.div`
  color: #fff;
  font-size: 14px;
  margin: 5px 0;
  
  span {
    color: #00ff88;
    font-weight: bold;
  }
`;

const DiceGame: React.FC<DiceGameProps> = ({ balance, setBalance }) => {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<number>(1);
  const [gameHistory, setGameHistory] = useState<DiceResult[]>([]);
  const [showWinMessage, setShowWinMessage] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [totalWins, setTotalWins] = useState<number>(0);
  const [totalGames, setTotalGames] = useState<number>(0);

  // Multiplicateurs selon la difficulté (probabilité 1/6 pour chaque nombre)
  const getMultiplier = (number: number) => {
    // Plus le nombre est "rare" ou "spécial", plus le multiplicateur est élevé
    switch (number) {
      case 1: return 4.5; // Rouge, plus commun
      case 2: return 4.8; // Orange
      case 3: return 5.2; // Jaune
      case 4: return 5.5; // Vert clair
      case 5: return 5.8; // Rose
      case 6: return 6.0; // Violet, plus rare
      default: return 5.0;
    }
  };

  const handleRoll = useCallback(() => {
    if (selectedNumber === null || betAmount > balance || isRolling) return;

    setIsRolling(true);
    setBalance(balance - betAmount);
    setTotalGames(prev => prev + 1);

    // Simuler le lancer de dé
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setCurrentResult(result);
      
      const isWin = result === selectedNumber;
      
      if (isWin) {
        const multiplier = getMultiplier(selectedNumber);
        const winnings = betAmount * multiplier;
        setBalance(balance + winnings);
        setWinAmount(winnings);
        setTotalWins(prev => prev + 1);
        setShowWinMessage(true);
        
        setTimeout(() => {
          setShowWinMessage(false);
        }, 2000);
      }

      // Ajouter à l'historique
      setGameHistory(prev => [
        { number: result, timestamp: Date.now() },
        ...prev.slice(0, 9) // Garder seulement les 10 derniers résultats
      ]);

      setIsRolling(false);
    }, 800);
  }, [selectedNumber, betAmount, balance, setBalance, isRolling]);

  const handleNumberSelect = (number: number) => {
    setSelectedNumber(number);
  };

  const getNumberColor = (number: number) => {
    const colors = ['#ff6b6b', '#ffd700', '#00ff88', '#00ccff', '#ff69b4', '#8a2be2'];
    return colors[number - 1] || '#ff6b6b';
  };

  return (
    <GameContainer>
      <StatsDisplay>
        <StatItem>Balance: <span>{balance.toLocaleString()} FCFA</span></StatItem>
        <StatItem>Parties: <span>{totalGames}</span></StatItem>
        <StatItem>Victoires: <span>{totalWins}</span></StatItem>
        <StatItem>Win Rate: <span>{totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0}%</span></StatItem>
      </StatsDisplay>

      <ResultsHistory>
        {gameHistory.map((result, index) => (
          <HistoryItem key={index} color={getNumberColor(result.number)}>
            {result.number}
          </HistoryItem>
        ))}
      </ResultsHistory>

      <GameArea>
        <GameTitle>🎲 Dice Game</GameTitle>
        
        <DiceTable>
          <DiceContainer
            animate={isRolling ? { 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.02, 0.98, 1]
            } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Dice 
              isRolling={isRolling} 
              result={currentResult}
              animate={isRolling ? { rotate: [0, 360] } : {}}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <DiceNumber result={currentResult}>{currentResult}</DiceNumber>
            </Dice>
          </DiceContainer>
        </DiceTable>

        <BettingArea>
          <h3 style={{ color: '#fff', margin: '0 0 20px 0', fontSize: '24px' }}>
            Pariez sur un nombre
          </h3>
          
          <BetOptions>
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <BetOption
                key={number}
                isSelected={selectedNumber === number}
                isDisabled={isRolling}
                onClick={() => handleNumberSelect(number)}
              >
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{number}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>x{getMultiplier(number)}</div>
              </BetOption>
            ))}
          </BetOptions>

          <BetControls>
            <BetInput
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              placeholder="Montant du pari"
              min="10"
              max={balance}
              disabled={isRolling}
            />
            
            <RollButton
              isDisabled={selectedNumber === null || betAmount > balance || isRolling}
              onClick={handleRoll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRolling ? (
                <>
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>🎲</span>
                  Lancement...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>🎲</span>
                  Lancer le dé
                </>
              )}
            </RollButton>
          </BetControls>
        </BettingArea>

        {showWinMessage && (
          <WinMessage
            color={getNumberColor(selectedNumber || 1)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            🎉 Gagné ! +{winAmount} FCFA
          </WinMessage>
        )}
      </GameArea>
    </GameContainer>
  );
};

export default DiceGame;

