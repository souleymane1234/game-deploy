import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { GamePlugin, IframeConfig, IntegrationConfig } from '../../types/GamePlugin';
import BalanceService from '../../services/BalanceService';

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const balanceService = BalanceService.getInstance();



    useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;

      switch (type) {
        case 'GAME_READY':
          setIsLoading(false);
          // Envoie le solde actuel au jeu
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'BALANCE_UPDATE',
              data: { balance: balanceService.getBalance() }
            }, '*');
          }
          break;

        case 'REQUEST_BALANCE':
          // Envoie le solde actuel au jeu
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'BALANCE_UPDATE',
              data: { balance: balanceService.getBalance() }
            }, '*');
          }
          break;

        case 'PLACE_BET':
          const betResult = balanceService.handleGameMessage('PLACE_BET', data);
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: betResult.type,
              data: betResult.data
            }, '*');
          }
          break;

        case 'GAME_STARTED':
          console.log('Jeu démarré avec mise:', data.betAmount);
          break;

        case 'GAME_ENDED':
          console.log('Jeu terminé:', data);
          break;

        case 'GAME_WON':
          const winResult = balanceService.handleGameMessage('GAME_WON', data);
          if (winResult) {
            console.log('Gain traité:', winResult);
          }
          break;

        case 'GAME_LOST':
          const lossResult = balanceService.handleGameMessage('GAME_LOST', data);
          if (lossResult) {
            console.log('Perte traitée:', lossResult);
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

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [balanceService]);

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
