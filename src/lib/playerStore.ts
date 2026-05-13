// src/lib/playerStore.ts
// Global audio player state — one instance shared across the whole app
import { create } from 'zustand';
import type { Tilawa } from '@/types';

interface PlayerState {
  currentTilawa: Tilawa | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;

  play: (tilawa: Tilawa) => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  stop: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTilawa: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,

  play: (tilawa) => set({ currentTilawa: tilawa, isPlaying: true, currentTime: 0 }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  seek: (seconds) => set({ currentTime: seconds }),
  setVolume: (v) => set({ volume: v }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  stop: () => set({ currentTilawa: null, isPlaying: false, currentTime: 0, duration: 0 }),
}));
