import { getLockfileContent } from './lockfile';
import { connectLcuSocket } from './socket';
import { getLcuState, setLcuPhase, setLcuStatus } from './state';
import { fetchGameflowPhase } from './service';

const WAIT_FOR_CLIENT_MS = 3000; // 롤이 꺼져 있을 때
const MIN_RETRY_MS = 1000; // 연결 실패 백오프 시작
const MAX_RETRY_MS = 10000; // 백오프 상한

let timer: NodeJS.Timeout | null = null;
let retryDelay = MIN_RETRY_MS;

let port: string | null = null;

function scheduleRetry(interval: number) {
  if (timer !== null) return;

  console.log(`${interval}ms 뒤 재시도`);

  timer = setTimeout(() => {
    timer = null;
    connect();
  }, interval);
}

function connect() {
  const lockfile = getLockfileContent();

  if (!lockfile) {
    setLcuStatus('disconnected');
    port = null;
    return scheduleRetry(WAIT_FOR_CLIENT_MS);
  }

  if (port !== lockfile.port) {
    retryDelay = MIN_RETRY_MS;
    port = lockfile.port;
  }

  setLcuStatus('connecting');

  const ws = connectLcuSocket(lockfile, (payload) => {
    setLcuPhase(payload.data);
  });

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;

    ws.removeAllListeners();
    ws.close();
    setLcuStatus('disconnected');

    scheduleRetry(retryDelay);
    retryDelay = Math.min(retryDelay * 2, MAX_RETRY_MS);
  };

  ws.on('open', async () => {
    retryDelay = MIN_RETRY_MS;
    setLcuStatus('connected');

    try {
      const phase = await fetchGameflowPhase();
      const state = getLcuState();
      if (phase && state.status === 'connected' && state.phase === null) setLcuPhase(phase);
    } catch (error) {
      console.debug('phase 조회 실패', error);
    }
  });

  ws.on('error', cleanup);
  ws.on('close', cleanup);
}

// lcu 연결 시작 함수
export function startLcuConnection() {
  connect();
}
