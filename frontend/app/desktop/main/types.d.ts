import { GameflowPhase, LcuStatus } from '../types';

export type BroadcastChannels = {
  'lcu:status': LcuStatus;
  'lcu:phase': GameflowPhase | null;
};
