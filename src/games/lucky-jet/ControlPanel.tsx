import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Settings } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  avatar: string;
  multiplier?: number;
  amount: number;
  hasMultiplier: boolean;
  isPlaying?: boolean;
  cashoutMultiplier?: number;
}

interface ControlPanelProps {
  gameMode: 'manual' | 'auto';
  setGameMode: (mode: 'manual' | 'auto') => void;
  betAmount: number;
  setBetAmount: (amount: number | ((prev: number) => number)) => void;
  autoCashout: number;
  setAutoCashout: (amount: number) => void;
  onJoinGame: () => void;
  onCashout: () => void;
  players: Player[];
  balance: number;
  profit: number;
  isPlaying: boolean;
  gameState: 'waiting' | 'running' | 'crashed';
}

const PanelContainer = styled.div`
  width: 350px;
  background: #323232;
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding: 20px;
  }
`;

const BalanceSection = styled.div`
  background: #404040;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
`;

const BalanceTitle = styled.div`
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 5px;
`;

const BalanceAmount = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #00ff88;
  margin-bottom: 8px;
`;

const ProfitAmount = styled.div<{ profit: number }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.profit > 0 ? '#00ff88' : props.profit < 0 ? '#ff4444' : 'rgba(255, 255, 255, 0.7)'};
`;

const ModeToggle = styled.div`
  display: flex;
  background: #404040;
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
`;

const ModeButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: ${props => props.active ? '#00ff88' : '#404040'};
  color: ${props => props.active ? '#000000' : '#ffffff'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#00ff88' : '#484848'};
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputLabel = styled.label`
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #404040;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  
  &:focus {
    outline: none;
    border-color: #00ff88;
    box-shadow: 0 0 0 2px rgba(0, 255, 0, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const CurrencyLabel = styled.span`
  position: absolute;
  right: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: 500;
`;

const QuickButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const QuickButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  background: #404040;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #484848;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const GameButton = styled(motion.button)<{ variant: 'join' | 'cashout' | 'disabled' }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  cursor: ${props => props.variant === 'disabled' ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'join':
        return `
          background: #404040;
          color: rgba(255, 255, 255, 0.5);
          &:hover {
            background: #484848;
          }
        `;
      case 'cashout':
        return `
          background: linear-gradient(135deg, #ff6b6b, #ff4444);
          color: #ffffff;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
          }
        `;
      case 'disabled':
        return `
          background: #404040;
          color: rgba(255, 255, 255, 0.3);
        `;
    }
  }}
`;

const PlayersSection = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const PlayersTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
`;

const PlayerItem = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #363636;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #404040;
  }
`;

const PlayerAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const PlayerInfo = styled.div`
  flex: 1;
`;

const PlayerName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 2px;
`;

const PlayerAmount = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const PlayerMultiplier = styled.div<{ hasMultiplier: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.hasMultiplier ? '#00ff88' : 'rgba(255, 255, 255, 0.5)'};
`;

const ControlPanel: React.FC<ControlPanelProps> = ({
  gameMode,
  setGameMode,
  betAmount,
  setBetAmount,
  autoCashout,
  setAutoCashout,
  onJoinGame,
  onCashout,
  players,
  balance,
  profit,
  isPlaying,
  gameState
}) => {
  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setBetAmount(value);
  };

  const handleAutoCashoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAutoCashout(value);
  };

  const handleQuickBet = (multiplier: number) => {
    setBetAmount((prev: number) => prev * multiplier);
  };

  const handleMaxBet = () => {
    setBetAmount(balance);
  };

  const getGameButtonVariant = () => {
    if (gameState === 'crashed') return 'disabled';
    if (isPlaying) return 'cashout';
    return 'join';
  };

  const getGameButtonText = () => {
    if (gameState === 'crashed') return 'GAME CRASHED';
    if (isPlaying) return 'CASHOUT';
    return 'PLACE BET';
  };

  const handleGameButtonClick = () => {
    if (gameState === 'crashed') return;
    if (isPlaying) {
      onCashout();
    } else {
      onJoinGame();
    }
  };

  return (
    <PanelContainer>
      <BalanceSection>
        <BalanceTitle>BALANCE</BalanceTitle>
        <BalanceAmount>{balance.toLocaleString()} FCFA</BalanceAmount>
        <ProfitAmount profit={profit}>
          {profit > 0 ? '+' : ''}{profit.toLocaleString()} FCFA
        </ProfitAmount>
      </BalanceSection>

      <div>
        <InputLabel>GAME MODE</InputLabel>
        <ModeToggle>
          <ModeButton
            active={gameMode === 'manual'}
            onClick={() => setGameMode('manual')}
          >
            MANUAL
          </ModeButton>
          <ModeButton
            active={gameMode === 'auto'}
            onClick={() => setGameMode('auto')}
          >
            AUTO
          </ModeButton>
        </ModeToggle>
      </div>

      <InputGroup>
        <InputLabel>BET AMOUNT</InputLabel>
        <InputContainer>
          <Input
            type="number"
            value={betAmount}
            onChange={handleBetChange}
            placeholder="0"
            min="0"
            max={balance}
          />
          <CurrencyLabel>FCFA</CurrencyLabel>
        </InputContainer>
        <QuickButtons>
          <QuickButton onClick={() => handleQuickBet(0.5)}>1/2</QuickButton>
          <QuickButton onClick={() => handleQuickBet(2)}>2x</QuickButton>
          <QuickButton onClick={handleMaxBet}>MAX</QuickButton>
        </QuickButtons>
      </InputGroup>

      {gameMode === 'auto' && (
        <InputGroup>
          <InputLabel>AUTO CASHOUT</InputLabel>
          <InputContainer>
            <Input
              type="number"
              value={autoCashout}
              onChange={handleAutoCashoutChange}
              placeholder="2.00"
              min="1.01"
              step="0.01"
            />
            <CurrencyLabel>x</CurrencyLabel>
          </InputContainer>
        </InputGroup>
      )}

      <GameButton
        variant={getGameButtonVariant()}
        onClick={handleGameButtonClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {getGameButtonText()}
      </GameButton>

      <PlayersSection>
        <PlayersTitle>PLAYERS</PlayersTitle>
        {players.map(player => (
          <PlayerItem key={player.id} isActive={player.isPlaying || false}>
            <PlayerAvatar>{player.avatar}</PlayerAvatar>
            <PlayerInfo>
              <PlayerName>{player.name}</PlayerName>
              <PlayerAmount>{player.amount.toLocaleString()} FCFA</PlayerAmount>
            </PlayerInfo>
            {player.hasMultiplier && player.cashoutMultiplier && (
              <PlayerMultiplier hasMultiplier={true}>
                {player.cashoutMultiplier.toFixed(2)}x
              </PlayerMultiplier>
            )}
          </PlayerItem>
        ))}
      </PlayersSection>
    </PanelContainer>
  );
};

export default ControlPanel;

