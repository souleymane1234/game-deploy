# Système de Plugins pour 4win Platform

## Vue d'ensemble

Le système de plugins permet d'ajouter facilement de nouveaux jeux à la plateforme sans modifier le code existant. Chaque jeu est encapsulé dans un plugin qui définit sa configuration, ses règles et son interface.

**Types de plugins supportés :**
- **Interne** : Jeux développés directement dans la plateforme
- **Externe** : Jeux React complets hébergés séparément et intégrés via iframe
- **Iframe** : Jeux externes avec communication bidirectionnelle

## Architecture

### 1. Interface GamePlugin

Tous les plugins doivent implémenter l'interface `GamePlugin` :

```typescript
interface GamePlugin {
  id: string;                    // Identifiant unique du jeu
  name: string;                  // Nom affiché du jeu
  description: string;           // Description du jeu
  icon: string;                  // Emoji ou icône du jeu
  route: string;                 // Route URL du jeu
  component?: React.ComponentType<GamePluginProps>; // Pour les jeux internes
  externalUrl?: string;          // Pour les jeux externes simples
  iframeConfig?: IframeConfig;   // Pour les jeux externes avec communication
  config: GameConfig;            // Configuration du jeu
  isEnabled: boolean;            // Si le jeu est activé
  type: 'internal' | 'external' | 'iframe'; // Type d'intégration
}
```

### 2. Configuration du jeu (GameConfig)

```typescript
interface GameConfig {
  minBet: number;                // Mise minimum
  maxBet: number;                // Mise maximum
  defaultBet: number;            // Mise par défaut
  betIncrements: number[];       // Incréments de mise disponibles
  currency: string;              // Devise utilisée
  features: GameFeature[];       // Fonctionnalités du jeu
  rules: GameRule[];             // Règles du jeu
  audio?: AudioConfig;           // Configuration audio
  theme?: ThemeConfig;           // Configuration du thème
  integration?: IntegrationConfig; // Configuration d'intégration (pour jeux externes)
}
```

## Types d'Intégration

### 1. Jeux Internes (type: 'internal')

Jeux développés directement dans la plateforme principale.

```typescript
const InternalGamePlugin: GamePlugin = {
  id: 'mon-jeu',
  name: 'Mon Jeu',
  type: 'internal',
  component: MonJeuComponent,
  // ... autres propriétés
};
```

### 2. Jeux Externes (type: 'external')

Jeux React hébergés séparément, intégrés via iframe simple.

```typescript
const ExternalGamePlugin: GamePlugin = {
  id: 'jeu-externe',
  name: 'Jeu Externe',
  type: 'external',
  externalUrl: 'https://mon-jeu.com',
  // ... autres propriétés
};
```

### 3. Jeux avec Communication (type: 'iframe')

Jeux externes avec communication bidirectionnelle via postMessage.

```typescript
const CommunicatingGamePlugin: GamePlugin = {
  id: 'jeu-communicant',
  name: 'Jeu Communiquant',
  type: 'iframe',
  iframeConfig: {
    src: 'http://localhost:3001',
    allowFullscreen: true,
    sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups'
  },
  config: {
    // ... configuration standard
    integration: {
      communicationProtocol: 'postMessage',
      balanceSync: true,
      eventHandlers: {
        onGameStart: 'GAME_STARTED',
        onBetPlaced: 'BET_PLACED',
        onWin: 'GAME_WON'
      }
    }
  }
};
```

## Intégration de Jeux React Externes

### Étape 1 : Préparer votre jeu React externe

Votre jeu React externe doit être configuré pour communiquer avec la plateforme principale :

```typescript
// Dans votre jeu React externe
useEffect(() => {
  // Écouter les messages de la plateforme parente
  const handleParentMessage = (event: MessageEvent) => {
    // Vérifier l'origine pour la sécurité
    if (event.origin !== 'http://localhost:3000') return;
    
    const { type, data } = event.data;
    
    switch (type) {
      case 'INIT_GAME':
        // Initialiser le jeu avec la configuration
        initializeGame(data.config);
        // Signaler que le jeu est prêt
        sendToParent({ type: 'GAME_READY' });
        break;
        
      case 'SET_BALANCE':
        // Mettre à jour le solde affiché
        updateBalance(data.balance);
        break;
        
      case 'BET_CONFIRMED':
        // Confirmer le pari
        confirmBet(data.amount);
        break;
        
      case 'BET_REJECTED':
        // Rejeter le pari
        rejectBet(data.reason);
        break;
    }
  };

  window.addEventListener('message', handleParentMessage);
  return () => window.removeEventListener('message', handleParentMessage);
}, []);

// Fonction pour envoyer des messages à la plateforme parente
const sendToParent = (message: any) => {
  if (window.parent) {
    window.parent.postMessage(message, 'http://localhost:3000');
  }
};

// Exemple d'utilisation lors d'un pari
const placeBet = (amount: number) => {
  sendToParent({
    type: 'BET_PLACED',
    amount: amount
  });
};

// Exemple lors d'un gain
const handleWin = (winAmount: number) => {
  sendToParent({
    type: 'GAME_RESULT',
    winAmount: winAmount
  });
};
```

