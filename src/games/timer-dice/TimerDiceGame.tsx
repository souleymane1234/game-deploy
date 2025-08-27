import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import { GameConfig } from '../../types/GamePlugin';
import BalanceService from '../../services/BalanceService';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Fredoka Bold';
    src: url('/assets/fonts/fredoka-bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
  }
`;

interface TimerDiceGameProps {
  balance: number;
  setBalance: (balance: number) => void;
  gameConfig: GameConfig;
}

interface DiceSelection {
  face: number;
  bet: number;
}

interface BetAmount {
  amount: number;
  isSet: boolean;
}

const rollAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const GameContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #0a0a2a;
  background-image: 
    linear-gradient(rgba(138, 43, 226, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(138, 43, 226, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  display: flex;
  flex-direction: column;
  font-family: 'Fredoka Bold', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  color: white;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(10, 10, 42, 0.9);
  backdrop-filter: blur(15px);
  border-bottom: 2px solid rgba(138, 43, 226, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
  }
`;

const WalletContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(0, 191, 255, 0.2) 100%);
  border: 2px solid rgba(138, 43, 226, 0.4);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(138, 43, 226, 0.4);
    border-color: rgba(138, 43, 226, 0.6);
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    gap: 0.8rem;
  }
`;

const WalletIcon = styled.div`
  font-size: 1.5rem;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const BalanceDisplay = styled.div`
  color: #ffd700;
  font-weight: bold;
  font-size: 1.3rem;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  font-family: 'Fredoka Bold', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  gap: 1.5rem;
  background: transparent;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const GamePrompt = styled.h2`
  color: #8a2be2;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.5);

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const TimerCircle = styled.div<{ progress: number }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #8a2be2 ${props => props.progress * 360}deg,
    rgba(138, 43, 226, 0.2) ${props => props.progress * 360}deg 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 2rem 0;
  box-shadow: 0 0 30px rgba(138, 43, 226, 0.5);

  &::before {
    content: '';
    position: absolute;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(10, 10, 42, 0.8);
    border: 2px solid rgba(138, 43, 226, 0.3);
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
    margin: 1rem 0;

    &::before {
      width: 135px;
      height: 135px;
    }
  }
`;

const TimerNumber = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: #8a2be2;
  z-index: 1;
  text-shadow: 0 0 15px rgba(138, 43, 226, 0.8);

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const DiceContainer = styled.div<{ isRolling: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
`;

const Dice = styled.div<{ isRolling: boolean }>`
  width: 120px;
  height: 120px;
  background: transparent;
  border: ${props => props.isRolling ? 'none' : '3px solid #00bfff'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.isRolling ? 'none' : '0 0 20px rgba(0, 191, 255, 0.5)'};
  overflow: hidden;
  transition: all 0.1s ease;

  ${props => props.isRolling && css`
    animation: ${rollAnimation} 0.1s ease-in-out;
  `}

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 10px rgba(0, 191, 255, 0.8));
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const BettingArea = styled.div`
  width: 100%;
  background: rgba(10, 10, 42, 0.8);
  padding: 2rem;
  border-radius: 16px 16px 0 0;
  border-top: 2px solid rgba(138, 43, 226, 0.3);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BettingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  min-height: 200px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    min-height: 150px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }
`;

const DiceBet = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 1rem;
  border-radius: 12px;
  background: ${props => props.selected ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
  border: 3px solid ${props => props.selected ? '#ffd700' : 'rgba(255, 255, 255, 0.3)'};
  box-shadow: ${props => props.selected ? '0 8px 25px rgba(255, 215, 0, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.2)'};
  transform: ${props => props.selected ? 'scale(1.05)' : 'scale(1)'};
  height: fit-content;
  min-height: 120px;

  &:hover {
    transform: ${props => props.selected ? 'scale(1.05)' : 'scale(1.02)'};
    background: ${props => props.selected ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
    box-shadow: ${props => props.selected ? '0 10px 30px rgba(255, 215, 0, 0.5)' : '0 6px 20px rgba(0, 0, 0, 0.3)'};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
    min-height: 100px;
    gap: 0.4rem;
  }
`;

const DiceFace = styled.div`
  width: 60px;
  height: 60px;
  background: transparent;
  border: 2px solid #00bfff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.4);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 8px rgba(0, 191, 255, 0.6));
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const BetAmount = styled.div`
  background: rgba(138, 43, 226, 0.3);
  color: #ffd700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  min-width: 60px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(138, 43, 226, 0.4);
  border: 1px solid rgba(138, 43, 226, 0.5);

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    min-width: 50px;
  }
