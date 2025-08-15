import React from 'react';
import styled from 'styled-components';
import LuckyJetGame from './components/LuckyJetGame';
import './App.css';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f1419 70%, #0a0a0f 100%);
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

function App() {
  return (
    <AppContainer>
      <LuckyJetGame />
    </AppContainer>
  );
}

export default App;
