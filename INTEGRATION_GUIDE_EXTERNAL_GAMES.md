# 🎮 Guide d'Intégration pour Jeux Externes

Ce guide explique comment intégrer n'importe quel jeu React externe avec la plateforme 4win et le système de balance global.

## 📋 Prérequis

- Votre jeu doit être une application React
- Le jeu doit pouvoir être servi sur un port différent (ex: 3001, 3002, etc.)
- Le jeu doit être compatible avec les iframes

## 🔧 Étapes d'Intégration

### 1. **Copier les Services de Communication**

Copiez ces fichiers dans votre projet de jeu :

#### `src/services/CommunicationService.ts`
```typescript
// Copiez le contenu du fichier CommunicationService.ts créé ci-dessus
```

#### `src/components/BalanceDisplay.tsx`
```typescript
// Copiez le contenu du fichier BalanceDisplay.tsx créé ci-dessus
```

### 2. **Intégrer dans votre App.tsx**

```typescript
import React from 'react';
import communicationService from './services/CommunicationService';
import BalanceDisplay from './components/BalanceDisplay';

const App: React.FC = () => {
  // Votre logique de jeu existante...

  // Notifier le début d'une partie
  const startGame = () => {
    communicationService.onGameStart();
    // Votre logique de début de jeu...
  };

  // Notifier la fin d'une partie
  const endGame = (result: 'win' | 'lose' | 'draw', winAmount?: number) => {
    communicationService.onGameEnd(result, winAmount);
    // Votre logique de fin de jeu...
  };

  return (
    <div className="game-container">
      {/* Afficher le solde synchronisé */}
      <BalanceDisplay position="top-right" />
      
      {/* Votre interface de jeu existante */}
      <YourGameComponent />
    </div>
  );
};

export default App;
```

### 3. **Gérer les Mises**

```typescript
// Dans votre composant de jeu
const handleBet = (amount: number) => {
  // Vérifier si la mise peut être placée
  if (communicationService.placeBet(amount)) {
    // Mise acceptée, démarrer le jeu
    startGame();
  } else {
    // Solde insuffisant
    alert('Solde insuffisant');
  }
};

// Obtenir le solde actuel
const currentBalance = communicationService.getBalance();
```

### 4. **Gérer les Résultats**

```typescript
// Quand le joueur gagne
const handleWin = (winAmount: number) => {
  communicationService.onWin(winAmount);
  // Votre logique de gain...
};

// Quand le joueur perd
const handleLose = () => {
  const betAmount = communicationService.getCurrentBet();
  communicationService.onLose(betAmount);
  // Votre logique de perte...
};
```

## 🎯 Exemple Complet - Jeu de Cartes

```typescript
import React, { useState, useEffect } from 'react';
import communicationService from './services/CommunicationService';
import BalanceDisplay from './components/BalanceDisplay';

const CardGame: React.FC = () => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [betAmount, setBetAmount] = useState<number>(0);

  const startGame = () => {
    if (communicationService.placeBet(betAmount)) {
      communicationService.onGameStart();
      setGameState('playing');
      // Logique de jeu...
    }
  };

  const handleGameResult = (playerWins: boolean) => {
    if (playerWins) {
      const winAmount = betAmount * 2; // Exemple: gain du double
      communicationService.onWin(winAmount);
    } else {
      communicationService.onLose(betAmount);
    }
    
    communicationService.onGameEnd(playerWins ? 'win' : 'lose');
    setGameState('finished');
  };

  return (
    <div>
      <BalanceDisplay />
      
      {gameState === 'waiting' && (
        <div>
          <input 
            type="number" 
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            placeholder="Montant de la mise"
          />
          <button onClick={startGame}>Jouer</button>
        </div>
      )}
      
      {gameState === 'playing' && (
        <div>
          {/* Interface de jeu */}
          <button onClick={() => handleGameResult(true)}>Gagner</button>
          <button onClick={() => handleGameResult(false)}>Perdre</button>
        </div>
      )}
    </div>
  );
};

export default CardGame;
```

## 🔗 Configuration dans la Plateforme Principale

