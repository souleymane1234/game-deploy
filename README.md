# 4WIN - Plateforme de Jeux de Casino

Une plateforme moderne de jeux de casino en ligne développée avec React, TypeScript et Styled Components.

## 🎮 Jeux Disponibles

### ✈️ Lucky Jet
- Jeu de crash avec multiplicateur croissant
- Mode manuel et automatique
- Interface immersive avec animations
- Synchronisation en temps réel via WebSocket

### 🎲 Dice Game
- Jeu de dés classique revisité
- 6 options de paris avec multiplicateurs différents
- Animations fluides et interface moderne
- Historique des résultats

## 🏗️ Structure du Projet

```
4win-platform/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── musics/
│   │   └── casino-164235.mp3
│   ├── players/
│   │   └── Character.png
│   └── sprites/
│       └── Dice/
│           └── DiceBG.png
├── src/
│   ├── components/
│   │   └── Dashboard.tsx
│   ├── games/
│   │   ├── lucky-jet/
│   │   │   ├── LuckyJetGame.tsx
│   │   │   ├── ControlPanel.tsx
│   │   │   └── GameDisplay.tsx
│   │   └── dice/
│   │       └── DiceGame.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd 4win-platform

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

L'application sera accessible à l'adresse `http://localhost:3000`

### Build de Production
```bash
npm run build
```

## 🛠️ Technologies Utilisées

- **React 18** - Framework JavaScript pour l'interface utilisateur
- **TypeScript** - Typage statique pour JavaScript
- **Styled Components** - CSS-in-JS pour le styling
- **Framer Motion** - Animations fluides et performantes
- **React Router** - Navigation entre les pages
- **Lucide React** - Icônes modernes

## 🎨 Design System

### Couleurs
- **Vert principal**: `#00ff88` - Succès, gains, actions positives
- **Rouge**: `#ff4444` - Erreurs, pertes, actions dangereuses
- **Orange**: `#ffa726` - Avertissements, multiplicateurs moyens
- **Fond sombre**: `#1a1a2e` - Arrière-plan principal
- **Fond plus sombre**: `#0a0a0f` - Arrière-plan secondaire

### Typographie
- **Police principale**: Inter (Google Fonts)
- **Tailles**: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 48px
- **Poids**: 300, 400, 500, 600, 700, 800, 900

### Animations
- **Transitions**: 0.3s ease pour les interactions
- **Hover effects**: translateY(-2px) avec ombre
- **Loading**: Spinner rotatif avec couleur verte
- **Victoire**: Animation de pulse avec scale

## 📱 Responsive Design

La plateforme est entièrement responsive et optimisée pour :
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔧 Configuration

### Variables d'Environnement
Créer un fichier `.env` à la racine du projet :

```env
REACT_APP_WS_URL=ws://localhost:3001
REACT_APP_API_URL=http://localhost:3001
```

### WebSocket Server
Pour le jeu Lucky Jet, un serveur WebSocket est nécessaire. Voir le dossier `server/` pour plus d'informations.

## 🎯 Fonctionnalités

### Dashboard
- Vue d'ensemble de tous les jeux
- Navigation intuitive
- Statistiques globales
- Design moderne et accueillant

### Lucky Jet
- **Mode Manuel**: Contrôle total du cashout
- **Mode Auto**: Cashout automatique à un multiplicateur défini
- **Historique**: 10 derniers résultats
- **Joueurs en temps réel**: Simulation d'autres joueurs
- **Audio**: Musique d'ambiance avec contrôles

### Dice Game
- **6 options de paris**: Multiplicateurs de 4.5x à 6.0x
- **Animations de dés**: Rotation et effets visuels
- **Historique**: 10 derniers résultats
- **Statistiques**: Win rate et nombre de parties

## 🔒 Sécurité

- Validation des entrées utilisateur
- Protection contre les injections
- Gestion sécurisée des états
- Pas de stockage de données sensibles côté client

## 📈 Performance

- **Lazy Loading**: Chargement à la demande des composants
- **Memoization**: Optimisation des re-renders
- **Code Splitting**: Séparation du code par fonctionnalité
- **Optimisation des images**: Formats modernes et compression

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests avec couverture
npm test -- --coverage
```

## 📦 Déploiement

### Netlify
```bash
npm run build
# Déployer le dossier build/
```

### Vercel
```bash
npm run build
# Déployer automatiquement avec Vercel CLI
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

## 🔮 Roadmap

- [ ] Ajout de nouveaux jeux (Roulette, Blackjack)
- [ ] Système de leaderboard
- [ ] Mode multijoueur
- [ ] Intégration de crypto-monnaies
- [ ] Application mobile (React Native)
- [ ] Système de tournois
- [ ] Chat en temps réel
- [ ] Système de récompenses

---

**4WIN** - Votre plateforme de jeux de casino de confiance 🎰

