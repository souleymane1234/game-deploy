import { GamePlugin } from '../../types/GamePlugin';
import LuckyJetGame from '../../games/lucky-jet/LuckyJetGame';

const LuckyJetPlugin: GamePlugin = {
  id: 'lucky-jet',
  name: 'Lucky Jet',
  description: 'Jeu de crash avec multiplicateur croissant',
  icon: '🚀',
  route: '/lucky-jet',
  component: LuckyJetGame,
  type: 'internal',
  isEnabled: true,
  config: {
    minBet: 1,
    maxBet: 10000,
    defaultBet: 10,
    betIncrements: [1, 5, 10, 25, 50, 100, 500, 1000],
    currency: 'EUR',
    features: [
      {
        id: 'auto-cashout',
        name: 'Auto Cashout',
        description: 'Retrait automatique à un multiplicateur défini',
        isEnabled: true,
        config: {
          defaultMultiplier: 2.0
        }
      },
      {
        id: 'sound-effects',
        name: 'Effets sonores',
        description: 'Sons pour les actions du jeu',
        isEnabled: true
      },
      {
        id: 'chat-system',
        name: 'Système de chat',
        description: 'Chat en temps réel avec les autres joueurs',
        isEnabled: true
      },
      {
        id: 'leaderboard',
        name: 'Classement',
        description: 'Affichage des meilleurs scores',
        isEnabled: true
      }
    ],
    rules: [
      {
        id: 'crash-multiplier',
        name: 'Multiplicateur de crash',
        description: 'Le multiplicateur augmente jusqu\'au crash',
        payoutMultiplier: 1.0
      },
      {
        id: 'cashout-timing',
        name: 'Timing de retrait',
        description: 'Retirez avant le crash pour gagner',
        payoutMultiplier: 1.0
      }
    ],
    audio: {
      enabled: true,
      volume: 0.7,
      sounds: {
        'game-start': '/musics/casino-164235.mp3',
        'crash': '/musics/crash.mp3',
        'cashout': '/musics/cashout.mp3',
        'win': '/musics/win.mp3'
      }
    },
    theme: {
      primaryColor: '#00ff88',
      secondaryColor: '#ff6b6b',
      backgroundColor: '#1a1a2e',
      accentColor: '#ffd700'
    }
  }
};

export default LuckyJetPlugin;
