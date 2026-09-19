import { contextBridge, ipcRenderer } from 'electron';
import { GameflowPhase } from '../types';

contextBridge.exposeInMainWorld('lcu', {
  currentSummoner: () => ipcRenderer.invoke('lcu:current-summoner'),
  onPhaseChange: (callback: (phase: GameflowPhase) => void) => {
    const listener = (_: unknown, phase: GameflowPhase) => callback(phase);
    ipcRenderer.on('lcu:phase', listener);
    return () => ipcRenderer.removeListener('lcu:phase', listener);
  },
});
