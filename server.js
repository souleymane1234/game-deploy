const WebSocket = require('ws');
const http = require('http');

// Créer le serveur HTTP
const server = http.createServer();

// Créer le serveur WebSocket
const wss = new WebSocket.Server({ server });

// État global du jeu
let gameState = {
  gameId: Date.now().toString(),
  countdown: 10,
  crashPoint: 0,
  gameStatus: 'waiting', // 'waiting', 'running', 'crashed'
  startTime: Date.now(),
  gameTime: 0,
  currentMultiplier: 1.00,
  gameHistory: []
};

// Variables pour contrôler la fréquence de diffusion
let lastBroadcastTime = 0;
const MIN_BROADCAST_INTERVAL = 50; // 50ms minimum entre les diffusions

// Fonction pour générer un point de crash réaliste
function generateCrashPoint() {
  const random = Math.random();
  if (random < 0.1) return 1.0; // 10% chance de crash immédiat
  if (random < 0.3) return 1.0 + Math.random() * 0.5; // 20% chance entre 1.0-1.5
  if (random < 0.6) return 1.5 + Math.random() * 1.0; // 30% chance entre 1.5-2.5
  if (random < 0.8) return 2.5 + Math.random() * 2.0; // 20% chance entre 2.5-4.5
  if (random < 0.95) return 4.5 + Math.random() * 5.0; // 15% chance entre 4.5-9.5
  return 9.5 + Math.random() * 20.5; // 5% chance entre 9.5-30.0
}

// Fonction pour démarrer une nouvelle partie
function startNewGame() {
  gameState = {
    gameId: Date.now().toString(),
    countdown: 10,
    crashPoint: generateCrashPoint(),
    gameStatus: 'waiting',
    startTime: Date.now(),
    gameTime: 0,
    currentMultiplier: 1.00,
    gameHistory: gameState.gameHistory // Garder l'historique
  };
  
  console.log('Nouvelle partie démarrée - Crash point:', gameState.crashPoint);
  broadcastGameState();
}

// Fonction pour diffuser l'état complet du jeu
function broadcastGameState() {
  const now = Date.now();
  if (now - lastBroadcastTime < MIN_BROADCAST_INTERVAL) {
    return; // Éviter les diffusions trop fréquentes
  }
  
  const message = {
    type: 'gameState',
    data: {
      ...gameState,
      gameHistory: gameState.gameHistory.slice(0, 10) // Limiter à 10 résultats
    }
  };
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
  
  lastBroadcastTime = now;
}

// Fonction pour diffuser seulement le décompte
function broadcastCountdown() {
  const message = {
    type: 'countdown',
    data: gameState.countdown
  };
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Fonction pour diffuser seulement le multiplicateur
function broadcastMultiplier() {
  const message = {
    type: 'multiplier',
    data: gameState.currentMultiplier
  };
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Gestion des connexions WebSocket
wss.on('connection', (ws) => {
  console.log('Nouveau client connecté');
  
  // Envoyer l'état actuel au nouveau client
  const message = {
    type: 'gameState',
    data: {
      ...gameState,
      gameHistory: gameState.gameHistory.slice(0, 10)
    }
  };
  ws.send(JSON.stringify(message));
  
  // Gestion des messages du client
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      if (message.type === 'requestGameState') {
        // Envoyer l'état actuel
        const response = {
          type: 'gameState',
          data: {
            ...gameState,
            gameHistory: gameState.gameHistory.slice(0, 10)
          }
        };
        ws.send(JSON.stringify(response));
      } else if (message.type === 'crash') {
        // Gérer le signal de crash
        if (gameState.gameStatus === 'running') {
          gameState.gameStatus = 'crashed';
          
          // Ajouter à l'historique
          gameState.gameHistory.unshift({
            multiplier: gameState.crashPoint,
            timestamp: Date.now()
          });
          
          // Limiter l'historique à 10 éléments
          if (gameState.gameHistory.length > 10) {
            gameState.gameHistory = gameState.gameHistory.slice(0, 10);
          }
          
          console.log('Crash détecté à:', gameState.crashPoint);
          
          // Diffuser l'état de crash
          broadcastGameState();
          
          // Redémarrer une nouvelle partie après 3 secondes
          setTimeout(() => {
            startNewGame();
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Erreur parsing message:', error);
    }
  });
  
  // Gestion de la déconnexion
  ws.on('close', () => {
    console.log('Client déconnecté');
  });
  
  // Gestion des erreurs
  ws.on('error', (error) => {
    console.error('Erreur WebSocket:', error);
  });
});

// Timer principal à 1 seconde pour le décompte
setInterval(() => {
  if (gameState.gameStatus === 'waiting') {
    if (gameState.countdown > 0) {
      gameState.countdown--;
      broadcastCountdown(); // Diffuser seulement le décompte
    } else {
      gameState.gameStatus = 'running';
      gameState.gameTime = 0;
      gameState.currentMultiplier = 1.00;
      broadcastGameState(); // Diffuser l'état complet au démarrage
      console.log('Partie démarrée - Crash point:', gameState.crashPoint);
    }
  } else if (gameState.gameStatus === 'crashed') {
    // Ne rien faire ici, le redémarrage est géré par le signal crash
  }
}, 1000);

// Timer rapide pour le multiplicateur
setInterval(() => {
  if (gameState.gameStatus === 'running') {
    // Calculer le multiplicateur en temps réel
    gameState.gameTime += 0.1;
    gameState.currentMultiplier = Math.pow(Math.E, gameState.gameTime * 0.06);
    gameState.currentMultiplier = Math.max(1.00, gameState.currentMultiplier);
    
    broadcastMultiplier(); // Diffuser seulement le multiplicateur
  }
}, 100);

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur WebSocket démarré sur le port ${PORT}`);
  console.log(`📡 Prêt pour les connexions WebSocket`);
  
  // Démarrer la première partie après un délai
  setTimeout(() => {
    startNewGame();
  }, 1000);
});

// Gestion des erreurs du serveur
server.on('error', (error) => {
  console.error('Erreur serveur:', error);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  wss.close(() => {
    server.close(() => {
      console.log('✅ Serveur arrêté proprement');
      process.exit(0);
    });
  });
});
