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

export type LcuEvent<T = GameflowPhase> = {
  data: T;
  eventType: 'Create' | 'Update' | 'Delete';
  url: string;
};

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
