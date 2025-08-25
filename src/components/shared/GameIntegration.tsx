import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { GamePlugin, IframeConfig, IntegrationConfig } from '../../types/GamePlugin';

interface GameIntegrationProps {
  plugin: GamePlugin;
  balance: number;
  setBalance: (balance: number) => void;
}

const IframeContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  background: #000;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
`;

const ConnectionStatus = styled.div<{ isConnected: boolean }>`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${props => props.isConnected ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
    animation: ${props => props.isConnected ? 'pulse' : 'none'} 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  z-index: 999;
`;

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(239, 68, 68, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  z-index: 999;
  padding: 20px;
  text-align: center;
`;

const RetryButton = styled.button`
  background: white;
  color: #ef4444;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: #f3f4f6;
    transform: translateY(-2px);
  }
`;

const GameIntegration: React.FC<GameIntegrationProps> = ({ plugin, balance, setBalance }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const storageKey = '4win_platform_balance';

  // Sauvegarde la balance dans localStorage
  const saveBalanceToStorage = (newBalance: number) => {
    try {
      const data = {
        balance: newBalance,
        timestamp: Date.now(),
        platform: '4win'
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du solde:', error);
    }
  };

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
    // Sauvegarde la balance actuelle dans localStorage
    saveBalanceToStorage(balance);

    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;

      switch (type) {
        case 'GAME_READY':
          setIsConnected(true);
          setIsLoading(false);
          // Envoie le solde actuel au jeu
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'BALANCE_UPDATE',
              balance: balance
            }, '*');
          }
          break;

        case 'REQUEST_BALANCE':
          // Envoie le solde actuel au jeu
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'BALANCE_UPDATE',
              balance: balance
            }, '*');
          }
          break;

        case 'PLACE_BET':
          if (data.amount <= balance) {
            // Mise acceptée
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage({
                type: 'BET_PLACED',
                amount: data.amount
              }, '*');
            }
          } else {
            // Solde insuffisant
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage({
                type: 'BET_REJECTED',
                reason: 'insufficient_balance'
              }, '*');
            }
          }
          break;

        case 'GAME_STARTED':
          console.log('Jeu démarré avec mise:', data.betAmount);
          break;

        case 'GAME_ENDED':
          console.log('Jeu terminé:', data);
          break;

        case 'GAME_WON':
          if (data.winAmount) {
            const newBalance = balance + data.winAmount;
            setBalance(newBalance);
            saveBalanceToStorage(newBalance);
            console.log('Gain:', data.winAmount, 'Nouveau solde:', newBalance);
          }
          break;

        case 'GAME_LOST':
          if (data.loseAmount) {
            const newBalance = balance - data.loseAmount;
            setBalance(newBalance);
            saveBalanceToStorage(newBalance);
            console.log('Perte:', data.loseAmount, 'Nouveau solde:', newBalance);
          }
          break;

        case 'PING':
          // Répond au ping du jeu
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'PONG'
            }, '*');
          }
          break;
      }
    };

    const handleIframeLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleIframeError = () => {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage('Erreur lors du chargement du jeu');
    };

    window.addEventListener('message', handleMessage);
    
    // Écoute les changements de localStorage pour synchroniser
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

    window.addEventListener('storage', handleStorageChange);

    // Synchronise périodiquement avec localStorage
    const syncInterval = setInterval(() => {
      const storedBalance = loadBalanceFromStorage();
      if (storedBalance !== null && storedBalance !== balance) {
        setBalance(storedBalance);
      }
    }, 2000);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(syncInterval);
    };
  }, [balance, setBalance, storageKey]);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const iframeConfig = plugin.iframeConfig as IframeConfig;

  return (
    <IframeContainer>
      <StyledIframe
        ref={iframeRef}
        src={iframeConfig.src}
        title={iframeConfig.title || plugin.name}
        allowFullScreen={iframeConfig.allowFullscreen}
        sandbox={iframeConfig.sandbox}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage('Erreur lors du chargement du jeu');
        }}
      />
      
      <ConnectionStatus isConnected={isConnected}>
        {isConnected ? 'Connecté' : 'Déconnecté'}
      </ConnectionStatus>

      {isLoading && (
        <LoadingOverlay>
          Chargement du jeu...
        </LoadingOverlay>
      )}

      {hasError && (
        <ErrorOverlay>
          <div>Erreur de connexion</div>
          <div>{errorMessage}</div>
          <RetryButton onClick={handleRetry}>
            Réessayer
          </RetryButton>
        </ErrorOverlay>
      )}
    </IframeContainer>
  );
};

export default GameIntegration;
