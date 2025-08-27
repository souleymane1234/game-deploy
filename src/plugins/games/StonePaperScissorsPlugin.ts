import { GamePlugin } from '@/types/GamePlugin';

export const StonePaperScissorsPlugin: GamePlugin = {
  id: 'stone-paper-scissors',
  name: 'Pierre-Papier-Ciseaux',
  description: 'Affrontez l\'ordinateur dans un duel classique de Pierre-Papier-Ciseaux avec des paris !',
  icon: '✂️',
  route: '/stone-paper-scissors',
  type: 'iframe',
  iframeConfig: {
    src: 'https://new-paper-cisor.vercel.app',
    width: '100%',
    height: '100%',
    allowFullscreen: true,
    sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups',
    title: 'Pierre-Papier-Ciseaux'
  },
  config: {
    minBet: 100,
    maxBet: 100000,
    defaultBet: 1000,
    betIncrements: [100, 500, 1000, 2500, 5000, 10000],
    currency: 'FCFA',
    features: [
      {
        id: 'sound',
        name: 'Son',
        description: 'Effets sonores pendant le jeu',
        isEnabled: true
      },
      {
        id: 'animations',
        name: 'Animations',
        description: 'Animations visuelles',
        isEnabled: true
      },
      {
        id: 'confetti',
        name: 'Confettis',
        description: 'Effet de confettis lors des victoires',
        isEnabled: true
      },
      {
        id: 'botOnly',
        name: 'Mode Bot',
        description: 'Jouer contre l\'ordinateur uniquement',
        isEnabled: true
      }
    ],
    rules: [
      {
        id: 'win',
        name: 'Victoire',
        description: 'Gagnez si vous battez l\'ordinateur',
        payoutMultiplier: 2
      },
      {
        id: 'lose',
        name: 'Défaite',
        description: 'Perdez si l\'ordinateur vous bat',
        payoutMultiplier: 1
      },
      {
        id: 'draw',
        name: 'Match nul',
        description: 'Match nul - remise en jeu',
        payoutMultiplier: 0
      }
    ],
    audio: {
      enabled: true,
      volume: 0.7,
      sounds: {
        win: 'confetti.mp3',
        lose: 'lose.mp3',
        start: 'start.mp3'
      }
    },
    theme: {
      primaryColor: '#4CAF50',
      secondaryColor: '#ffffff',
      backgroundColor: '#1a1a1a',
      accentColor: '#FF9800'
    },
    integration: {
      communicationProtocol: 'postMessage',
      balanceSync: true,
      eventHandlers: {
        onGameStart: 'GAME_STARTED',
        onGameEnd: 'GAME_ENDED',
        onBetPlaced: 'PLACE_BET',
        onWin: 'GAME_WON',
        onLose: 'GAME_LOST'
      },
      sharedData: {
        balance: true,
        userInfo: true,
        gameHistory: true
      }
    }
  },
  isEnabled: true
};
