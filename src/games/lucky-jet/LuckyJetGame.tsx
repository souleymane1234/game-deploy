import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import ControlPanel from './ControlPanel';
import GameDisplay from './GameDisplay';
import { motion } from 'framer-motion';
import BalanceService from '../../services/BalanceService';

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

interface LuckyJetGameProps {
  balance: number;
  setBalance: (balance: number) => void;
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
  gameHistory?: GameResult[];
  currentMultiplier?: number;
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



const LuckyJetGame: React.FC<LuckyJetGameProps> = ({ balance, setBalance }) => {
  // États locaux
  const [gameMode, setGameMode] = useState<'manual' | 'auto'>('manual');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [autoCashout, setAutoCashout] = useState<number>(2);
  const [profit, setProfit] = useState<number>(0);
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
  
  // États synchronisés via WebSocket
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.00);
  const [gameState, setGameState] = useState<'waiting' | 'running' | 'crashed'>('waiting');
  const [countdown, setCountdown] = useState<number>(10);
  const [gameTime, setGameTime] = useState<number>(0);
  const [crashPoint, setCrashPoint] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Optimisation pour les mises à jour fréquentes du multiplicateur
  const multiplierRef = useRef<number>(1.00);
  multiplierRef.current = currentMultiplier;
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'You', avatar: '👤', amount: 0, isPlaying: false, hasMultiplier: false },
    { id: 2, name: 'Alex', avatar: '🎮', amount: 500, isPlaying: true, hasMultiplier: false },
    { id: 3, name: 'Mia', avatar: '🦊', amount: 350, isPlaying: false, hasMultiplier: false },
    { id: 4, name: 'Leo', avatar: '🐯', amount: 1200, isPlaying: true, hasMultiplier: false },
    { id: 5, name: 'Zoe', avatar: '🦄', amount: 760, isPlaying: false, hasMultiplier: false },
    { id: 6, name: 'Noah', avatar: '🐼', amount: 980, isPlaying: true, hasMultiplier: false },
    { id: 7, name: 'Ava', avatar: '🦋', amount: 410, isPlaying: false, hasMultiplier: false },
    { id: 8, name: 'Liam', avatar: '🦁', amount: 1500, isPlaying: true, hasMultiplier: false },
    { id: 9, name: 'Emma', avatar: '🐱', amount: 220, isPlaying: false, hasMultiplier: false },
    { id: 10, name: 'Ethan', avatar: '🐶', amount: 890, isPlaying: true, hasMultiplier: false },
    { id: 11, name: 'Olivia', avatar: '🦉', amount: 1340, isPlaying: false, hasMultiplier: false },
    { id: 12, name: 'Lucas', avatar: '🐨', amount: 640, isPlaying: true, hasMultiplier: false },
    { id: 13, name: 'Chloe', avatar: '🦊', amount: 270, isPlaying: false, hasMultiplier: false },
    { id: 14, name: 'Mason', avatar: '🐵', amount: 1120, isPlaying: true, hasMultiplier: false },
    { id: 15, name: 'Sophia', avatar: '🦄', amount: 730, isPlaying: false, hasMultiplier: false },
    { id: 16, name: 'James', avatar: '🦁', amount: 990, isPlaying: true, hasMultiplier: false },
    { id: 17, name: 'Isla', avatar: '🕊️', amount: 455, isPlaying: false, hasMultiplier: false },
    { id: 18, name: 'Mateo', avatar: '🐯', amount: 1680, isPlaying: true, hasMultiplier: false },
    { id: 19, name: 'Ella', avatar: '🐣', amount: 305, isPlaying: false, hasMultiplier: false },
    { id: 20, name: 'Henry', avatar: '🐻', amount: 845, isPlaying: true, hasMultiplier: false },
    { id: 21, name: 'Aria', avatar: '🦋', amount: 1210, isPlaying: false, hasMultiplier: false },
    { id: 22, name: 'Jack', avatar: '🐼', amount: 690, isPlaying: true, hasMultiplier: false },
    { id: 23, name: 'Luna', avatar: '🌙', amount: 240, isPlaying: false, hasMultiplier: false },
    { id: 24, name: 'Logan', avatar: '🐺', amount: 1030, isPlaying: true, hasMultiplier: false },
    { id: 25, name: 'Maya', avatar: '🌸', amount: 520, isPlaying: false, hasMultiplier: false },
    { id: 26, name: 'Theo', avatar: '🦊', amount: 1320, isPlaying: true, hasMultiplier: false },
    { id: 27, name: 'Nora', avatar: '🦢', amount: 415, isPlaying: false, hasMultiplier: false },
    { id: 28, name: 'Owen', avatar: '🦅', amount: 870, isPlaying: true, hasMultiplier: false },
    { id: 29, name: 'Ivy', avatar: '🍀', amount: 275, isPlaying: false, hasMultiplier: false },
    { id: 30, name: 'Caleb', avatar: '🐗', amount: 940, isPlaying: true, hasMultiplier: false },
    { id: 31, name: 'Ruby', avatar: '💎', amount: 1260, isPlaying: false, hasMultiplier: false },
    { id: 32, name: 'Wyatt', avatar: '🐊', amount: 780, isPlaying: true, hasMultiplier: false }
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
  
  const wsRef = useRef<WebSocket | null>(null);

  // Totaux par manche
  const [totalBet, setTotalBet] = useState<number>(0);
  const [totalWon, setTotalWon] = useState<number>(0);

  // Connexion WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('wss://jeu-socket.onrender.com'); // Remplacez par votre URL WebSocket
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
              // Reset des totaux pour la nouvelle manche
              setTotalBet(0);
              setTotalWon(0);

              // Préparer une nouvelle répartition aléatoire des joueurs qui vont miser
              setPlayers(prev => prev.map(player => {
                if (player.id === 1) {
                  // Le joueur principal reste contrôlé par l'UI
                  return { ...player, isPlaying: player.isPlaying ?? false, hasMultiplier: false, multiplier: undefined, cashoutMultiplier: undefined };
                }
                // 45% de chance qu'un joueur participe à la prochaine manche
                const willPlay = Math.random() < 0.45;
                const randomAmount = willPlay ? (Math.floor(Math.random() * 2000) + 100) : player.amount;
                return {
                  ...player,
                  isPlaying: willPlay,
                  hasMultiplier: false,
                  multiplier: undefined,
                  cashoutMultiplier: undefined,
                  amount: willPlay ? randomAmount : player.amount
                };
              }));

              // Calculer le total parié après la répartition
              setTimeout(() => {
                setPlayers(prev => {
                  const sum = prev.filter(p => p.isPlaying && p.id !== 1).reduce((acc, p) => acc + p.amount, 0);
                  setTotalBet(sum + (isPlaying ? betAmount : 0));
                  return prev;
                });
              }, 0);
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
            // Mise à jour du multiplicateur seulement - optimisation pour éviter les re-renders inutiles
            const newMultiplier = message.data;
            if (Math.abs(newMultiplier - multiplierRef.current) > 0.001) {
              setCurrentMultiplier(newMultiplier);
            }
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

  // Mise à jour des joueurs simulés - optimisée pour de meilleures performances
  useEffect(() => {
    if (gameState === 'running') {
      const playerUpdateInterval = setInterval(() => {
        setPlayers(prev => {
          let hasChanges = false;
          let winningsToAdd = 0;
          let betsToAdd = 0;
          const updatedPlayers = prev.map(player => {
            if (player.id === 1) return player; // Ne pas modifier le joueur principal
            
            // Simulation de cashout aléatoire pour les autres joueurs
            if (player.isPlaying && Math.random() < 0.015) { // 1.5% de chance par seconde
              hasChanges = true;
              const cashoutMultiplier = multiplierRef.current + Math.random() * 0.5;
              winningsToAdd += Math.floor(player.amount * cashoutMultiplier);
              return {
                ...player,
                isPlaying: false,
                hasMultiplier: true,
                multiplier: cashoutMultiplier,
                cashoutMultiplier: cashoutMultiplier
              };
            }
            
            // Simulation de nouveaux joueurs qui rejoignent
            if (!player.isPlaying && Math.random() < 0.008) { // 0.8% de chance par seconde
              hasChanges = true;
              const randomAmount = Math.floor(Math.random() * 2000) + 100; // 100-2100 FCFA
              betsToAdd += randomAmount;
              return {
                ...player,
                isPlaying: true,
                hasMultiplier: false,
                amount: randomAmount
              };
            }
            
            return player;
          });
          
          if (winningsToAdd > 0) {
            setTotalWon(prevTotal => prevTotal + winningsToAdd);
          }
          if (betsToAdd > 0) {
            setTotalBet(prevTotal => prevTotal + betsToAdd);
          }

          return hasChanges ? updatedPlayers : prev;
        });
      }, 1500); // Mise à jour moins fréquente pour de meilleures performances

      return () => clearInterval(playerUpdateInterval);
    }
  }, [gameState]);

  // Fonction de cashout
  const handleCashout = useCallback(() => {
    if (gameState === 'running' && isPlaying) {
      const winnings = Math.floor(betAmount * currentMultiplier);
      balanceService.addWinnings(winnings);
      setProfit(winnings);
      setIsPlaying(false);
      setTotalWon(prev => prev + winnings);
      
      // Mettre à jour le joueur principal
      setPlayers(prev => prev.map(player => 
        player.id === 1 
          ? { ...player, isPlaying: false, hasMultiplier: true, multiplier: currentMultiplier, cashoutMultiplier: currentMultiplier }
          : player
      ));
    }
  }, [gameState, isPlaying, betAmount, currentMultiplier, balanceService]);

  // Fonction pour rejoindre le jeu
  const handleJoinGame = useCallback(() => {
    if (gameState === 'waiting' && balanceService.canAfford(betAmount)) {
      balanceService.placeBet(betAmount);
      setIsPlaying(true);
      setProfit(0);
      setTotalBet(prev => prev + Math.floor(betAmount));
      
      // Mettre à jour le joueur principal
      setPlayers(prev => prev.map(player => 
        player.id === 1 
          ? { ...player, isPlaying: true, hasMultiplier: false, amount: Math.floor(betAmount) }
          : player
      ));
    }
  }, [gameState, betAmount, balanceService]);

  // Fonction de cashout manuel
  const handleManualCashout = useCallback(() => {
    handleCashout();
  }, [handleCashout]);



  return (
    <GameContainer>

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
        totalBet={totalBet}
        totalWon={totalWon}
      />
    </GameContainer>
  );
};

export default LuckyJetGame;

