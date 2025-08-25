const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Game state
let gameState = {
  gameId: Date.now().toString(),
  countdown: 10,
  crashPoint: 1.0,
  gameStatus: 'waiting', // 'waiting', 'running', 'crashed'
  startTime: Date.now(),
  gameHistory: [],
  currentMultiplier: 1.00,
  players: []
};

// Game loop variables
let gameInterval = null;
let countdownInterval = null;
let multiplierInterval = null;

// Connected clients
const clients = new Set();

// Generate crash point with realistic probability
function generateCrashPoint() {
  const random = Math.random();
  if (random < 0.1) return 1.0; // 10% chance of immediate crash
  if (random < 0.3) return 1.0 + Math.random() * 0.5; // 20% chance between 1.0-1.5
  if (random < 0.6) return 1.5 + Math.random() * 1.0; // 30% chance between 1.5-2.5
  if (random < 0.8) return 2.5 + Math.random() * 2.0; // 20% chance between 2.5-4.5
  if (random < 0.95) return 4.5 + Math.random() * 5.0; // 15% chance between 4.5-9.5
  return 9.5 + Math.random() * 20.5; // 5% chance between 9.5-30.0
}

// Broadcast message to all connected clients
function broadcast(message) {
  const messageStr = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// Start a new game
function startNewGame() {
  // Clear existing intervals
  if (gameInterval) clearInterval(gameInterval);
  if (countdownInterval) clearInterval(countdownInterval);
  if (multiplierInterval) clearInterval(multiplierInterval);

  // Generate new crash point
  gameState.crashPoint = generateCrashPoint();
  gameState.gameStatus = 'waiting';
  gameState.countdown = 10;
  gameState.currentMultiplier = 1.00;
  gameState.startTime = Date.now();
  gameState.gameId = Date.now().toString();

  console.log(`New game started. Crash point: ${gameState.crashPoint.toFixed(2)}x`);

  // Start countdown
  countdownInterval = setInterval(() => {
    gameState.countdown--;
    
    // Broadcast countdown update
    broadcast({
      type: 'countdown',
      data: gameState.countdown
    });

    if (gameState.countdown <= 0) {
      clearInterval(countdownInterval);
      startGame();
    }
  }, 1000);

  // Broadcast initial game state
  broadcast({
    type: 'gameState',
    data: gameState
  });
}

// Start the actual game
function startGame() {
  gameState.gameStatus = 'running';
  gameState.currentMultiplier = 1.00;
  const startTime = Date.now();

  console.log('Game started!');

  // Update multiplier every 10ms (100 times per second) for ultra-smooth animation
  multiplierInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    // Formula ultra-rapide pour une montée extrêmement agressive
    gameState.currentMultiplier = Math.pow(Math.E, 0.05 * elapsed);
    gameState.currentMultiplier = Math.max(1.00, gameState.currentMultiplier);

    // Broadcast multiplier update
    broadcast({
      type: 'multiplier',
      data: gameState.currentMultiplier
    });

    // Check for crash
    if (gameState.currentMultiplier >= gameState.crashPoint) {
      crashGame();
    }
  }, 10);

  // Broadcast game started
  broadcast({
    type: 'gameState',
    data: gameState
  });
}

// Handle game crash
function crashGame() {
  clearInterval(multiplierInterval);
  gameState.gameStatus = 'crashed';
  gameState.currentMultiplier = gameState.crashPoint;

  console.log(`Game crashed at ${gameState.crashPoint.toFixed(2)}x`);

  // Add to game history
  gameState.gameHistory.unshift({
    multiplier: gameState.crashPoint,
    timestamp: Date.now()
  });

  // Keep only last 10 results
  if (gameState.gameHistory.length > 10) {
    gameState.gameHistory = gameState.gameHistory.slice(0, 10);
  }

  // Broadcast crash
  broadcast({
    type: 'gameState',
    data: gameState
  });

  // Start new game after 3 seconds
  setTimeout(() => {
    startNewGame();
  }, 3000);
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  // Send current game state to new client
  ws.send(JSON.stringify({
    type: 'gameState',
    data: gameState
  }));

  // Handle messages from client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'crash':
          // Handle crash signal from client
          console.log('Crash signal received from client');
          break;
        case 'join':
          // Handle player joining
          console.log('Player joined:', data.data);
          break;
        case 'cashout':
          // Handle player cashout
          console.log('Player cashed out:', data.data);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  // Handle connection errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Start the first game
startNewGame();

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Connect to: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
