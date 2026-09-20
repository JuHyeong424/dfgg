import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { registerIpcHandlers } from './ipc';
import { startLcuConnection, stopLcuConnection } from './lcu/connection';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (!app.isPackaged) {
    win.loadURL('http://localhost:3001');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../../build/index.html'));
  }

  return win;
}

app.whenReady().then(async () => {
  registerIpcHandlers();
  createWindow();
  startLcuConnection();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', stopLcuConnection);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
