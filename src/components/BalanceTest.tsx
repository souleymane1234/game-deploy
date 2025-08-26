import React from 'react';
import styled from 'styled-components';
import BalanceService from '../services/BalanceService';

const TestContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  padding: 15px;
  border-radius: 10px;
  border: 2px solid #00ff88;
  z-index: 9999;
  color: white;
  font-family: 'Inter', sans-serif;
  min-width: 250px;
`;

const TestTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #00ff88;
  font-size: 14px;
`;

const TestButton = styled.button`
  background: #00ff88;
  color: black;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  margin: 5px;
  font-weight: bold;

  &:hover {
    background: #00cc66;
  }
`;

const BalanceInfo = styled.div`
  font-size: 12px;
  margin: 10px 0;
  color: #ffd700;
`;

const BalanceTest: React.FC = () => {
  const balanceService = BalanceService.getInstance();

  const handleTest = () => {
    balanceService.testBalanceSync();
  };

  const handleAdd100 = () => {
    balanceService.addBalance(100);
  };

  const handleSubtract50 = () => {
    balanceService.subtractBalance(50);
  };

  const handleReset = () => {
    balanceService.setBalance(10000);
  };

  return (
    <TestContainer>
      <TestTitle>🧪 Test Balance Centralisée</TestTitle>
      <BalanceInfo>
        Solde: {balanceService.getBalance().toLocaleString()} FCFA
      </BalanceInfo>
      <div>
        <TestButton onClick={handleTest}>Test Complet</TestButton>
        <TestButton onClick={handleAdd100}>+100</TestButton>
        <TestButton onClick={handleSubtract50}>-50</TestButton>
        <TestButton onClick={handleReset}>Reset</TestButton>
      </div>
    </TestContainer>
  );
};

export default BalanceTest;
