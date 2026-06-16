'use client';

import { useEffect } from 'react';
import { useGameStore, loadSavedGame } from '../store/gameStore';
import TitleScreen from '../components/TitleScreen';
import NewGameScreen from '../components/NewGameScreen';
import GameScreen from '../components/GameScreen';
import DeathScreen from '../components/DeathScreen';

export default function Home() {
  const phase = useGameStore((state) => state.phase);

  // Attempt to restore a saved game on first load
  useEffect(() => {
    loadSavedGame();
  }, []);

  if (phase === 'title') return <TitleScreen />;
  if (phase === 'new_game') return <NewGameScreen />;
  if (phase === 'playing') return <GameScreen />;
  if (phase === 'dead') return <DeathScreen />;

  return <TitleScreen />;
}
