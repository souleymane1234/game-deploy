import { GamePlugin } from '../../types/GamePlugin';
import DiceGame from '../../games/dice/DiceGame';

const DicePlugin: GamePlugin = {
  id: 'dice',
  name: 'GuessNumber',
  description: 'Devinez le nombre et gagnez des gains multipliés !',
  icon: '🎯',
  route: '/dice',
  component: DiceGame,
  type: 'internal',
  isEnabled: true,
  config: {
    minBet: 0.1,
    maxBet: 5000,
    defaultBet: 1,
    betIncrements: [0.1, 0.5, 1, 5, 10, 25, 50, 100, 500],
    currency: 'FCFA',
    features: [
      {
        id: 'dice-animation',
        name: 'Animation de dés',
        description: 'Animations fluides pour le lancer de dés',
        isEnabled: true
      },
      {
        id: 'bet-history',
        name: 'Historique des paris',
        description: 'Affichage de l\'historique des paris',
        isEnabled: true,
        config: {
          maxHistoryItems: 50
        }
      },
      {
        id: 'quick-bet',
        name: 'Paris rapides',
        description: 'Boutons de paris rapides',
        isEnabled: true
      },
      {
        id: 'statistics',
        name: 'Statistiques',
        description: 'Statistiques de jeu détaillées',
        isEnabled: true
      }
    ],
    rules: [
      {
        id: 'dice-over',
        name: 'Dés au-dessus de',
        description: 'Gagnez si le résultat est supérieur à votre choix',
        payoutMultiplier: 0.99
      },
      {
        id: 'dice-under',
        name: 'Dés en-dessous de',
        description: 'Gagnez si le résultat est inférieur à votre choix',
        payoutMultiplier: 0.99
      },
      {
        id: 'exact-number',
        name: 'Nombre exact',
        description: 'Gagnez si vous devinez le nombre exact',
        payoutMultiplier: 35.0
      }
    ],
    audio: {
      enabled: true,
      volume: 0.5,
      sounds: {
        'dice-roll': '/musics/dice-roll.mp3',
        'win': '/musics/win.mp3',
        'lose': '/musics/lose.mp3',
        'button-click': '/musics/click.mp3'
      }
    },
    theme: {
      primaryColor: '#ffd700',
      secondaryColor: '#4a7c59',
      backgroundColor: '#2d5016',
      accentColor: '#ff6b6b'
    }
  }
};

export default DicePlugin;
