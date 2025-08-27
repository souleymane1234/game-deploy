# Guide d'Intégration - TicTacToe

## 🎯 Vue d'ensemble

Ce guide explique comment tester l'intégration du jeu TicTacToe dans la plateforme 4win.

## 🚀 Installation et Démarrage

### 1. Installation des dépendances

```bash
# Installer toutes les dépendances (plateforme + TicTacToe)
npm run install:all
```

### 2. Démarrage des projets

#### Option A : Démarrage simultané (recommandé)
```bash
# Démarrer les deux projets en même temps
npm run dev
```

#### Option B : Démarrage séparé
```bash
# Terminal 1 - Plateforme principale
npm run dev:platform

# Terminal 2 - Jeu TicTacToe
npm run dev:tic-tac-toe
```

## 🌐 URLs des projets

- **Plateforme principale** : http://localhost:3000
- **Jeu TicTacToe** : http://localhost:9750
- **TicTacToe intégré** : http://localhost:3000/tic-tac-toe

## 🎮 Test de l'Intégration

### 1. Accéder au jeu intégré
1. Ouvrez http://localhost:3000
2. Cliquez sur le jeu "Tic Tac Toe" (icône ⭕)
3. Le jeu se charge dans un iframe

### 2. Vérifier la communication
- **Indicateur de connexion** : En haut à gauche du jeu, vous verrez un indicateur "Connecté/Déconnecté"
- **Affichage du solde** : Le solde de la plateforme s'affiche dans le jeu
- **Synchronisation** : Les changements de solde se synchronisent en temps réel

### 3. Tester le jeu
1. **Démarrer une partie** : Cliquez sur une case pour commencer
2. **Jouer contre le bot** : Le bot intelligent répond automatiquement
3. **Voir les résultats** : Les gains/pertes sont communiqués à la plateforme

## 🔧 Fonctionnalités Intégrées

### Communication Bidirectionnelle
- **Plateforme → Jeu** : Solde, configuration, confirmations
- **Jeu → Plateforme** : Résultats, événements de jeu, demandes

### Synchronisation du Solde
- Le solde de la plateforme s'affiche dans le jeu
- Les gains/pertes sont automatiquement synchronisés
- Indicateur visuel de la connexion

### Interface Adaptée
- Affichage du solde en temps réel
- Indicateur de statut de connexion
- Messages d'erreur en cas de problème

## 🐛 Dépannage

### Problème : Jeu ne se charge pas
```bash
# Vérifier que les deux projets sont démarrés
# Vérifier les ports 3000 et 9750
netstat -an | grep :3000
netstat -an | grep :9750
```

### Problème : Communication ne fonctionne pas
1. Vérifier la console du navigateur pour les erreurs
2. S'assurer que les deux projets sont sur les bons ports
3. Vérifier que le service de communication est initialisé

### Problème : Solde ne s'affiche pas
1. Vérifier l'indicateur de connexion dans le jeu
2. Recharger la page
3. Vérifier les logs de communication

## 📁 Structure des Fichiers

```
4win-platform/
├── src/
│   ├── plugins/games/TicTacToePlugin.ts    # Plugin d'intégration
│   └── components/shared/GameIntegration.tsx # Composant d'intégration
└── TicTacToe/
    ├── src/
    │   ├── services/communication.ts       # Service de communication
    │   ├── components/BalanceDisplay/      # Affichage du solde
    │   └── App.tsx                         # App modifiée
    └── webpack/webpack-consts.js           # Configuration port 9750
```

## 🔄 Prochaines Étapes

1. **Ajouter un système de paris** dans le jeu TicTacToe
2. **Améliorer l'interface** d'affichage du solde
3. **Ajouter des animations** pour les transitions
4. **Implémenter un historique** des parties
5. **Ajouter des statistiques** de jeu

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs de la console
2. Consulter la documentation du système de plugins
3. Tester l'intégration étape par étape