`;

const SelectionDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin: 2rem 0;
  min-height: 80px;
`;

const SelectedFace = styled.div<{ isSelected: boolean }>`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.isSelected ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.isSelected ? '#ffd700' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const GameStatus = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h3 {
    margin: 0;
    color: #8a2be2;
    font-size: 1.5rem;
    font-weight: 600;
    text-shadow: 0 0 8px rgba(138, 43, 226, 0.5);
  }

  p {
    margin: 0.5rem 0 0 0;
    color: #00bfff;
    font-size: 1rem;
    text-shadow: 0 0 5px rgba(0, 191, 255, 0.5);
  }

  @media (max-width: 768px) {
    margin-bottom: 1rem;

    h3 {
      font-size: 1.2rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
`;

const ResultOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ResultContent = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid #475569;
  max-width: 400px;
  width: 90%;

  h2 {
    color: #f8fafc;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 20px 0;
  }

  p {
    color: #e2e8f0;
    font-size: 1rem;
    margin: 8px 0;
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
    max-width: 350px;

    h2 {
      font-size: 1.3rem;
      margin: 0 0 15px 0;
    }

    p {
      font-size: 0.9rem;
    }
  }
`;

const WinResult = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  text-align: center;

  p {
    color: white;
    font-weight: 600;
    margin: 8px 0;
    font-size: 1.1rem;
  }
`;

const LoseResult = styled.div`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  text-align: center;

  p {
    color: white;
    font-weight: 600;
    margin: 8px 0;
    font-size: 1.1rem;
  }
`;

const NewGameButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    margin-top: 15px;
  }
`;

const BetInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(10, 10, 42, 0.8);
  border-radius: 16px;
  border: 2px solid rgba(138, 43, 226, 0.3);
  max-width: 400px;
  width: 90%;
  margin: 2rem auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1rem;
  }
`;

const BetInputTitle = styled.h2`
  color: #8a2be2;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.5);

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const BetInputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const BetInputLabel = styled.label`
  color: #00bfff;
  font-size: 1rem;
  font-weight: 600;
  text-shadow: 0 0 5px rgba(0, 191, 255, 0.5);
`;

const BetInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(138, 43, 226, 0.5);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #8a2be2;
    box-shadow: 0 0 15px rgba(138, 43, 226, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const BetQuickButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 0.4rem;
  }
`;

const BetQuickButton = styled.button<{ isSelected?: boolean }>`
  background: ${props => props.isSelected ? 'linear-gradient(135deg, #8a2be2 0%, #4c1d95 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 2px solid ${props => props.isSelected ? '#8a2be2' : 'rgba(255, 255, 255, 0.3)'};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const StartGameButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.5rem;
  text-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
`;

