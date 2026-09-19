import { ipcMain } from 'electron';
import { fetchCurrentSummoner } from '../lcu/service';

// ipc로 보내기
export function registerIpcHandlers() {
  ipcMain.handle('lcu:current-summoner', fetchCurrentSummoner);
}
