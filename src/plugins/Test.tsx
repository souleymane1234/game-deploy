import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GamePlugin, PluginRegistry, GameConfig } from '../types/GamePlugin';

interface PluginManagerContextType {
  plugins: PluginRegistry;
  registerPlugin: (plugin: GamePlugin) => void;
  unregisterPlugin: (pluginId: string) => void;
  enablePlugin: (pluginId: string) => void;
  disablePlugin: (pluginId: string) => void;
  getPlugin: (pluginId: string) => GamePlugin | undefined;
  getEnabledPlugins: () => GamePlugin[];
  updatePluginConfig: (pluginId: string, config: Partial<GameConfig>) => void;
}

const PluginManagerContext = createContext<PluginManagerContextType | undefined>(undefined);

interface PluginManagerProviderProps {
  children: ReactNode;
}

// Définition des jeux par défaut
const defaultGames: GamePlugin[] = [
  // Jeux existants
  {
    id: 'coinflip',
    name: 'Coin Flip',
    description: 'Pile ou face ? Misez sur votre intuition et doublez vos gains !',
    icon: '🪙',
    route: '/coinflip',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 10,
      maxBet: 10000,
      defaultBet: 100,
      betIncrements: [10, 50, 100, 500, 1000],
      currency: 'XOF',
      features: [
        { id: 'autoplay', name: 'Auto Play', description: 'Jouer automatiquement', isEnabled: false },
        { id: 'sound', name: 'Son', description: 'Effets sonores', isEnabled: true }
      ],
      rules: [
        { id: 'heads', name: 'Face', description: 'Multiplier x2', payoutMultiplier: 2 },
        { id: 'tails', name: 'Pile', description: 'Multiplier x2', payoutMultiplier: 2 }
      ],
      theme: {
        primaryColor: '#fbbf24',
        secondaryColor: '#f59e0b',
        backgroundColor: '#0f172a',
        accentColor: '#eab308'
      }
    }
  },
  {
    id: 'dice',
    name: 'Dice Game',
    description: 'Lancez les dés et devinez le résultat. Un classique revisité !',
    icon: '🎲',
    route: '/dice',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 5,
      maxBet: 5000,
      defaultBet: 50,
      betIncrements: [5, 25, 50, 250, 500],
      currency: 'XOF',
      features: [
        { id: 'multipleDice', name: 'Multi Dés', description: 'Jouer avec plusieurs dés', isEnabled: true },
        { id: 'animations', name: 'Animations', description: 'Animations 3D', isEnabled: true }
      ],
      rules: [
        { id: 'exact', name: 'Nombre exact', description: 'Deviner le nombre exact', payoutMultiplier: 6 },
        { id: 'range', name: 'Plage', description: 'Deviner la plage', payoutMultiplier: 2.5 }
      ],
      theme: {
        primaryColor: '#22c55e',
        secondaryColor: '#16a34a',
        backgroundColor: '#0f172a',
        accentColor: '#4ade80'
      }
    }
  },

  // Nouveaux jeux internes
  {
    id: 'roulette',
    name: 'Roulette Européenne',
    description: 'La roulette classique avec un seul zéro. Misez sur vos numéros favoris !',
    icon: '🎡',
    route: '/roulette',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 25,
      maxBet: 25000,
      defaultBet: 250,
      betIncrements: [25, 100, 250, 1000, 2500],
      currency: 'XOF',
      features: [
        { id: 'statistics', name: 'Statistiques', description: 'Historique des numéros', isEnabled: true },
        { id: 'quickBets', name: 'Mises rapides', description: 'Mises prédéfinies', isEnabled: true }
      ],
      rules: [
        { id: 'straight', name: 'Plein', description: 'Un seul numéro', payoutMultiplier: 35 },
        { id: 'red_black', name: 'Rouge/Noir', description: 'Couleur', payoutMultiplier: 2 }
      ],
      theme: {
        primaryColor: '#dc2626',
        secondaryColor: '#991b1b',
        backgroundColor: '#0f172a',
        accentColor: '#ef4444'
      }
    }
  },
  {
    id: 'blackjack',
    name: 'Blackjack Classic',
    description: 'Le jeu de cartes le plus populaire. Battez le croupier sans dépasser 21 !',
    icon: '🃏',
    route: '/blackjack',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 50,
      maxBet: 15000,
      defaultBet: 500,
      betIncrements: [50, 200, 500, 1500, 3000],
      currency: 'XOF',
      features: [
        { id: 'insurance', name: 'Assurance', description: 'Protection contre le blackjack du croupier', isEnabled: true },
        { id: 'doubleDown', name: 'Doubler', description: 'Doubler la mise', isEnabled: true },
        { id: 'split', name: 'Séparer', description: 'Séparer les paires', isEnabled: true }
      ],
      rules: [
        { id: 'blackjack', name: 'Blackjack', description: '21 avec 2 cartes', payoutMultiplier: 2.5 },
        { id: 'win', name: 'Victoire', description: 'Plus proche de 21', payoutMultiplier: 2 }
      ],
      theme: {
        primaryColor: '#059669',
        secondaryColor: '#047857',
        backgroundColor: '#0f172a',
        accentColor: '#10b981'
      }
    }
  },
  {
    id: 'slots',
    name: 'Lucky Slots',
    description: 'Machine à sous avec 5 rouleaux et bonus. Tentez le jackpot !',
    icon: '🎰',
    route: '/slots',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 10,
      maxBet: 1000,
      defaultBet: 100,
      betIncrements: [10, 25, 50, 100, 200],
      currency: 'XOF',
      features: [
        { id: 'autoSpin', name: 'Tours automatiques', description: 'Mode automatique', isEnabled: true },
        { id: 'bonusRounds', name: 'Tours bonus', description: 'Mini-jeux bonus', isEnabled: true },
        { id: 'jackpot', name: 'Jackpot progressif', description: 'Jackpot qui augmente', isEnabled: true }
      ],
      rules: [
        { id: 'three_match', name: '3 symboles', description: 'Trois symboles identiques', payoutMultiplier: 5 },
        { id: 'five_match', name: '5 symboles', description: 'Cinq symboles identiques', payoutMultiplier: 100 }
      ],
      theme: {
        primaryColor: '#f59e0b',
        secondaryColor: '#d97706',
        backgroundColor: '#0f172a',
        accentColor: '#fbbf24'
      }
    }
  },
  {
    id: 'poker',
    name: 'Video Poker',
    description: 'Poker contre la machine. Formez la meilleure main possible !',
    icon: '🂡',
    route: '/poker',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 25,
      maxBet: 2500,
      defaultBet: 125,
      betIncrements: [25, 50, 125, 250, 500],
      currency: 'XOF',
      features: [
        { id: 'jokersWild', name: 'Jokers Wild', description: 'Jokers comme cartes wild', isEnabled: false },
        { id: 'doubleUp', name: 'Quitte ou double', description: 'Doubler les gains', isEnabled: true }
      ],
      rules: [
        { id: 'royalFlush', name: 'Quinte flush royale', description: 'As, Roi, Dame, Valet, 10 de même couleur', payoutMultiplier: 800 },
        { id: 'straightFlush', name: 'Quinte flush', description: 'Cinq cartes consécutives de même couleur', payoutMultiplier: 50 }
      ],
      theme: {
        primaryColor: '#7c3aed',
        secondaryColor: '#6d28d9',
        backgroundColor: '#0f172a',
        accentColor: '#a855f7'
      }
    }
  },
  {
    id: 'baccarat',
    name: 'Baccarat',
    description: 'Le jeu préféré des hautes mises. Banco, Punto ou Égalité ?',
    icon: '♠️',
    route: '/baccarat',
    type: 'internal',
    isEnabled: true,
    config: {
      minBet: 100,
      maxBet: 50000,
      defaultBet: 1000,
      betIncrements: [100, 500, 1000, 5000, 10000],
      currency: 'XOF',
      features: [
        { id: 'roadmaps', name: 'Tableaux de route', description: 'Historique des parties', isEnabled: true },
        { id: 'squeeze', name: 'Squeeze', description: 'Dévoilement lent des cartes', isEnabled: true }
      ],
      rules: [
        { id: 'player', name: 'Joueur', description: 'Mise sur le joueur', payoutMultiplier: 2 },
        { id: 'banker', name: 'Banque', description: 'Mise sur la banque', payoutMultiplier: 1.95 },
        { id: 'tie', name: 'Égalité', description: 'Mise sur l\'égalité', payoutMultiplier: 9 }
      ],
      theme: {
        primaryColor: '#1e40af',
        secondaryColor: '#1e3a8a',
        backgroundColor: '#0f172a',
        accentColor: '#3b82f6'
      }
    }
  },

  // Jeux en développement (disabled)
  {
    id: 'crash',
    name: 'Crash Game',
    description: '🚧 EN DÉVELOPPEMENT - Regardez le multiplicateur grimper et encaissez avant le crash !',
    icon: '🚀',
    route: '/crash',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 10,
      maxBet: 10000,
      defaultBet: 100,
      betIncrements: [10, 50, 100, 500, 1000],
      currency: 'XOF',
      features: [
        { id: 'autoCashout', name: 'Retrait automatique', description: 'Retrait automatique à un multiplicateur défini', isEnabled: true }
      ],
      rules: [
        { id: 'multiplier', name: 'Multiplicateur', description: 'Gain = mise × multiplicateur au moment du retrait', payoutMultiplier: 0 }
      ],
      theme: {
        primaryColor: '#ff6b6b',
        secondaryColor: '#ee5a52',
        backgroundColor: '#0f172a',
        accentColor: '#ff7979'
      }
    }
  },
  {
    id: 'mines',
    name: 'Mines',
    description: '🚧 EN DÉVELOPPEMENT - Dévoilez les cases sans tomber sur une mine !',
    icon: '💣',
    route: '/mines',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 5,
      maxBet: 5000,
      defaultBet: 50,
      betIncrements: [5, 25, 50, 250, 500],
      currency: 'XOF',
      features: [
        { id: 'customMines', name: 'Nombre de mines personnalisé', description: 'Choisir le nombre de mines', isEnabled: true }
      ],
      rules: [
        { id: 'safe', name: 'Case sûre', description: 'Multiplicateur augmente avec chaque case sûre', payoutMultiplier: 0 }
      ],
      theme: {
        primaryColor: '#4338ca',
        secondaryColor: '#3730a3',
        backgroundColor: '#0f172a',
        accentColor: '#6366f1'
      }
    }
  },

  // Jeux externes (iframe)
  {
    id: 'sweet_bonanza',
    name: 'Sweet Bonanza',
    description: 'La slot Pragmatic Play la plus populaire avec des multiplicateurs énormes !',
    icon: '🍭',
    route: '/sweet-bonanza',
    type: 'iframe',
    externalUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=USD&gameSymbol=vs20fruitss',
    isEnabled: true,
    iframeConfig: {
      src: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=USD&gameSymbol=vs20fruitss',
      width: '100%',
      height: '600px',
      allowFullscreen: true,
      sandbox: 'allow-scripts allow-same-origin allow-forms',
      title: 'Sweet Bonanza'
    },
    config: {
      minBet: 20,
      maxBet: 10000,
      defaultBet: 200,
      betIncrements: [20, 100, 200, 1000, 2000],
      currency: 'XOF',
      features: [
        { id: 'tumble', name: 'Tumble Feature', description: 'Les symboles gagnants disparaissent', isEnabled: true },
        { id: 'freeSpins', name: 'Tours gratuits', description: 'Déclenchés par 4+ scatters', isEnabled: true }
      ],
      rules: [
        { id: 'scatter', name: 'Scatter', description: '4+ scatters déclenchent les free spins', payoutMultiplier: 0 }
      ],
      theme: {
        primaryColor: '#ec4899',
        secondaryColor: '#db2777',
        backgroundColor: '#0f172a',
        accentColor: '#f472b6'
      },
      integration: {
        communicationProtocol: 'postMessage',
        balanceSync: true,
        sharedData: {
          balance: true,
          userInfo: false,
          gameHistory: true
        }
      }
    }
  },
  {
    id: 'gates_olympus',
    name: 'Gates of Olympus',
    description: 'Rejoignez Zeus dans cette aventure épique avec des multiplicateurs divins !',
    icon: '⚡',
    route: '/gates-olympus',
    type: 'iframe',
    externalUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=USD&gameSymbol=vs20olympgate',
    isEnabled: true,
    iframeConfig: {
      src: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=en&cur=USD&gameSymbol=vs20olympgate',
      width: '100%',
      height: '600px',
      allowFullscreen: true,
      sandbox: 'allow-scripts allow-same-origin allow-forms',
      title: 'Gates of Olympus'
    },
    config: {
      minBet: 20,
      maxBet: 12500,
      defaultBet: 200,
      betIncrements: [20, 100, 200, 1250, 2500],
      currency: 'XOF',
      features: [
        { id: 'ante', name: 'Ante Bet', description: 'Augmente les chances de free spins', isEnabled: true },
        { id: 'buyBonus', name: 'Acheter bonus', description: 'Acheter directement les free spins', isEnabled: true }
      ],
      rules: [
        { id: 'multiplier', name: 'Multiplicateurs Zeus', description: 'Multiplicateurs aléatoires jusqu\'à x500', payoutMultiplier: 0 }
      ],
      theme: {
        primaryColor: '#facc15',
        secondaryColor: '#eab308',
        backgroundColor: '#0f172a',
        accentColor: '#fde047'
      },
      integration: {
        communicationProtocol: 'postMessage',
        balanceSync: true,
        sharedData: {
          balance: true,
          userInfo: false,
          gameHistory: true
        }
      }
    }
  },
  {
    id: 'book_of_dead',
    name: 'Book of Dead',
    description: '🚧 EN DÉVELOPPEMENT - Explorez l\'Égypte ancienne avec Rich Wilde !',
    icon: '📚',
    route: '/book-of-dead',
    type: 'external',
    externalUrl: 'https://example.com/book-of-dead',
    isEnabled: false,
    config: {
      minBet: 10,
      maxBet: 5000,
      defaultBet: 100,
      betIncrements: [10, 50, 100, 500, 1000],
      currency: 'XOF',
      features: [
        { id: 'expanding', name: 'Symboles extensibles', description: 'Symboles qui s\'étendent sur toute la colonne', isEnabled: true }
      ],
      rules: [
        { id: 'book', name: 'Livre', description: 'Scatter et wild combinés', payoutMultiplier: 0 }
      ],
      theme: {
        primaryColor: '#92400e',
        secondaryColor: '#78350f',
        backgroundColor: '#0f172a',
        accentColor: '#d97706'
      }
    }
  },

  // Jeux de table classiques
  {
    id: 'sic_bo',
    name: 'Sic Bo',
    description: '🚧 EN DÉVELOPPEMENT - Le jeu de dés asiatique traditionnel !',
    icon: '🎯',
    route: '/sic-bo',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 25,
      maxBet: 5000,
      defaultBet: 125,
      betIncrements: [25, 50, 125, 500, 1000],
      currency: 'XOF',
      features: [
        { id: 'combo', name: 'Mises combinées', description: 'Plusieurs mises en même temps', isEnabled: true }
      ],
      rules: [
        { id: 'big', name: 'Grand', description: 'Total 11-17', payoutMultiplier: 2 },
        { id: 'small', name: 'Petit', description: 'Total 4-10', payoutMultiplier: 2 }
      ],
      theme: {
        primaryColor: '#dc2626',
        secondaryColor: '#b91c1c',
        backgroundColor: '#0f172a',
        accentColor: '#f87171'
      }
    }
  },
  {
    id: 'teen_patti',
    name: 'Teen Patti',
    description: '🚧 EN DÉVELOPPEMENT - Le poker indien traditionnel !',
    icon: '🕉️',
    route: '/teen-patti',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 50,
      maxBet: 10000,
      defaultBet: 250,
      betIncrements: [50, 125, 250, 1000, 2500],
      currency: 'XOF',
      features: [
        { id: 'blind', name: 'Jeu aveugle', description: 'Jouer sans voir ses cartes', isEnabled: true },
        { id: 'sidebet', name: 'Mises annexes', description: 'Mises supplémentaires', isEnabled: true }
      ],
      rules: [
        { id: 'trail', name: 'Trail', description: 'Trois cartes identiques', payoutMultiplier: 50 },
        { id: 'sequence', name: 'Séquence', description: 'Trois cartes consécutives', payoutMultiplier: 5 }
      ],
      theme: {
        primaryColor: '#f97316',
        secondaryColor: '#ea580c',
        backgroundColor: '#0f172a',
        accentColor: '#fb923c'
      }
    }
  },
  {
    id: 'andar_bahar',
    name: 'Andar Bahar',
    description: '🚧 EN DÉVELOPPEMENT - Jeu de cartes indien simple et excitant !',
    icon: '🃖',
    route: '/andar-bahar',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 25,
      maxBet: 7500,
      defaultBet: 250,
      betIncrements: [25, 100, 250, 750, 1500],
      currency: 'XOF',
      features: [
        { id: 'prediction', name: 'Prédictions', description: 'Prédire le nombre de cartes', isEnabled: true }
      ],
      rules: [
        { id: 'andar', name: 'Andar', description: 'Première carte du côté Andar', payoutMultiplier: 1.9 },
        { id: 'bahar', name: 'Bahar', description: 'Première carte du côté Bahar', payoutMultiplier: 2 }
      ],
      theme: {
        primaryColor: '#059669',
        secondaryColor: '#047857',
        backgroundColor: '#0f172a',
        accentColor: '#34d399'
      }
    }
  },
  {
    id: 'dragon_tiger',
    name: 'Dragon Tiger',
    description: '🚧 EN DÉVELOPPEMENT - Le jeu de comparaison de cartes le plus simple !',
    icon: '🐉',
    route: '/dragon-tiger',
    type: 'internal',
    isEnabled: false,
    config: {
      minBet: 50,
      maxBet: 15000,
      defaultBet: 500,
      betIncrements: [50, 200, 500, 1500, 3000],
      currency: 'XOF',
      features: [
        { id: 'suited', name: 'Mises couleur', description: 'Miser sur la couleur des cartes', isEnabled: true }
      ],
      rules: [
        { id: 'dragon', name: 'Dragon', description: 'Dragon gagne', payoutMultiplier: 2 },
        { id: 'tiger', name: 'Tiger', description: 'Tiger gagne', payoutMultiplier: 2 },
        { id: 'tie', name: 'Égalité', description: 'Cartes identiques', payoutMultiplier: 8 }
      ],
      theme: {
        primaryColor: '#dc2626',
        secondaryColor: '#b91c1c',
        backgroundColor: '#0f172a',
        accentColor: '#f87171'
      }
    }
  }
];

