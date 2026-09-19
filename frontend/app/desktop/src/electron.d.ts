import { GameflowPhase, Summoner } from '../types';

export {};

type PhaseListener = (phase: GameflowPhase) => void;
type Unsubscribe = () => void;

declare global {
  interface Window {
    versions: {
      node: () => string;
      chrome: () => string;
      electron: () => string;
    };
    lcu: {
      currentSummoner: () => Promise<Summoner | null>;
      onPhaseChange: (callback: PhaseListener) => Unsubscribe;
    };
  }
}
