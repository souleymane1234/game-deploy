# 🎮 Intégration Stone-Paper-Scissors avec 4win Platform

## ✅ Intégration Terminée

Le jeu Stone-Paper-Scissors a été intégré avec succès dans la plateforme 4win comme jeu externe.

## 🚀 Comment Démarrer

### Option 1: Démarrage Automatique (Recommandé)
```bash
# Dans le dossier 4win-platform
npm run dev
```

### Option 2: Démarrage Manuel
```bash
# Terminal 1 - Plateforme 4win
cd 4win-platform
npm start

# Terminal 2 - Jeu Stone-Paper-Scissors
cd Stone-paper-scissors
npm start
```

## 🌐 URLs d'Accès

- **Plateforme 4win**: http://localhost:3000
- **Jeu Stone-Paper-Scissors**: http://localhost:3001
- **Jeu intégré**: http://localhost:3000/stone-paper-scissors

## 🎯 Fonctionnalités Intégrées

### ✅ Communication Bidirectionnelle
- Synchronisation du solde en temps réel
- Gestion des mises via la plateforme
- Notifications de début/fin de partie
- Gestion des gains et pertes

### ✅ Interface Utilisateur
- Affichage du solde en haut à droite
- Indicateur de connexion avec la plateforme
- Interface de mise avant de commencer le jeu
- Validation du solde avant placement de mise

### ✅ Système de Mises
- Mise minimale: 1€
- Mise maximale: 1000€
- Mise par défaut: 10€
- Validation automatique du solde

## 🔧 Modifications Apportées

### Dans Stone-Paper-Scissors
1. **Services de Communication** (`src/services/CommunicationService.ts`)
   - Gestion des messages postMessage
   - Synchronisation du solde
   - Communication avec la plateforme parente

2. **Affichage du Solde** (`src/components/BalanceDisplay.jsx`)
   - Composant réutilisable
   - Indicateur de connexion
   - Styles personnalisables

3. **Intégration du Jeu** (`src/components/game.jsx`)
   - Interface de mise avant le jeu
   - Notifications de gains/pertes
   - Validation du solde

4. **Configuration** (`package.json`)
   - Port de démarrage: 3001
   - Scripts de développement

### Dans 4win Platform
1. **Plugin Configuré** (`src/plugins/games/StonePaperScissorsPlugin.ts`)
   - URL: http://localhost:3001
   - Configuration complète du jeu
   - Intégration avec le système de plugins

2. **Enregistrement du Plugin** (`src/App.tsx`)
   - Plugin ajouté au système
   - Routes automatiquement générées

3. **Scripts de Démarrage** (`package.json`)
   - Commande `npm run dev` pour démarrer les deux applications
   - Scripts séparés pour chaque application

## 🎮 Comment Jouer

1. **Accéder au jeu**: http://localhost:3000/stone-paper-scissors
2. **Placer une mise**: Entrez le montant souhaité (1-1000€)
3. **Commencer le jeu**: Cliquez sur "Commencer le jeu"
4. **Jouer**: Choisissez pierre, papier ou ciseaux
5. **Résultat**: Le solde se met à jour automatiquement

## 🔄 Communication Technique

### Messages du Jeu vers la Plateforme
- `GAME_READY` - Jeu prêt
- `PLACE_BET` - Demande de placement de mise
- `GAME_STARTED` - Début de partie
- `GAME_ENDED` - Fin de partie
- `GAME_WON` - Victoire
- `GAME_LOST` - Défaite
- `REQUEST_BALANCE` - Demande du solde
- `PING` - Vérification de connexion

### Messages de la Plateforme vers le Jeu
- `BALANCE_UPDATE` - Mise à jour du solde
- `BET_PLACED` - Confirmation de mise
- `PONG` - Réponse au ping

## 🐛 Dépannage

### Problème: Le jeu ne se charge pas
```bash
# Vérifier que les deux applications sont démarrées
# Vérifier les ports 3000 et 3001
netstat -an | findstr :3000
netstat -an | findstr :3001
```

### Problème: Le solde ne s'affiche pas
- Vérifier la console du navigateur
- S'assurer que le jeu est dans une iframe
- Vérifier les permissions CORS

### Problème: Les mises ne fonctionnent pas
- Vérifier que le solde est suffisant
- Vérifier la communication postMessage
- Redémarrer les applications

## 📝 Notes Importantes

- Le jeu fonctionne uniquement dans une iframe
- La communication est asynchrone via postMessage
- Le solde est géré centralement par la plateforme
- Les gains sont du double de la mise (victoire)
- Les pertes correspondent au montant de la mise

## 🎉 Statut

✅ **Intégration complète et fonctionnelle**
✅ **Communication bidirectionnelle active**
✅ **Système de mises intégré**
✅ **Interface utilisateur optimisée**
✅ **Documentation complète**

Le jeu Stone-Paper-Scissors est maintenant entièrement intégré dans la plateforme 4win ! 🎮
