# LuckyJet WebSocket Server

This is the WebSocket server for the LuckyJet game that handles real-time game synchronization across all connected clients.

## Features

- Real-time game state synchronization
- Automatic game cycles (waiting → running → crashed → waiting)
- Realistic crash point generation with proper probability distribution
- Multiplier calculation and broadcasting
- Game history tracking
- Client connection management

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3001 by default. You can change this by setting the `PORT` environment variable.

## Game Flow

1. **Waiting Phase**: 10-second countdown before each game
2. **Running Phase**: Multiplier increases exponentially until crash
3. **Crashed Phase**: Game ends, results are recorded, 3-second pause
4. **Repeat**: New game starts automatically

## WebSocket Messages

### Server → Client
- `gameState`: Complete game state update
- `countdown`: Countdown timer update
- `multiplier`: Current multiplier update

### Client → Server
- `crash`: Signal game crash
- `join`: Player joining game
- `cashout`: Player cashing out

## Connection

Clients should connect to: `ws://localhost:3001`

## Crash Point Generation

The server uses a realistic probability distribution:
- 10% chance: 1.0x (immediate crash)
- 20% chance: 1.0x - 1.5x
- 30% chance: 1.5x - 2.5x
- 20% chance: 2.5x - 4.5x
- 15% chance: 4.5x - 9.5x
- 5% chance: 9.5x - 30.0x

This ensures fair and unpredictable gameplay.
