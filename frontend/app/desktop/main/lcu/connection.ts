import { getLockfileContent } from './lockfile';
import { connectLcuSocket } from './socket';
import { getLcuState, setLcuPhase, setLcuStatus } from './state';
import { fetchGameflowPhase } from './service';

// lcu 연결 시작 함수
export function startLcuConnection() {
  const lockfile = getLockfileContent();
  if (!lockfile) {
    setLcuStatus('disconnected');
    console.error('롤 클라이언트가 꺼져 있어 소켓에 연결하지 않습니다');
    return;
  }

  setLcuStatus('connecting');

  const ws = connectLcuSocket(lockfile, (payload) => {
    setLcuPhase(payload.data);
  });

  ws.on('open', async () => {
    setLcuStatus('connected');

    const state = getLcuState();
    try {
      const phase = await fetchGameflowPhase();
      if (phase && state.status === 'connected' && getLcuState().phase === null) setLcuPhase(phase);
    } catch (error) {
      console.debug('phase 조회 실패', error);
    }
  });
  ws.on('close', () => setLcuStatus('disconnected'));
}
