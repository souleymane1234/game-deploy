import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import ControlPanel from './ControlPanel';
import GameDisplay from './GameDisplay';
import { motion } from 'framer-motion';

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

interface GameResult {
  multiplier: number;
  timestamp: number;
}

// Interface pour la session partagée via WebSocket
interface SharedGameSession {
  gameId: string;
  countdown: number;
  crashPoint: number;
  gameStatus: 'waiting' | 'running' | 'crashed';
  startTime: number;
  gameHistory?: GameResult[]; // Ajout de l'historique
  currentMultiplier?: number; // Ajout du multiplicateur actuel
}

const GameContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AudioControls = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
`;

const AudioButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #00ff88;
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #00ff88;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const LuckyJetGame: React.FC = () => {
  // États locaux
  const [gameMode, setGameMode] = useState<'manual' | 'auto'>('manual');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [autoCashout, setAutoCashout] = useState<number>(2);
  const [balance, setBalance] = useState<number>(10000);
  const [profit, setProfit] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.3);
  
  // États synchronisés via WebSocket
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.00);
  const [gameState, setGameState] = useState<'waiting' | 'running' | 'crashed'>('waiting');
  const [countdown, setCountdown] = useState<number>(10);
  const [gameTime, setGameTime] = useState<number>(0);
  const [crashPoint, setCrashPoint] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'You', avatar: '👤', amount: 0, isPlaying: false, hasMultiplier: false },
    { id: 2, name: 'Alex', avatar: '🎮', amount: 500, isPlaying: true, hasMultiplier: false }
  ]);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([
    { multiplier: 1.77, timestamp: Date.now() - 10000 },
    { multiplier: 3.32, timestamp: Date.now() - 20000 },
    { multiplier: 2.58, timestamp: Date.now() - 30000 },
    { multiplier: 1.60, timestamp: Date.now() - 40000 },
    { multiplier: 1.05, timestamp: Date.now() - 50000 },
    { multiplier: 1.90, timestamp: Date.now() - 60000 },
    { multiplier: 2.49, timestamp: Date.now() - 70000 },
    { multiplier: 5.72, timestamp: Date.now() - 80000 },
    { multiplier: 1.00, timestamp: Date.now() - 90000 },
    { multiplier: 1.00, timestamp: Date.now() - 100000 }
  ]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Connexion WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:3001');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connecté au serveur WebSocket');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'gameState') {
            const gameData: SharedGameSession = message.data;
            
            // Synchroniser l'état du jeu
            setCountdown(gameData.countdown);
            setCrashPoint(gameData.crashPoint);
            setGameState(gameData.gameStatus);
            
            // Synchroniser le multiplicateur depuis le serveur
            if (gameData.currentMultiplier) {
              setCurrentMultiplier(gameData.currentMultiplier);
            }
            
            // Synchroniser l'historique depuis le serveur
            if (gameData.gameHistory) {
              setGameHistory(gameData.gameHistory);
            }
            
            // Reset du multiplicateur si nouvelle partie
            if (gameData.gameStatus === 'waiting') {
              setCurrentMultiplier(1.00);
              setGameTime(0);
              setIsPlaying(false);
              setProfit(0);
            }
            
            // Gérer le crash - redémarrer automatiquement
            if (gameData.gameStatus === 'crashed') {
              // Reset des joueurs
              setPlayers(prev => prev.map(player => ({
                ...player,
                isPlaying: false,
                hasMultiplier: false,
                multiplier: undefined,
                cashoutMultiplier: undefined,
                amount: player.id === 1 ? 0 : player.amount
              })));
            }
          } else if (message.type === 'countdown') {
            // Mise à jour du décompte seulement
            setCountdown(message.data);
          } else if (message.type === 'multiplier') {
            // Mise à jour du multiplicateur seulement
            setCurrentMultiplier(message.data);
          }
        } catch (error) {
          console.error('Erreur parsing message WebSocket:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
      };

      ws.onclose = () => {
        console.log('Déconnecté du serveur WebSocket - Tentative de reconnexion...');
        // Reconnexion automatique après 2 secondes
        setTimeout(() => {
          if (wsRef.current === ws) { // Vérifier que c'est toujours la même connexion
            connectWebSocket();
          }
        }, 2000);
      };
    };

    // Démarrer la connexion
    connectWebSocket();

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Génération du point de crash avec probabilité réaliste
  const generateCrashPoint = useCallback(() => {
    const random = Math.random();
    if (random < 0.1) return 1.0; // 10% chance de crash immédiat
    if (random < 0.3) return 1.0 + Math.random() * 0.5; // 20% chance entre 1.0-1.5
    if (random < 0.6) return 1.5 + Math.random() * 1.0; // 30% chance entre 1.5-2.5
    if (random < 0.8) return 2.5 + Math.random() * 2.0; // 20% chance entre 2.5-4.5
    if (random < 0.95) return 4.5 + Math.random() * 5.0; // 15% chance entre 4.5-9.5
    return 9.5 + Math.random() * 20.5; // 5% chance entre 9.5-30.0
  }, []);

  // Initialisation - démarrer le jeu automatiquement
  useEffect(() => {
    // Plus besoin d'initialiser localement, le serveur gère tout
    // Le serveur envoie l'état initial via WebSocket
  }, []);

  // Audio management - joue en permanence
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
      
      // Gérer l'autoplay avec interaction utilisateur
      const playAudio = async () => {
        try {
          await audioRef.current!.play();
        } catch (error) {
          console.log('Audio autoplay blocked, will play on user interaction');
        }
      };
      
      playAudio();
    }
  }, [volume]);

  // Ajouter un gestionnaire pour démarrer l'audio au premier clic
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(console.error);
      }
      // Retirer l'écouteur après le premier clic
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Fonction pour signaler un crash au serveur
  const signalCrash = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'crash',
        data: { crashPoint }
      }));
    }
  }, [crashPoint]);

  // Vérification du crash
  useEffect(() => {
    if (gameState === 'running' && currentMultiplier >= crashPoint) {
      // Arrêter le multiplicateur exactement au point de crash
      setCurrentMultiplier(crashPoint);
      
      // Signaler le crash au serveur
      signalCrash();
      
      // Mettre à jour l'historique avec le point de crash exact
      setGameHistory(prev => [
        { multiplier: crashPoint, timestamp: Date.now() },
        ...prev.slice(0, 9) // Garder seulement les 10 derniers résultats
      ]);
      
      // Reset des joueurs
      setPlayers(prev => prev.map(player => ({
        ...player,
        isPlaying: false,
        hasMultiplier: false,
        multiplier: undefined,
        cashoutMultiplier: undefined,
        amount: player.id === 1 ? 0 : player.amount
      })));
    }
  }, [gameState, currentMultiplier, crashPoint, signalCrash]);

  // Gestion du cashout automatique
  useEffect(() => {
    if (gameState === 'running' && isPlaying && gameMode === 'auto' && currentMultiplier >= autoCashout) {
      handleCashout();
    }
  }, [gameState, isPlaying, gameMode, autoCashout, currentMultiplier]);

  // Mise à jour des joueurs simulés
  useEffect(() => {
    if (gameState === 'running') {
      const playerUpdateInterval = setInterval(() => {
        setPlayers(prev => prev.map(player => {
          if (player.id === 1) return player; // Ne pas modifier le joueur principal
          
          // Simulation de cashout aléatoire pour les autres joueurs
          if (player.isPlaying && Math.random() < 0.02) { // 2% de chance par seconde
            const cashoutMultiplier = currentMultiplier + Math.random() * 0.5;
            return {
              ...player,
              isPlaying: false,
              hasMultiplier: true,
              multiplier: cashoutMultiplier,
              cashoutMultiplier: cashoutMultiplier
            };
          }
          
          // Simulation de nouveaux joueurs qui rejoignent
          if (!player.isPlaying && Math.random() < 0.01) { // 1% de chance par seconde
            const randomAmount = Math.floor(Math.random() * 2000) + 100; // 100-2100 FCFA
            return {
              ...player,
              isPlaying: true,
              hasMultiplier: false,
              amount: randomAmount
            };
          }
          
          return player;
        }));
      }, 1000);

      return () => clearInterval(playerUpdateInterval);
    }
  }, [gameState, currentMultiplier]);

  // Fonction de cashout
  const handleCashout = useCallback(() => {
    if (gameState === 'running' && isPlaying) {
      const winnings = betAmount * currentMultiplier;
      setBalance(prev => prev + winnings);
      setProfit(winnings);
      setIsPlaying(false);
      
      // Mettre à jour le joueur principal
      setPlayers(prev => prev.map(player => 
        player.id === 1 
          ? { ...player, isPlaying: false, hasMultiplier: true, multiplier: currentMultiplier, cashoutMultiplier: currentMultiplier }
          : player
      ));
    }
  }, [gameState, isPlaying, betAmount, currentMultiplier]);

  // Fonction pour rejoindre le jeu
  const handleJoinGame = useCallback(() => {
    if (gameState === 'waiting' && balance >= betAmount) {
      setBalance(prev => prev - betAmount);
      setIsPlaying(true);
      setProfit(0);
      
      // Mettre à jour le joueur principal
      setPlayers(prev => prev.map(player => 
        player.id === 1 
          ? { ...player, isPlaying: true, hasMultiplier: false, amount: betAmount }
          : player
      ));
    }
  }, [gameState, balance, betAmount]);

  // Fonction de cashout manuel
  const handleManualCashout = useCallback(() => {
    handleCashout();
  }, [handleCashout]);

  return (
    <GameContainer>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/musics/casino-164235.mp3"
        preload="auto"
      />

      <GameDisplay
        currentMultiplier={currentMultiplier}
        gameState={gameState}
        countdown={countdown}
        gameHistory={gameHistory}
        gameTime={gameTime}
        crashPoint={crashPoint}
        isPlaying={isPlaying}
        onCashout={handleManualCashout}
      />

      <ControlPanel
        gameMode={gameMode}
        setGameMode={setGameMode}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        autoCashout={autoCashout}
        setAutoCashout={setAutoCashout}
        onJoinGame={handleJoinGame}
        onCashout={handleManualCashout}
        players={players}
        balance={balance}
        profit={profit}
        isPlaying={isPlaying}
        gameState={gameState}
      />
    </GameContainer>
  );
};

export default LuckyJetGame;
