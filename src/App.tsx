import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PluginManagerProvider, usePluginManager } from './plugins/PluginManager';
import LuckyJetPlugin from './plugins/games/LuckyJetPlugin';
import DicePlugin from './plugins/games/DicePlugin';
import TicTacToePlugin from './plugins/games/TicTacToePlugin';
import TimerDicePlugin from './plugins/games/TimerDicePlugin';
import GameIntegration from './components/shared/GameIntegration';

import Dashboard from './components/Dashboard';
import Home from './components/Home';
import './App.css';

const AppContainer = styled.div`
  width: 100vw;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f1419 70%, #0a0a0f 100%);
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const MainContent = styled.main`
  overflow: hidden;
`;

// Composant pour gérer les routes dynamiques des plugins
const PluginRoutes: React.FC<{ balance: number; setBalance: (balance: number) => void }> = ({ 
  balance, 
  setBalance 
}) => {
  const { getEnabledPlugins } = usePluginManager();
  const enabledPlugins = getEnabledPlugins();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* Routes pour les plugins de jeux */}
      {enabledPlugins.map((plugin) => {
        if (plugin.type === 'internal' && plugin.component) {
          const GameComponent = plugin.component;
          return (
            <Route
              key={plugin.id}
              path={plugin.route}
              element={
                <GameComponent
                  balance={balance}
                  setBalance={setBalance}
                  gameConfig={plugin.config}
                />
              }
            />
          );
        } else if (plugin.type === 'iframe' || plugin.type === 'external') {
          return (
            <Route
              key={plugin.id}
              path={plugin.route}
              element={
                <GameIntegration
                  plugin={plugin}
                  balance={balance}
                  setBalance={setBalance}
                />
              }
            />
          );
        }
        return null;
      })}
    </Routes>
  );
};

// Composant principal de l'application
const AppContent: React.FC = () => {
  const [balance, setBalance] = useState<number>(10000);
  const { registerPlugin } = usePluginManager();

  // Initialiser localStorage avec la balance au démarrage
  useEffect(() => {
    const storageKey = '4win_platform_balance';
    const initialBalanceData = {
      balance: 10000,
      timestamp: Date.now(),
      platform: '4win'
    };
    localStorage.setItem(storageKey, JSON.stringify(initialBalanceData));
    console.log('Plateforme - Balance initialisée dans localStorage:', initialBalanceData);
    
    // Vider les plugins sauvegardés pour éviter les conflits
    localStorage.removeItem('gamePlugins');
    console.log('Plateforme - localStorage des plugins vidé');
  }, []);

  // Enregistrer les plugins au démarrage (une seule fois)
  useEffect(() => {
    console.log('Enregistrement des plugins...');
    
    // Forcer l'enregistrement des plugins avec isEnabled: true
    const luckyJetWithEnabled = { ...LuckyJetPlugin, isEnabled: true };
    const diceWithEnabled = { ...DicePlugin, isEnabled: true };
    const ticTacToeWithEnabled = { ...TicTacToePlugin, isEnabled: true };
    const timerDiceWithEnabled = { ...TimerDicePlugin, isEnabled: true };
    
    registerPlugin(luckyJetWithEnabled);
    registerPlugin(diceWithEnabled);
    registerPlugin(ticTacToeWithEnabled);
    registerPlugin(timerDiceWithEnabled);
    
    console.log('Plugins enregistrés avec isEnabled: true');
  }, [registerPlugin]);

  return (
    <Router>
      <AppContainer>
        <MainContent>
          <PluginRoutes balance={balance} setBalance={setBalance} />
        </MainContent>
      </AppContainer>
    </Router>
  );
};

function App() {
  return (
    <PluginManagerProvider>
      <AppContent />
    </PluginManagerProvider>
  );
}

export default App;

