import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import communicationService from '../../services/CommunicationService';

interface BalanceDisplayProps {
  className?: string;
  showConnectionStatus?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const BalanceContainer = styled.div<{ position: string }>`
  position: fixed;
  z-index: 1000;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  ${props => {
    switch (props.position) {
      case 'top-right':
        return `
          top: 20px;
          right: 20px;
        `;
      case 'top-left':
        return `
          top: 20px;
          left: 20px;
        `;
      case 'bottom-right':
        return `
          bottom: 20px;
          right: 20px;
        `;
      case 'bottom-left':
        return `
          bottom: 20px;
          left: 20px;
        `;
      default:
        return `
          top: 20px;
          right: 20px;
        `;
    }
  }}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;

const BalanceAmount = styled.span`
  color: #00ff88;
  font-weight: bold;
  font-size: 16px;
  margin-left: 8px;
`;

const ConnectionStatus = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 12px;
  color: ${props => props.isConnected ? '#00ff88' : '#ff4444'};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.isConnected ? '#00ff88' : '#ff4444'};
    margin-right: 6px;
    animation: ${props => props.isConnected ? 'pulse' : 'none'} 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  className,
  showConnectionStatus = true,
  position = 'top-right'
}) => {
  const [balance, setBalance] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const storageKey = '4win_platform_balance';

  // Charge la balance depuis localStorage
  const loadBalanceFromStorage = (): number | null => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        return typeof data.balance === 'number' ? data.balance : null;
      }
    } catch (error) {
      console.error('Erreur lors du chargement du solde:', error);
    }
    return null;
  };

  useEffect(() => {
    // Écoute les mises à jour du solde via CommunicationService
    const handleBalanceUpdate = (data: { balance: number }) => {
      setBalance(data.balance);
    };

    // Écoute les changements de connexion
    const checkConnection = () => {
      setIsConnected(communicationService.isConnectedToParent());
    };

    // Écoute les changements de localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          if (data.balance !== balance) {
            setBalance(data.balance);
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation du solde:', error);
        }
      }
    };

    // Ajoute les écouteurs d'événements
    communicationService.addEventListener('balanceUpdate', handleBalanceUpdate);

    // Vérifie la connexion initiale
    checkConnection();

    // Met à jour le solde initial depuis CommunicationService
    setBalance(communicationService.getBalance());

    // Charge le solde depuis localStorage au démarrage
    const storedBalance = loadBalanceFromStorage();
    if (storedBalance !== null) {
      setBalance(storedBalance);
    }

    // Écoute les changements de localStorage
    window.addEventListener('storage', handleStorageChange);

    // Vérifie périodiquement la connexion
    const connectionInterval = setInterval(checkConnection, 5000);

    // Synchronise le solde périodiquement
    const balanceInterval = setInterval(() => {
      communicationService.syncBalance();
      
      // Synchronise aussi avec localStorage
      const storedBalance = loadBalanceFromStorage();
      if (storedBalance !== null && storedBalance !== balance) {
        setBalance(storedBalance);
      }
    }, 3000);

    return () => {
      clearInterval(connectionInterval);
      clearInterval(balanceInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [balance, storageKey]);

  return (
    <BalanceContainer className={className} position={position}>
      <div>
        Solde: <BalanceAmount>€{balance.toFixed(2)}</BalanceAmount>
      </div>
      {showConnectionStatus && (
        <ConnectionStatus isConnected={isConnected}>
          {isConnected ? 'Connecté' : 'Déconnecté'}
        </ConnectionStatus>
      )}
    </BalanceContainer>
  );
};

export default BalanceDisplay;
