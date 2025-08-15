# 🚀 Démarrage Rapide - Lucky Jet Game

## ⚡ Installation Express

### 1. Installer les dépendances
```bash
npm install
```

### 2. Démarrer le jeu
```bash
npm run dev
```

### 3. Ouvrir dans le navigateur
- **PC** : http://localhost:3000
- **Mobile** : http://[VOTRE_IP]:3000

## 🎮 Comment Jouer

### Mode Manuel
1. **Miser** : Cliquer sur "PLACE BET"
2. **Attendre** : Le multiplicateur monte
3. **Retirer** : Cliquer sur "CASHOUT" avant le crash

### Mode Auto
1. **Définir** : Multiplicateur de cashout automatique
2. **Miser** : Cliquer sur "PLACE BET"
3. **Attendre** : Le jeu retire automatiquement

## 🌐 Test Multi-Utilisateurs

### Local (2 fenêtres)
1. Ouvrir http://localhost:3000
2. Ouvrir une nouvelle fenêtre avec http://localhost:3000
3. Les deux sont synchronisées !

### Mobile + PC
1. Trouver votre IP locale : `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. PC : http://localhost:3000
3. Mobile : http://[VOTRE_IP]:3000

## 🔧 Commandes Utiles

```bash
# Développement (serveur + client)
npm run dev

# Serveur WebSocket seulement
npm run server

# Client React seulement
npm start

# Build production
npm run build
```

## 🐛 Problèmes Courants

### Le jeu ne démarre pas
```bash
# Vérifier le port 3001
netstat -an | findstr 3001

# Redémarrer
npm run dev
```

### Audio ne joue pas
- Cliquer sur l'écran
- Vérifier le volume du navigateur

### Synchronisation défaillante
- Vérifier la console (F12)
- Redémarrer le serveur

## 📱 Test Mobile

### Avec ngrok (recommandé)
```bash
# Installer ngrok
npm install -g ngrok

# Exposer les ports
ngrok http 3000
ngrok http 3001

# Utiliser les URLs ngrok
```

### Avec IP locale
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig

# Utiliser l'IP dans l'URL
http://192.168.1.XXX:3000
```

## 🎯 Fonctionnalités Clés

- ✅ **Synchronisation temps réel** : WebSocket
- ✅ **Interface responsive** : Mobile + Desktop
- ✅ **Audio intégré** : Musique d'ambiance
- ✅ **Multi-utilisateurs** : Plusieurs joueurs
- ✅ **Reconnexion automatique** : Reprise de session

---

**🎮 Prêt à jouer ? Lancez `npm run dev` et amusez-vous ! 🚀**
