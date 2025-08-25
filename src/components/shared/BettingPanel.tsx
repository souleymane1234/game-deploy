import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GameConfig } from '../../types/GamePlugin';

interface BettingPanelProps {
  config: GameConfig;
  currentBet: number;
  onBetChange: (bet: number) => void;
  onPlaceBet: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  balance: number;
}

const PanelContainer = styled.div<{ theme: any }>`
  background: linear-gradient(135deg, ${props => props.theme.backgroundColor} 0%, rgba(0, 0, 0, 0.8) 100%);
  border: 2px solid ${props => props.theme.primaryColor};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
`;

const Title = styled.h3<{ theme: any }>`
  color: ${props => props.theme.primaryColor};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const BetInputContainer = styled.div`
  margin-bottom: 20px;
`;

const BetInput = styled.input<{ theme: any; hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid ${props => props.hasError ? '#ff4444' : props.theme.secondaryColor};
  border-radius: 8px;
  color: white;
  font-size: 16px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.primaryColor};
    box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const BetIncrements = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

const IncrementButton = styled.button<{ theme: any; isActive?: boolean }>`
  padding: 8px 12px;
  background: ${props => props.isActive ? props.theme.primaryColor : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isActive ? 'black' : 'white'};
  border: 1px solid ${props => props.theme.secondaryColor};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.isActive ? props.theme.primaryColor : props.theme.secondaryColor};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const BalanceDisplay = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid ${props => props.theme.secondaryColor};
`;

const BalanceLabel = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
`;

const BalanceAmount = styled.span<{ theme: any }>`
  color: ${props => props.theme.primaryColor};
  font-weight: bold;
  font-size: 16px;
`;

const PlaceBetButton = styled.button<{ theme: any; isDisabled?: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${props => props.isDisabled ? 'rgba(255, 255, 255, 0.1)' : `linear-gradient(135deg, ${props.theme.primaryColor}, ${props.theme.accentColor})`};
  color: ${props => props.isDisabled ? 'rgba(255, 255, 255, 0.5)' : 'black'};
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const BettingPanel: React.FC<BettingPanelProps> = ({
  config,
  currentBet,
  onBetChange,
  onPlaceBet,
  isDisabled = false,
  isLoading = false,
  balance
}) => {
  const [betInput, setBetInput] = useState(currentBet.toString());
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setBetInput(currentBet.toString());
  }, [currentBet]);

  const handleBetInputChange = (value: string) => {
    setBetInput(value);
    const numValue = parseFloat(value) || 0;
    
    if (numValue < config.minBet) {
      setError(`Mise minimum: ${config.minBet} ${config.currency}`);
    } else if (numValue > config.maxBet) {
      setError(`Mise maximum: ${config.maxBet} ${config.currency}`);
    } else if (numValue > balance) {
      setError('Solde insuffisant');
    } else {
      setError('');
      onBetChange(numValue);
    }
  };

  const handleIncrementClick = (increment: number) => {
    const newBet = Math.min(currentBet + increment, config.maxBet, balance);
    handleBetInputChange(newBet.toString());
  };

  const handleQuickBet = (percentage: number) => {
    const newBet = Math.min((balance * percentage) / 100, config.maxBet);
    handleBetInputChange(newBet.toString());
  };

  const canPlaceBet = !isDisabled && !isLoading && !error && currentBet > 0 && currentBet <= balance;

  return (
    <PanelContainer theme={config.theme}>
      <Title theme={config.theme}>Parier</Title>
      
      <BalanceDisplay theme={config.theme}>
        <BalanceLabel>Solde:</BalanceLabel>
        <BalanceAmount theme={config.theme}>
          {balance.toFixed(2)} {config.currency}
        </BalanceAmount>
      </BalanceDisplay>

      <BetInputContainer>
        <BetInput
          theme={config.theme}
          type="number"
          value={betInput}
          onChange={(e) => handleBetInputChange(e.target.value)}
          placeholder={`Mise (${config.minBet}-${config.maxBet})`}
          min={config.minBet}
          max={config.maxBet}
          step="0.01"
          hasError={!!error}
          disabled={isDisabled}
        />
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </BetInputContainer>

      <BetIncrements>
        {config.betIncrements.map((increment) => (
          <IncrementButton
            key={increment}
            theme={config.theme}
            onClick={() => handleIncrementClick(increment)}
            disabled={isDisabled || currentBet + increment > config.maxBet || currentBet + increment > balance}
          >
            +{increment}
          </IncrementButton>
        ))}
      </BetIncrements>

      <BetIncrements style={{ marginTop: '12px' }}>
        <IncrementButton
          theme={config.theme}
          onClick={() => handleQuickBet(25)}
          disabled={isDisabled}
        >
          25%
        </IncrementButton>
        <IncrementButton
          theme={config.theme}
          onClick={() => handleQuickBet(50)}
          disabled={isDisabled}
        >
          50%
        </IncrementButton>
        <IncrementButton
          theme={config.theme}
          onClick={() => handleQuickBet(75)}
          disabled={isDisabled}
        >
          75%
        </IncrementButton>
        <IncrementButton
          theme={config.theme}
          onClick={() => handleQuickBet(100)}
          disabled={isDisabled}
        >
          100%
        </IncrementButton>
      </BetIncrements>

      <PlaceBetButton
        theme={config.theme}
        onClick={onPlaceBet}
        disabled={!canPlaceBet}
        style={{ marginTop: '20px' }}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          `Parier ${currentBet.toFixed(2)} ${config.currency}`
        )}
      </PlaceBetButton>
    </PanelContainer>
  );
};

export default BettingPanel;

