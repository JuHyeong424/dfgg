import { type BrowserWindow } from 'electron';
import { getLockfileContent } from './lockfile';
import { connectLcuSocket } from './socket';

// lcu 연결 시작 함수
export function startLcuConnection(window: BrowserWindow) {
  const lockfile = getLockfileContent();
  if (!lockfile) {
    console.error('롤 클라이언트가 꺼져 있어 소켓에 연결하지 않습니다');
    return;
  }

  const ws = connectLcuSocket(lockfile, (payload) => {
    // console.log('LCU Event: ', payload);
    window.webContents.send('lcu:phase', payload.data);
  });

  ws.on('open', () => console.log('LCU 소켓 연결'));
  ws.on('close', () => console.log('LCU 소켓 연결 끊김'));
}
