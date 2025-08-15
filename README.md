# 🚀 Lucky Jet Game - Crash Game

Un jeu de crash style "Lucky Jet" développé avec ReactJS, TypeScript et WebSocket pour la synchronisation en temps réel.

## ✨ Fonctionnalités

### 🎮 **Gameplay**
- **Système de crash réaliste** : Probabilités équilibrées pour des parties équitables
- **Multiplicateur en temps réel** : Progression exponentielle fluide
- **Cashout manuel et automatique** : Contrôle total sur vos gains
- **Historique des parties** : Suivi des 10 derniers résultats
- **Interface responsive** : Optimisé pour desktop et mobile

### 🌐 **Synchronisation Temps Réel**
- **WebSocket** : Synchronisation parfaite entre tous les joueurs
- **État partagé** : Décompte, multiplicateur et crash synchronisés
- **Reconnexion automatique** : Reprise de session en cas de déconnexion
- **Multi-utilisateurs** : Plusieurs joueurs peuvent jouer simultanément

### 🎨 **Interface Utilisateur**
- **Design space-themed** : Interface moderne avec thème spatial
- **Animations fluides** : Transitions et effets visuels
- **Responsive design** : Adaptation automatique mobile/desktop
- **Audio intégré** : Musique d'ambiance en continu

### 📱 **Optimisations Mobile**
- **Interface adaptée** : Layout optimisé pour écrans tactiles
- **Contrôles simplifiés** : Boutons et interactions adaptés
- **Performance optimisée** : Chargement rapide sur mobile

## 🛠️ Technologies Utilisées

- **Frontend** : React 18, TypeScript, Styled Components
- **Animations** : Framer Motion
- **Backend** : Node.js, WebSocket (ws)
- **Synchronisation** : WebSocket en temps réel
- **Audio** : HTML5 Audio API
- **Build** : Create React App

## 📦 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd lucky-jet-game
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Installer les types TypeScript (si nécessaire)**
```bash
npm install --save-dev @types/styled-components
```

## 🚀 Démarrage

### Mode Développement (Recommandé)

1. **Démarrer le serveur WebSocket et l'application**
```bash
npm run dev
```

Cette commande démarre automatiquement :
- ✅ Serveur WebSocket sur le port 3001
- ✅ Application React sur le port 3000
- ✅ Synchronisation en temps réel

### Mode Production

1. **Build de l'application**
```bash
npm run build
```

2. **Démarrer le serveur WebSocket**
```bash
npm run server
```

3. **Servir les fichiers statiques** (avec un serveur comme nginx ou serve)
```bash
npx serve -s build
```

## 🌐 Accès Multi-Plateformes

### Test Local
- **PC** : `http://localhost:3000`
- **Mobile** : `http://[VOTRE_IP_LOCALE]:3000`

### Test Public (avec ngrok)
1. **Installer ngrok**
```bash
npm install -g ngrok
```

2. **Configurer ngrok**
```bash
ngrok config add-authtoken VOTRE_TOKEN
```

3. **Exposer les ports**
```bash
ngrok http 3000  # Pour l'application React
ngrok http 3001  # Pour le serveur WebSocket
```

## 🎮 Comment Jouer

### Interface du Jeu
- **Zone de jeu** : Affichage du multiplicateur et du personnage
- **Panneau de contrôle** : Mise, cashout automatique, liste des joueurs
- **Historique** : 10 derniers résultats en bas

### Modes de Jeu
1. **Mode Manuel**
   - Cliquer sur "PLACE BET" pour rejoindre
   - Cliquer sur "CASHOUT" pour retirer vos gains
   - Contrôle total sur le moment de retrait

2. **Mode Auto**
   - Définir un multiplicateur de cashout automatique
   - Le jeu retire automatiquement vos gains
   - Idéal pour les stratégies de trading

### Stratégies
- **Cashout rapide** : Gains sûrs mais faibles
- **Cashout tardif** : Risque élevé, gains potentiellement élevés
- **Stratégie mixte** : Combiner les deux approches

## 🔧 Configuration

### Variables d'Environnement
```env
PORT=3001          # Port du serveur WebSocket
REACT_APP_WS_URL=ws://localhost:3001  # URL WebSocket (optionnel)
```

### Personnalisation
- **Musique** : Remplacer `/public/musics/gamebg.mp3`
- **Personnage** : Remplacer `/public/players/Character.png`
- **Thème** : Modifier les couleurs dans les styled-components

## 📱 Fonctionnalités Mobile

### Optimisations Spécifiques
- **Layout vertical** : Game display au-dessus du panneau de contrôle
- **Liste des joueurs masquée** : Économie d'espace
- **Boutons tactiles** : Taille optimisée pour les doigts
- **Responsive design** : Adaptation automatique à tous les écrans

### Contrôles Mobile
- **Tap pour miser** : Interface tactile intuitive
- **Swipe pour naviguer** : Navigation fluide
- **Audio automatique** : Démarrage au premier tap

## 🔄 Synchronisation WebSocket

### Architecture
```
Client 1 ←→ WebSocket Server ←→ Client 2
   ↓              ↓              ↓
État local    État global    État local
```

### Messages WebSocket
- **`gameState`** : État complet du jeu
- **`countdown`** : Mise à jour du décompte
- **`multiplier`** : Mise à jour du multiplicateur
- **`crash`** : Signal de crash

### Avantages
- ✅ **Synchronisation parfaite** : Tous les joueurs voient la même chose
- ✅ **Pas de décalage** : Mises à jour en temps réel
- ✅ **Reconnexion automatique** : Reprise de session
- ✅ **Performance optimisée** : Messages ciblés

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur de connexion WebSocket**
   - Vérifier que le serveur est démarré : `npm run server`
   - Vérifier le port 3001 n'est pas utilisé
   - Redémarrer le serveur

2. **Audio ne joue pas**
   - Cliquer sur l'écran pour activer l'audio
   - Vérifier que le fichier `/public/musics/gamebg.mp3` existe
   - Vérifier les permissions du navigateur

3. **Synchronisation défaillante**
   - Vérifier la connexion WebSocket dans la console
   - Redémarrer le serveur et les clients
   - Vérifier les pare-feu

4. **Performance lente**
   - Fermer les onglets inutiles
   - Vérifier la connexion internet
   - Redémarrer l'application

### Logs de Débogage
```bash
# Serveur WebSocket
npm run server

# Client React
npm start
```

## 📊 Structure du Projet

```
lucky-jet-game/
├── public/
│   ├── musics/
│   │   └── gamebg.mp3          # Musique d'ambiance
│   └── players/
│       └── Character.png       # Personnage du jeu
├── src/
│   ├── components/
│   │   ├── LuckyJetGame.tsx    # Composant principal
│   │   ├── GameDisplay.tsx     # Affichage du jeu
│   │   └── ControlPanel.tsx    # Panneau de contrôle
│   ├── App.tsx                 # Point d'entrée
│   └── App.css                 # Styles globaux
├── server.js                   # Serveur WebSocket
├── package.json                # Dépendances
└── README.md                   # Documentation
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **React** : Framework frontend
- **WebSocket** : Synchronisation temps réel
- **Styled Components** : Styling moderne
- **Framer Motion** : Animations fluides

---

**🎮 Bon jeu et bonne chance ! 🚀**
