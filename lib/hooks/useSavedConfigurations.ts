'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PropertyInputs } from '../calculator/types';
import { SavedConfiguration } from '../calculator/savedConfigTypes';

const STORAGE_KEY = 'real-estate-calculator-configs';

interface StoredState {
  configurations: SavedConfiguration[];
  activeConfigId: string | null;
}

function loadFromStorage(): StoredState {
  if (typeof window === 'undefined') {
    return { configurations: [], activeConfigId: null };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        configurations: parsed.configurations || [],
        activeConfigId: parsed.activeConfigId || null,
      };
    }
  } catch (error) {
    console.error('Failed to load saved configurations:', error);
  }
  return { configurations: [], activeConfigId: null };
}

function saveToStorage(state: StoredState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save configurations:', error);
  }
}

export function useSavedConfigurations() {
  const [state, setState] = useState<StoredState>({ configurations: [], activeConfigId: null });
  const [isLoaded, setIsLoaded] = useState(false);
  const initialized = useRef(false);

  // Load from localStorage on mount (client-side only)
  // This is intentional initialization from external storage, not a cascading render
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const stored = loadFromStorage();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(stored);
      setIsLoaded(true);
    }
  }, []);

  // Persist to localStorage when state changes (skip initial mount)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isLoaded) {
      saveToStorage(state);
    }
  }, [state, isLoaded]);

  const generateId = useCallback(() => {
    return `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const saveConfiguration = useCallback((name: string, inputs: PropertyInputs): SavedConfiguration => {
    const now = Date.now();
    const newConfig: SavedConfiguration = {
      id: generateId(),
      name: name.trim() || `Configuration ${state.configurations.length + 1}`,
      inputs,
      createdAt: now,
      updatedAt: now,
    };
    setState(prev => ({
      ...prev,
      configurations: [...prev.configurations, newConfig],
      activeConfigId: newConfig.id,
    }));
    return newConfig;
  }, [state.configurations.length, generateId]);

  const updateConfiguration = useCallback((id: string, inputs: PropertyInputs) => {
    setState(prev => ({
      ...prev,
      configurations: prev.configurations.map(config =>
        config.id === id
          ? { ...config, inputs, updatedAt: Date.now() }
          : config
      ),
    }));
  }, []);

  const renameConfiguration = useCallback((id: string, newName: string) => {
    setState(prev => ({
      ...prev,
      configurations: prev.configurations.map(config =>
        config.id === id
          ? { ...config, name: newName.trim(), updatedAt: Date.now() }
          : config
      ),
    }));
  }, []);

  const deleteConfiguration = useCallback((id: string) => {
    setState(prev => ({
      configurations: prev.configurations.filter(config => config.id !== id),
      activeConfigId: prev.activeConfigId === id ? null : prev.activeConfigId,
    }));
  }, []);

  const loadConfiguration = useCallback((id: string): PropertyInputs | null => {
    const config = state.configurations.find(c => c.id === id);
    if (config) {
      setState(prev => ({ ...prev, activeConfigId: id }));
      return config.inputs;
    }
    return null;
  }, [state.configurations]);

  const clearActiveConfig = useCallback(() => {
    setState(prev => ({ ...prev, activeConfigId: null }));
  }, []);

  return useMemo(() => ({
    configurations: state.configurations,
    activeConfigId: state.activeConfigId,
    isLoaded,
    saveConfiguration,
    updateConfiguration,
    renameConfiguration,
    deleteConfiguration,
    loadConfiguration,
    clearActiveConfig,
  }), [
    state.configurations,
    state.activeConfigId,
    isLoaded,
    saveConfiguration,
    updateConfiguration,
    renameConfiguration,
    deleteConfiguration,
    loadConfiguration,
    clearActiveConfig,
  ]);
}