export const PluginManagerProvider: React.FC<PluginManagerProviderProps> = ({ children }) => {
  const [plugins, setPlugins] = useState<PluginRegistry>({});

  // Initialiser avec les jeux par défaut
  useEffect(() => {
    // Au lieu d'utiliser localStorage, on initialise directement avec nos jeux
    const initialPlugins: PluginRegistry = {};
    defaultGames.forEach(game => {
      initialPlugins[game.id] = game;
    });
    
    console.log('PluginManager - Initialisation avec les jeux par défaut:', Object.keys(initialPlugins));
    setPlugins(initialPlugins);
  }, []);

  const registerPlugin = useCallback((plugin: GamePlugin) => {
    console.log('PluginManager - Enregistrement du plugin:', plugin.id);
    setPlugins(prev => ({
      ...prev,
      [plugin.id]: plugin
    }));
  }, []);

  const unregisterPlugin = useCallback((pluginId: string) => {
    setPlugins(prev => {
      const newPlugins = { ...prev };
      delete newPlugins[pluginId];
      return newPlugins;
    });
  }, []);

  const enablePlugin = useCallback((pluginId: string) => {
    setPlugins(prev => ({
      ...prev,
      [pluginId]: {
        ...prev[pluginId],
        isEnabled: true
      }
    }));
  }, []);

  const disablePlugin = useCallback((pluginId: string) => {
    setPlugins(prev => ({
      ...prev,
      [pluginId]: {
        ...prev[pluginId],
        isEnabled: false
      }
    }));
  }, []);

  const getPlugin = useCallback((pluginId: string) => {
    return plugins[pluginId];
  }, [plugins]);

  const getEnabledPlugins = useCallback(() => {
    console.log('PluginManager - Requête pour les plugins activés');
    console.log('PluginManager - Tous les plugins:', Object.keys(plugins));
    const enabledPlugins = Object.values(plugins).filter(plugin => plugin.isEnabled);
    console.log('PluginManager - Plugins activés trouvés:', enabledPlugins.map(p => p.id));
    console.log('PluginManager - Détails des plugins:', plugins);
    return enabledPlugins;
  }, [plugins]);

  const updatePluginConfig = useCallback((pluginId: string, config: Partial<GameConfig>) => {
    setPlugins(prev => ({
      ...prev,
      [pluginId]: {
        ...prev[pluginId],
        config: {
          ...prev[pluginId].config,
          ...config
        }
      }
    }));
  }, []);

  const value: PluginManagerContextType = {
    plugins,
    registerPlugin,
    unregisterPlugin,
    enablePlugin,
    disablePlugin,
    getPlugin,
    getEnabledPlugins,
    updatePluginConfig
  };

  return (
    <PluginManagerContext.Provider value={value}>
      {children}
    </PluginManagerContext.Provider>
  );
};

export const usePluginManagertest = () => {
  const context = useContext(PluginManagerContext);
  if (context === undefined) {
    throw new Error('usePluginManager must be used within a PluginManagerProvider');
  }
  return context;
};