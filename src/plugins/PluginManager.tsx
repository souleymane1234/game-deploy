import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GamePlugin, PluginRegistry, GameConfig } from '../types/GamePlugin';

interface PluginManagerContextType {
  plugins: PluginRegistry;
  registerPlugin: (plugin: GamePlugin) => void;
  unregisterPlugin: (pluginId: string) => void;
  enablePlugin: (pluginId: string) => void;
  disablePlugin: (pluginId: string) => void;
  getPlugin: (pluginId: string) => GamePlugin | undefined;
  getEnabledPlugins: () => GamePlugin[];
  updatePluginConfig: (pluginId: string, config: Partial<GameConfig>) => void;
}

const PluginManagerContext = createContext<PluginManagerContextType | undefined>(undefined);

interface PluginManagerProviderProps {
  children: ReactNode;
}

export const PluginManagerProvider: React.FC<PluginManagerProviderProps> = ({ children }) => {
  const [plugins, setPlugins] = useState<PluginRegistry>({});

  // Charger les plugins depuis le localStorage au démarrage
  useEffect(() => {
    const savedPlugins = localStorage.getItem('gamePlugins');
    if (savedPlugins) {
      try {
        const parsedPlugins = JSON.parse(savedPlugins);
        console.log('PluginManager - Plugins chargés depuis localStorage:', Object.keys(parsedPlugins));
        setPlugins(parsedPlugins);
      } catch (error) {
        console.error('Erreur lors du chargement des plugins:', error);
      }
    } else {
      console.log('PluginManager - Aucun plugin sauvegardé, initialisation vide');
    }
  }, []);

  // Sauvegarder les plugins dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('gamePlugins', JSON.stringify(plugins));
  }, [plugins]);

  const registerPlugin = useCallback((plugin: GamePlugin) => {
    console.log('PluginManager - Enregistrement du plugin:', plugin.id);
    setPlugins(prev => ({
      ...prev,
      [plugin.id]: plugin
    }));
  }, []);

  const unregisterPlugin = useCallback((pluginId: string) => {
    setPlugins(prev => {
      const newPlugins = { ...prev };
      delete newPlugins[pluginId];
      return newPlugins;
    });
  }, []);

  const enablePlugin = useCallback((pluginId: string) => {
    setPlugins(prev => ({
      ...prev,
      [pluginId]: {
        ...prev[pluginId],
        isEnabled: true
      }
    }));
  }, []);

  const disablePlugin = useCallback((pluginId: string) => {
    setPlugins(prev => ({
      ...prev,
      [pluginId]: {
        ...prev[pluginId],
        isEnabled: false
      }
    }));
  }, []);

  const getPlugin = useCallback((pluginId: string) => {
    return plugins[pluginId];
  }, [plugins]);

  const getEnabledPlugins = useCallback(() => {
    console.log('PluginManager - Requête pour les plugins activés');
    console.log('PluginManager - Tous les plugins:', Object.keys(plugins));
    const enabledPlugins = Object.values(plugins).filter(plugin => plugin.isEnabled);
    console.log('PluginManager - Plugins activés trouvés:', enabledPlugins.map(p => p.id));
    console.log('PluginManager - Détails des plugins:', plugins);
    return enabledPlugins;
  }, [plugins]);

  const updatePluginConfig = useCallback((pluginId: string, config: Partial<GameConfig>) => {
    setPlugins(prev => ({
      ...prev,
      [pluginId]: {
        ...prev[pluginId],
        config: {
          ...prev[pluginId].config,
          ...config
        }
      }
    }));
  }, []);

  const value: PluginManagerContextType = {
    plugins,
    registerPlugin,
    unregisterPlugin,
    enablePlugin,
    disablePlugin,
    getPlugin,
    getEnabledPlugins,
    updatePluginConfig
  };

  return (
    <PluginManagerContext.Provider value={value}>
      {children}
    </PluginManagerContext.Provider>
  );
};

export const usePluginManager = () => {
  const context = useContext(PluginManagerContext);
  if (context === undefined) {
    throw new Error('usePluginManager must be used within a PluginManagerProvider');
  }
  return context;
};