### 1. **Créer le Plugin**

```typescript
// src/plugins/games/VotreJeuPlugin.ts
import { GamePlugin } from '../../types/GamePlugin';

const VotreJeuPlugin: GamePlugin = {
  id: 'votre-jeu',
  name: 'Votre Jeu',
  description: 'Description de votre jeu',
  icon: '🎮',
  route: '/votre-jeu',
  type: 'iframe',
  isEnabled: true,
  iframeConfig: {
    src: 'http://localhost:3001', // Port de votre jeu
    allowFullscreen: true,
    sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups',
    title: 'Votre Jeu'
  },
  config: {
    minBet: 1,
    maxBet: 100,
    defaultBet: 10,
    betIncrements: [1, 5, 10, 25, 50],
    currency: 'EUR',
    features: ['balance-sync', 'betting'],
    rules: ['Règle 1', 'Règle 2'],
    audio: { enabled: true, volume: 0.5 },
    theme: { primaryColor: '#3b82f6', accentColor: '#1e40af' },
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

export default VotreJeuPlugin;
```

### 2. **Enregistrer le Plugin**

```typescript
// src/App.tsx
import VotreJeuPlugin from './plugins/games/VotreJeuPlugin';

// Dans useEffect
useEffect(() => {
  registerPlugin(LuckyJetPlugin);
  registerPlugin(DicePlugin);
  registerPlugin(TicTacToePlugin);
  registerPlugin(VotreJeuPlugin); // Nouveau jeu
}, [registerPlugin]);
```

## 🚀 Démarrage

### 1. **Démarrer votre jeu**
```bash
cd votre-jeu
npm start -- --port 3001
```

### 2. **Démarrer la plateforme**
```bash
cd 4win-platform
npm start
```

### 3. **Accéder au jeu**
- Plateforme: http://localhost:3000
- Votre jeu intégré: http://localhost:3000/votre-jeu

## 🔄 Communication Bidirectionnelle

### Messages du Jeu vers la Plateforme
- `REQUEST_BALANCE` - Demande le solde actuel
- `PLACE_BET` - Place une mise
- `GAME_STARTED` - Notifie le début d'une partie
- `GAME_ENDED` - Notifie la fin d'une partie
- `GAME_WON` - Notifie un gain
- `GAME_LOST` - Notifie une perte

### Messages de la Plateforme vers le Jeu
- `BALANCE_UPDATE` - Met à jour le solde
- `BET_PLACED` - Confirme une mise
- `GAME_START` - Démarre une partie
- `GAME_END` - Termine une partie
- `PONG` - Confirme la connexion

## 🎨 Personnalisation

### Position du BalanceDisplay
```typescript
<BalanceDisplay 
  position="top-left" 
  showConnectionStatus={false} 
/>
```

### Styles personnalisés
```typescript
const CustomBalanceDisplay = styled(BalanceDisplay)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
`;
```

## 🐛 Dépannage

### Problèmes courants

1. **BalanceDisplay ne s'affiche pas**
   - Vérifiez que `CommunicationService` est importé
   - Vérifiez la console pour les erreurs

2. **Communication ne fonctionne pas**
   - Vérifiez que le jeu est dans une iframe
   - Vérifiez les permissions CORS
   - Vérifiez la console pour les erreurs postMessage

3. **Balance ne se met pas à jour**
   - Vérifiez que `syncBalance()` est appelé
   - Vérifiez les événements `balanceUpdate`

## 📝 Notes Importantes

- Le solde est géré centralement par la plateforme
- Chaque jeu doit demander la permission avant de placer une mise
- La communication est asynchrone via postMessage
- Le BalanceDisplay se met à jour automatiquement
- La connexion est vérifiée périodiquement

## 🎯 Exemple de Déploiement

```bash
# 1. Construire votre jeu
cd votre-jeu
npm run build

# 2. Servir sur un port spécifique
npx serve -s build -l 3001

# 3. Mettre à jour l'URL dans le plugin
src: 'http://localhost:3001'
```

Votre jeu est maintenant intégré avec le système de balance global ! 🎉
