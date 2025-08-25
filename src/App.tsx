import React, { useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LuckyJetGame from './games/lucky-jet/LuckyJetGame';
import DiceGame from './games/dice/DiceGame';

import Dashboard from './components/Dashboard';
import './App.css';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f1419 70%, #0a0a0f 100%);
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const MainContent = styled.main`
  height: 100vh;
  overflow: hidden;
`;

function App() {
  const [balance, setBalance] = useState<number>(10000);

  return (
    <Router>
      <AppContainer>
        <MainContent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route 
              path="/lucky-jet" 
              element={
                <LuckyJetGame 
                  balance={balance}
                  setBalance={setBalance}
                />
              } 
            />
            <Route 
              path="/dice" 
              element={
                <DiceGame 
                  balance={balance}
                  setBalance={setBalance}
                />
              } 
            />

          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;

