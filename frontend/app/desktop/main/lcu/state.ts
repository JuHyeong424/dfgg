import { GameflowPhase, LcuState, LcuStatus } from '../../types';
import { broadcastToAllWindows } from '../ipc/broadcast';

const state: LcuState = { status: 'disconnected', phase: null };

export function getLcuState(): Readonly<LcuState> {
  return state;
}

export function setLcuPhase(phase: GameflowPhase | null) {
  if (state.phase === phase) return;
  state.phase = phase;
  broadcastToAllWindows('lcu:phase', phase);
}

export function setLcuStatus(status: LcuStatus) {
  if (state.status === status) return;
  state.status = status;
  console.log('LCU 상태', status);
  broadcastToAllWindows('lcu:status', status);

  if (status === 'disconnected') setLcuPhase(null);
}
