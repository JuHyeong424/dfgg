import { ipcMain } from 'electron';
import { fetchCurrentSummoner } from '../lcu/service';

export function registerIpcHandlers() {
  ipcMain.handle('lcu:current-summoner', fetchCurrentSummoner);
}
