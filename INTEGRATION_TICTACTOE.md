# Intégration TicTacToe - Système de Balance Centralisé

## 📋 Vue d'ensemble

Le jeu **TicTacToe** a été intégré à la plateforme 4win avec le système de balance centralisé. Il utilise maintenant le `BalanceService` pour toutes les opérations financières.

## 🎮 Configuration

### Port et URL
- **Port**: 9750
- **URL**: `http://localhost:9750`
- **Type**: Jeu externe (iframe)

### Configuration du Plugin
```typescript
{
  id: 'tic-tac-toe',
  name: 'Tic-Tac-Toe',
  type: 'iframe',
  iframeConfig: {
    src: 'http://localhost:9750',
    allowFullscreen: true,
    sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups'
  },
  config: {
    minBet: 100,
    maxBet: 100000,
    defaultBet: 1000,
    betIncrements: [100, 500, 1000, 2500, 5000, 10000],
    currency: 'FCFA'
  }
}
```

## 🔄 Communication avec la Plateforme

### Messages envoyés par TicTacToe
- `GAME_READY` - Jeu prêt à recevoir des instructions
- `REQUEST_BALANCE` - Demande du solde actuel
- `PLACE_BET` - Demande de placement d'une mise
- `GAME_STARTED` - Début d'une partie
- `GAME_ENDED` - Fin d'une partie
- `GAME_WON` - Victoire avec gains
- `GAME_LOST` - Défaite avec pertes
- `PING` - Vérification de connexion

### Messages reçus par TicTacToe
- `BALANCE_UPDATE` - Mise à jour du solde
- `BET_PLACED` - Mise acceptée
- `BET_REJECTED` - Mise rejetée
- `PONG` - Réponse au ping

## 💰 Gestion des Mises

### Placement de Mise
1. **Demande** : TicTacToe envoie `PLACE_BET` avec le montant
2. **Validation** : BalanceService vérifie le solde
3. **Réponse** : 
   - `BET_PLACED` si acceptée
   - `BET_REJECTED` si refusée

### Gains et Pertes
- **Victoire** : Envoi de `GAME_WON` avec le montant des gains
- **Défaite** : Envoi de `GAME_LOST` avec le montant perdu
- **Synchronisation** : Tous les jeux voient le nouveau solde

## 🛠️ Modifications Apportées

### 1. Service de Communication
- ✅ Suppression de la gestion locale du solde
- ✅ Utilisation du système centralisé
- ✅ Gestion des événements de mise acceptée/rejetée

### 2. Composant BettingPanel
- ✅ Écoute des événements de réponse
- ✅ Gestion des erreurs de mise
- ✅ Interface utilisateur améliorée

### 3. Configuration
- ✅ Monnaie changée en FCFA
- ✅ Montants adaptés au marché local
- ✅ Port configuré correctement

## 🚀 Démarrage

### Installation
```bash
# Dans 4win-platform
npm run install:all
```

### Démarrage
```bash
# Démarre tous les jeux
npm run dev

# Ou individuellement
npm run dev:tic-tac-toe
```

## 🔧 Fonctionnalités

### Système de Jeu
- **Bot IA** : Intelligence artificielle adaptative
- **Historique** : Suivi des parties
- **Séries** : Bonus pour les séries de victoires
- **Aide** : Système d'aide intégré

### Interface
- **Responsive** : Adapté mobile/desktop
- **Thème** : Design moderne et cohérent
- **Audio** : Effets sonores intégrés

## 📊 Statistiques

### Multiplicateurs
- **Victoire normale** : x2.0
- **Série de victoires** : x1.5 bonus
- **Difficulté adaptative** : x1.0

### Limites
- **Mise minimum** : 100 FCFA
- **Mise maximum** : 100,000 FCFA
- **Mises rapides** : 100, 500, 1000, 2500, 5000, 10000 FCFA

## ✅ Tests

### Vérifications
1. **Connexion** : Le jeu se connecte à la plateforme
2. **Balance** : Synchronisation du solde
3. **Mises** : Placement et validation
4. **Gains** : Ajout correct des gains
5. **Pertes** : Soustraction correcte des pertes

### Commandes de Test
```javascript
// Dans la console du navigateur
balanceService.testBalanceSync();
```

## 🔗 Intégration Complète

TicTacToe est maintenant **complètement intégré** au système de balance centralisé de la plateforme 4win. Toutes les opérations financières passent par le `BalanceService`, garantissant une synchronisation parfaite avec tous les autres jeux.

---

**Status** : ✅ **Intégré et Fonctionnel**
**Dernière mise à jour** : $(date)