const TimerDiceGame: React.FC<TimerDiceGameProps> = ({ balance, setBalance, gameConfig }) => {
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [selectedFaces, setSelectedFaces] = useState<DiceSelection[]>([]);
  const [currentDice, setCurrentDice] = useState<number>(1);
  const [finalResult, setFinalResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [totalBet, setTotalBet] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<BetAmount>({ amount: 5, isSet: false });
  const [showBetInput, setShowBetInput] = useState<boolean>(true);
  const balanceService = BalanceService.getInstance();

  // Synchroniser le solde avec le BalanceService
  useEffect(() => {
    const handleBalanceUpdate = (newBalance: number) => {
      setBalance(newBalance);
    };

    balanceService.on('balanceUpdate', handleBalanceUpdate);
    
    // Initialiser avec le solde actuel du service
    setBalance(balanceService.getBalance());

    return () => {
      balanceService.off('balanceUpdate', handleBalanceUpdate);
    };
  }, [balanceService, setBalance]);

  // Timer effect
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameActive) {
      // Start rolling animation
      setIsRolling(true);
      setIsGameActive(false);
      
                     // Simulate rolling animation - faster random number changes
        const rollInterval = setInterval(() => {
          setCurrentDice(Math.floor(Math.random() * 6) + 1);
        }, 50);

               // Stop rolling after 3 seconds and show final result
        setTimeout(() => {
          clearInterval(rollInterval);
          const finalDice = Math.floor(Math.random() * 6) + 1;
          setFinalResult(finalDice);
          setCurrentDice(finalDice);
          setIsRolling(false);
          
          // Calculate winnings
          const winningFace = selectedFaces.find(
            selection => selection.face === finalDice
          );
          
                    if (winningFace) {
             const winAmount = winningFace.bet * 5; // 5x payout
             balanceService.addWinnings(winAmount);
           }
          
          // Show result popup after 2 seconds delay so player can see the final dice
          setTimeout(() => {
            setShowResult(true);
          }, 2000);
        }, 3000);
    }
  }, [timeLeft, isGameActive, selectedFaces, balanceService]);

  // Start new game
  const startNewGame = useCallback(() => {
    setTimeLeft(10);
    setIsGameActive(true);
    setIsRolling(false);
    setSelectedFaces([]);
    setFinalResult(null);
    setShowResult(false);
    setTotalBet(0);
    setCurrentDice(1);
    setShowBetInput(false);
  }, []);

  // Set bet amount and start game
  const setBetAndStart = useCallback(() => {
    if (betAmount.amount > 0 && balanceService.canAfford(betAmount.amount)) {
      setBetAmount(prev => ({ ...prev, isSet: true }));
      setShowBetInput(false);
      setTimeLeft(10);
      setIsGameActive(true);
    }
  }, [betAmount.amount, balanceService]);

  // Select dice face
  const selectFace = useCallback((face: number) => {
    if (!isGameActive) return;
    
    const existingIndex = selectedFaces.findIndex(
      selection => selection.face === face
    );
    
    if (existingIndex >= 0) {
      // Remove face
      const newFaces = selectedFaces.filter((_, index) => index !== existingIndex);
      setSelectedFaces(newFaces);
      setTotalBet(prev => prev - selectedFaces[existingIndex].bet);
      balanceService.addWinnings(selectedFaces[existingIndex].bet);
    } else {
      // Add face (max 2)
      if (selectedFaces.length < 2) {
        if (balanceService.canAfford(betAmount.amount)) {
          const newSelection: DiceSelection = { face, bet: betAmount.amount };
          setSelectedFaces(prev => [...prev, newSelection]);
          setTotalBet(prev => prev + betAmount.amount);
          balanceService.placeBet(betAmount.amount);
        }
      }
    }
  }, [isGameActive, selectedFaces, balanceService, betAmount.amount]);

  const progress = timeLeft / 10;

  const quickBetAmounts = [100, 500, 1000, 5000, 10000, 100000];

  const handleBetAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setBetAmount({ amount: numValue, isSet: false });
    }
  };

  const setQuickBet = (amount: number) => {
    setBetAmount({ amount, isSet: false });
  };

  const isBetValid = betAmount.amount > 0 && balanceService.canAfford(betAmount.amount);

  const renderDiceFace = (face: number) => {
    return (
      <DiceFace>
        <img 
          src={`/sprites/Dice/TimerDice/Dice/${face}.png`} 
          alt={`Dice ${face}`}
          onError={(e) => {
            // Fallback to text if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = face.toString();
            target.parentElement!.style.fontSize = '1.5rem';
            target.parentElement!.style.fontWeight = 'bold';
            target.parentElement!.style.color = '#00bfff';
            target.parentElement!.style.textShadow = '0 0 8px rgba(0, 191, 255, 0.6)';
          }}
        />
      </DiceFace>
    );
  };

    return (
    <>
      <GlobalStyle />
      <GameContainer>
        <Header>
          <WalletContainer>
            <WalletIcon>💰</WalletIcon>
            <BalanceDisplay>FCFA {balance.toFixed(2)}</BalanceDisplay>
          </WalletContainer>
        </Header>

        <MainContent>
          {showBetInput ? (
            <BetInputContainer>
              <BetInputTitle>Set Your Bet Amount</BetInputTitle>
              <BetInputField>
                <BetInputLabel>Bet Amount (FCFA)</BetInputLabel>
                <BetInput
                  type="number"
                  min="0"
                  max={balance}
                  step="0.01"
                  value={betAmount.amount}
                  onChange={(e) => handleBetAmountChange(e.target.value)}
                  placeholder="Enter bet amount"
                />
              </BetInputField>
              
              <BetQuickButtons>
                {quickBetAmounts.map(amount => (
                  <BetQuickButton
                    key={amount}
                    isSelected={betAmount.amount === amount}
                    onClick={() => setQuickBet(amount)}
                  >
                    FCFA {amount}
                  </BetQuickButton>
                ))}
              </BetQuickButtons>

              {!isBetValid && betAmount.amount > 0 && (
                <ErrorMessage>
                  {betAmount.amount > balance ? 'Insufficient balance' : 'Invalid bet amount'}
                </ErrorMessage>
              )}

              <StartGameButton
                disabled={!isBetValid}
                onClick={setBetAndStart}
              >
                Start Game
              </StartGameButton>
            </BetInputContainer>
          ) : (
            <>
              <GamePrompt>Select up to 2 dice faces</GamePrompt>
              
              {isGameActive && (
                <TimerCircle progress={progress}>
                  <TimerNumber>{timeLeft}</TimerNumber>
                </TimerCircle>
              )}

              {isRolling && (
                <DiceContainer isRolling={isRolling}>
                  <Dice isRolling={isRolling}>
                    <img 
                      src={`/sprites/Dice/TimerDice/Dice/${currentDice}.png`} 
                      alt={`Dice ${currentDice}`}
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = currentDice.toString();
                        target.parentElement!.style.fontSize = '3rem';
                        target.parentElement!.style.fontWeight = 'bold';
                        target.parentElement!.style.color = '#00bfff';
                        target.parentElement!.style.textShadow = '0 0 10px rgba(0, 191, 255, 0.8)';
                      }}
                    />
                  </Dice>
                </DiceContainer>
              )}

              {finalResult && !isRolling && (
                <DiceContainer isRolling={false}>
                  <Dice isRolling={false}>
                    <img 
                      src={`/sprites/Dice/TimerDice/Dice/${finalResult}.png`} 
                      alt={`Dice ${finalResult}`}
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = finalResult.toString();
                        target.parentElement!.style.fontSize = '3rem';
                        target.parentElement!.style.fontWeight = 'bold';
                        target.parentElement!.style.color = '#00bfff';
                        target.parentElement!.style.textShadow = '0 0 10px rgba(0, 191, 255, 0.8)';
                      }}
                    />
                  </Dice>
                </DiceContainer>
              )}

              <GameStatus>
                <h3>
                  {isGameActive ? 'Select your faces!' : 
                   isRolling ? 'Rolling dice...' : 
                   finalResult ? 'Game ended' : 'Ready to start'}
                </h3>
                <p>Total bet: FCFA {totalBet.toFixed(2)} | Selected: {selectedFaces.length}/2 faces</p>
              </GameStatus>

              {selectedFaces.length > 0 && (
                <SelectionDisplay>
                  <h4 style={{ color: '#8a2be2', margin: 0, fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 0 8px rgba(138, 43, 226, 0.5)' }}>
                    Selected Faces ({selectedFaces.length}/2):
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {selectedFaces.map((selection, index) => (
                      <SelectedFace key={index} isSelected={true}>
                        {renderDiceFace(selection.face)}
                        <span style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          FCFA {selection.bet}
                        </span>
                      </SelectedFace>
                    ))}
                  </div>
                </SelectionDisplay>
              )}
            </>
          )}
        </MainContent>

        {!showBetInput && (
          <BettingArea>
            <BettingGrid>
              {[1, 2, 3, 4, 5, 6].map(face => {
                const isSelected = selectedFaces.some(
                  selection => selection.face === face
                );
                
                return (
                  <DiceBet 
                    key={face}
                    selected={isSelected}
                    onClick={() => selectFace(face)}
                  >
                    {renderDiceFace(face)}
                    <BetAmount>
                      {isSelected ? `FCFA ${betAmount.amount}` : 'Select'}
                    </BetAmount>
                  </DiceBet>
                );
              })}
            </BettingGrid>
          </BettingArea>
        )}

        {showResult && (
          <ResultOverlay>
            <ResultContent>
              <h2>Game Result!</h2>
              {selectedFaces.some(
                selection => selection.face === finalResult
              ) ? (
                <WinResult>
                  <p>🎉 You won!</p>
                  <p>Gain: FCFA {((selectedFaces.find(s => s.face === finalResult)?.bet || 0) * 5).toFixed(2)}</p>
                </WinResult>
              ) : (
                <LoseResult>
                  <p>😔 You lost</p>
                  <p>No matching face</p>
                </LoseResult>
              )}
              <p style={{ color: '#00bfff', fontSize: '1.1rem', marginTop: '1rem' }}>
                Dice rolled: {finalResult}
              </p>
              <NewGameButton onClick={startNewGame}>
                New Game
              </NewGameButton>
            </ResultContent>
          </ResultOverlay>
        )}

        {!isGameActive && !showResult && !isRolling && !showBetInput && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <NewGameButton onClick={() => {
              setShowBetInput(true);
              setBetAmount({ amount: 5, isSet: false });
            }}>
              Start New Game
            </NewGameButton>
          </div>
        )}
      </GameContainer>
    </>
  );
 };

export default TimerDiceGame;
