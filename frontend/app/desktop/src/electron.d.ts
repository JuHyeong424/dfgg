import { Summoner } from '../types';

export {};

declare global {
  interface Window {
    versions: {
      node: () => string;
      chrome: () => string;
      electron: () => string;
    };
    lcu: {
      currentSummoner: () => Promise<Summoner | null>;
    };
  }
}