### Étape 2 : Créer le plugin dans la plateforme principale

```typescript
// src/plugins/games/MonJeuExternePlugin.ts
import { GamePlugin } from '../../types/GamePlugin';

const MonJeuExternePlugin: GamePlugin = {
  id: 'mon-jeu-externe',
  name: 'Mon Jeu Externe',
  description: 'Jeu React externe avec communication',
  icon: '🎮',
  route: '/mon-jeu-externe',
  type: 'iframe',
  isEnabled: true,
  iframeConfig: {
    src: 'http://localhost:3001', // URL de votre jeu React externe
    allowFullscreen: true,
    sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups',
    title: 'Mon Jeu Externe'
  },
  config: {
    minBet: 1,
    maxBet: 1000,
    defaultBet: 10,
    betIncrements: [1, 5, 10, 25, 50, 100],
    currency: 'EUR',
    features: [
      {
        id: 'external-integration',
        name: 'Intégration externe',
        description: 'Jeu React externe intégré',
        isEnabled: true
      }
    ],
    rules: [
      {
        id: 'external-rules',
        name: 'Règles du jeu externe',
        description: 'Règles définies par le jeu externe',
        payoutMultiplier: 1.0
      }
    ],
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      backgroundColor: '#1e293b',
      accentColor: '#60a5fa'
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

export default MonJeuExternePlugin;
```

### Étape 3 : Enregistrer le plugin

```typescript
// Dans src/App.tsx
import MonJeuExternePlugin from './plugins/games/MonJeuExternePlugin';

useEffect(() => {
  registerPlugin(LuckyJetPlugin);
  registerPlugin(DicePlugin);
  registerPlugin(MonJeuExternePlugin); // Nouveau plugin externe
}, [registerPlugin]);
```

## Protocole de Communication

### Messages envoyés par la plateforme principale vers le jeu externe :

- `INIT_GAME` : Initialisation du jeu avec configuration
- `SET_BALANCE` : Mise à jour du solde
- `BET_CONFIRMED` : Confirmation d'un pari
- `BET_REJECTED` : Rejet d'un pari
- `BALANCE_UPDATE` : Mise à jour du solde

### Messages envoyés par le jeu externe vers la plateforme principale :

- `GAME_READY` : Le jeu est prêt à recevoir des instructions
- `BET_PLACED` : Un pari a été placé
- `GAME_RESULT` : Résultat d'une partie (gain/perte)
- `REQUEST_BALANCE` : Demande du solde actuel

## Sécurité

### Vérification d'origine
```typescript
// Dans le jeu externe
if (event.origin !== 'http://localhost:3000') return;

// Dans la plateforme principale
if (event.origin !== new URL(iframeConfig.src).origin) return;
```

### Configuration sandbox
```typescript
iframeConfig: {
  sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups'
}
```

## Bonnes Pratiques pour les Jeux Externes

1. **Communication asynchrone** : Utilisez des timeouts pour les messages critiques
2. **Gestion d'erreurs** : Gérez les cas où la communication échoue
3. **État local** : Gardez un état local dans le jeu externe
4. **Validation** : Validez toutes les données reçues
5. **Fallback** : Prévoyez un mode dégradé si la communication échoue

## Exemples de Plugins Existants

1. **LuckyJetPlugin** : Jeu interne de crash
2. **DicePlugin** : Jeu interne de dés
3. **CoinFlipPlugin** : Jeu interne de pile ou face
4. **ExternalGamePlugin** : Exemple de jeu externe

## Support

Pour toute question ou problème avec l'intégration de jeux externes, consultez les exemples existants ou contactez l'équipe de développement.
