import { GamePlugin } from '../../types/GamePlugin';

const TicTacToePlugin: GamePlugin = {
  id: 'tic-tac-toe',
  name: 'Tic-Tac-Toe',
  description: 'Jeu de Tic-Tac-Toe étendu contre un bot intelligent',
  icon: '⭕',
  route: '/tic-tac-toe',
  type: 'iframe',
  isEnabled: true,
  iframeConfig: {
    src: 'https://new-tictac-xi.vercel.app', // Port du projet TicTacToe
    allowFullscreen: true,
    sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups',
    title: 'Tic Tac Toe'
  },
  config: {
    minBet: 100,
    maxBet: 100000,
    defaultBet: 1000,
    betIncrements: [100, 500, 1000, 2500, 5000, 10000],
    currency: 'FCFA',
    features: [
      {
        id: 'bot-ai',
        name: 'Bot Intelligent',
        description: 'Jouez contre un bot avec IA avancée',
        isEnabled: true
      },
      {
        id: 'game-history',
        name: 'Historique des parties',
        description: 'Consultez l\'historique de vos parties',
        isEnabled: true
      },
      {
        id: 'help-system',
        name: 'Système d\'aide',
        description: 'Guide et règles du jeu',
        isEnabled: true
      },
      {
        id: 'win-streak',
        name: 'Séries de victoires',
        description: 'Suivez vos séries de victoires',
        isEnabled: true
      }
    ],
    rules: [
      {
        id: 'basic-rules',
        name: 'Règles de base',
        description: 'Alignez 3 symboles identiques pour gagner',
        payoutMultiplier: 2.0
      },
      {
        id: 'win-streak-bonus',
        name: 'Bonus série de victoires',
        description: 'Bonus pour les séries de victoires consécutives',
        payoutMultiplier: 1.5
      },
      {
        id: 'bot-difficulty',
        name: 'Difficulté du bot',
        description: 'Le bot s\'adapte à votre niveau de jeu',
        payoutMultiplier: 1.0
      }
    ],
    audio: {
      enabled: true,
      volume: 0.7,
      sounds: {
        'move': '/musics/move.mp3',
        'win': '/musics/win.mp3',
        'lose': '/musics/lose.mp3'
      }
    },
    theme: {
      primaryColor: '#4f46e5',
      secondaryColor: '#7c3aed',
      backgroundColor: '#1e1b4b',
      accentColor: '#a855f7'
    },
    integration: {
      communicationProtocol: 'postMessage',
      balanceSync: true,
      eventHandlers: {
        onGameStart: 'GAME_STARTED',
        onGameEnd: 'GAME_ENDED',
        onBetPlaced: 'BET_PLACED',
        onWin: 'GAME_WON',
        onLose: 'GAME_LOST'
      },
      sharedData: {
        balance: true,
        userInfo: false,
        gameHistory: true
      }
    }
  }
};

export default TicTacToePlugin;
