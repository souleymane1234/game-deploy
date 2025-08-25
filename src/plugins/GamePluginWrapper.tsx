import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GamePluginProps, GameConfig } from '../types/GamePlugin';

interface GamePluginWrapperProps extends GamePluginProps {
  children: React.ReactNode;
  onGameStart?: () => void;
  onGameEnd?: (result: any) => void;
  onError?: (error: Error) => void;
}

const WrapperContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
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
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #00ff88;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(220, 38, 38, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  text-align: center;
  padding: 20px;
`;

const ErrorContent = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 30px;
  border-radius: 12px;
  max-width: 400px;
`;

const RetryButton = styled.button`
  background: #00ff88;
  color: black;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background: #00cc6a;
  }
`;

const GamePluginWrapper: React.FC<GamePluginWrapperProps> = ({
  children,
  gameConfig,
  onGameStart,
  onGameEnd,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'loading' | 'playing' | 'ended'>('idle');

  useEffect(() => {
    // Simuler un temps de chargement pour les ressources du jeu
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGameStart = () => {
    setGameState('playing');
    onGameStart?.();
  };

  const handleGameEnd = (result: any) => {
    setGameState('ended');
    onGameEnd?.(result);
  };

  const handleError = (error: Error) => {
    setError(error);
    onError?.(error);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setGameState('idle');
    
    // Recharger le jeu
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Gestionnaire d'erreurs global pour le wrapper
  useEffect(() => {
    const handleUnhandledError = (event: ErrorEvent) => {
      handleError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(new Error(event.reason));
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (error) {
    return (
      <WrapperContainer>
        <ErrorOverlay>
          <ErrorContent>
            <h2>Erreur de jeu</h2>
            <p>{error.message}</p>
            <RetryButton onClick={handleRetry}>
              Réessayer
            </RetryButton>
          </ErrorContent>
        </ErrorOverlay>
      </WrapperContainer>
    );
  }

  if (isLoading) {
    return (
      <WrapperContainer>
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer>
      {React.cloneElement(children as React.ReactElement, {
        ...props,
        gameConfig,
        onGameStart: handleGameStart,
        onGameEnd: handleGameEnd,
        onError: handleError,
        gameState
      })}
    </WrapperContainer>
  );
};

export default GamePluginWrapper;

