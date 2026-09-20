import type { LcuEventMap } from './main/lcu/events';

export type Lockfile = {
  name: string;
  pid: string;
  port: string;
  password: string;
  protocol: string;
};

export interface Summoner {
  summonerId: number;
  displayName: string;
  gameName: string;
  tagLine: string;
  summonerLevel: number;
}

export type LcuEvent = {
  [K in keyof LcuEventMap]: {
    data: LcuEventMap[K];
    eventType: 'Create' | 'Update' | 'Delete';
    uri: K;
  };
}[keyof LcuEventMap];

/*
| { uri: '/lol-gameflow/v1/gameflow-phase', data: GmaeflowPhase}
*/

export type GameflowPhase =
  | 'None'
  | 'Lobby'
  | 'Matchmaking'
  | 'ReadyCheck'
  | 'ChampSelect'
  | 'GameStart'
  | 'InProgress'
  | 'WaitingForStats'
  | 'PreEndOfGame'
  | 'EndOfGame';

export type LcuStatus = 'disconnected' | 'connecting' | 'connected';
export type LcuState = {
  status: LcuStatus;
  phase: GameflowPhase | null;
};
