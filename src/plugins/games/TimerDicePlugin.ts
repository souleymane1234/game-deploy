import { GamePlugin } from '../../types/GamePlugin';
import TimerDiceGame from '../../games/timer-dice/TimerDiceGame';

const TimerDicePlugin: GamePlugin = {
  id: 'timer-dice',
  name: 'Timer Dice',
  description: 'Jeu de dés avec timer et paris sur les faces',
  icon: '🎲',
  route: '/timer-dice',
  component: TimerDiceGame,
  type: 'internal',
  isEnabled: true,
  config: {
    minBet: 1,
    maxBet: 1000,
    defaultBet: 5,
    betIncrements: [1, 2, 5, 10, 25, 50],
    currency: 'EUR',
    features: [
      {
        id: 'timer-system',
        name: 'Système de timer',
        description: 'Timer pour placer les paris',
        isEnabled: true
      },
      {
        id: 'dice-faces',
        name: 'Faces de dés',
        description: 'Parier sur les faces 1-6',
        isEnabled: true
      },
      {
        id: 'quick-betting',
        name: 'Paris rapides',
        description: 'Interface de paris rapides',
        isEnabled: true
      }
    ],
    rules: [
      {
        id: 'dice-roll',
        name: 'Lancer de dés',
        description: 'Le dé est lancé après le timer',
        payoutMultiplier: 1.0
      },
      {
        id: 'face-betting',
        name: 'Paris sur faces',
        description: 'Parier sur la face qui va sortir',
        payoutMultiplier: 5.0
      }
    ],
    audio: {
      enabled: true,
      volume: 0.5,
      sounds: {
        'game-start': '/musics/casino-164235.mp3',
        'dice-roll': '/musics/dice-roll.mp3',
        'win': '/musics/win.mp3',
        'lose': '/musics/lose.mp3'
      }
    },
    theme: {
      primaryColor: '#00d4ff',
      secondaryColor: '#0099cc',
      backgroundColor: '#1e293b',
      accentColor: '#ffd700'
    }
  }
};

export default TimerDicePlugin;

