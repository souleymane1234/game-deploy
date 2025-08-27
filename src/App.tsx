import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PluginManagerProvider, usePluginManager } from './plugins/PluginManager';
import LuckyJetPlugin from './plugins/games/LuckyJetPlugin';
import DicePlugin from './plugins/games/DicePlugin';
import TicTacToePlugin from './plugins/games/TicTacToePlugin';
import TimerDicePlugin from './plugins/games/TimerDicePlugin';
import { StonePaperScissorsPlugin } from './plugins/games/StonePaperScissorsPlugin';
import GameIntegration from './components/shared/GameIntegration';
import BalanceService from './services/BalanceService';

import Dashboard from './components/Dashboard';
import Home from './components/Home';
import BalanceTest from './components/BalanceTest';
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
  const balanceService = BalanceService.getInstance();

  // Initialiser le solde depuis le service centralisé
  useEffect(() => {
    setBalance(balanceService.getBalance());
    
    // Écouter les mises à jour du solde
    const handleBalanceUpdate = (newBalance: number) => {
      setBalance(newBalance);
    };

    balanceService.on('balanceUpdate', handleBalanceUpdate);

    // Vider les plugins sauvegardés pour éviter les conflits
    localStorage.removeItem('gamePlugins');
    console.log('Plateforme - Balance centralisée initialisée');
    
    return () => {
      balanceService.off('balanceUpdate', handleBalanceUpdate);
    };
  }, [balanceService]);

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
    registerPlugin(StonePaperScissorsPlugin);
    
    console.log('Plugins enregistrés avec isEnabled: true');
  }, [registerPlugin]);

  return (
    <Router>
      <AppContainer>
        <MainContent>
          <PluginRoutes balance={balance} setBalance={setBalance} />
        </MainContent>
        {/* <BalanceTest /> */}
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

