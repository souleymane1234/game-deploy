export interface GamePlugin {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  component?: React.ComponentType<GamePluginProps>; // Pour les jeux internes
  externalUrl?: string; // Pour les jeux externes
  iframeConfig?: IframeConfig; // Configuration pour l'intégration iframe
  config: GameConfig;
  isEnabled: boolean;
  type: 'internal' | 'external' | 'iframe'; // Type d'intégration
}

export interface GamePluginProps {
  balance: number;
  setBalance: (balance: number) => void;
  gameConfig: GameConfig;
}

export interface IframeConfig {
  src: string;
  width?: string;
  height?: string;
  allowFullscreen?: boolean;
  sandbox?: string;
  title?: string;
  onMessage?: (event: MessageEvent) => void;
  onLoad?: () => void;
  onError?: (error: Event) => void;
}

export interface GameConfig {
  minBet: number;
  maxBet: number;
  defaultBet: number;
  betIncrements: number[];
  currency: string;
  features: GameFeature[];
  rules: GameRule[];
  audio?: AudioConfig;
  theme?: ThemeConfig;
  integration?: IntegrationConfig; // Configuration d'intégration
}

export interface IntegrationConfig {
  communicationProtocol: 'postMessage' | 'localStorage' | 'custom';
  balanceSync: boolean;
  eventHandlers?: {
    onGameStart?: string;
    onGameEnd?: string;
    onBetPlaced?: string;
    onWin?: string;
    onLose?: string;
  };
  sharedData?: {
    balance?: boolean;
    userInfo?: boolean;
    gameHistory?: boolean;
  };
}

export interface GameFeature {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  config?: any;
}

export interface GameRule {
  id: string;
  name: string;
  description: string;
  payoutMultiplier?: number;
  conditions?: any;
}

export interface AudioConfig {
  enabled: boolean;
  volume: number;
  sounds: {
    [key: string]: string;
  };
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
}

export interface PluginRegistry {
  [gameId: string]: GamePlugin;
}
