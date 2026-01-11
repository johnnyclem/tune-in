import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'node:path';
import { initDb, closeDb } from './db.js';
import { scanDirectory, getAllTracks } from './library.js';
import { createPlaylist, getPlaylists, addTrackToPlaylist, exportPlaylistM3U, getPlaylistExportPreview } from './playlists.js';
import { startDeviceWatcher } from './deviceManager.js';

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    window.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    window.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  return window;
};

const registerIpc = (window: BrowserWindow) => {
  ipcMain.handle('library:getTracks', () => getAllTracks());

  ipcMain.handle('library:importFolder', async () => {
    const result = await dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { tracks: [] };
    }

    const tracks = await scanDirectory(result.filePaths[0]);
    return { tracks };
  });

  ipcMain.handle('playlist:create', (_event, name: string) => {
    const playlistId = createPlaylist(name);
    return { id: playlistId };
  });

  ipcMain.handle('playlist:list', () => getPlaylists());

  ipcMain.handle('playlist:addTrack', (_event, playlistId: number, trackId: number) => {
    addTrackToPlaylist(playlistId, trackId);
    return { ok: true };
  });

  ipcMain.handle('playlist:export', async (_event, playlistId: number, targetPath: string) => {
    await exportPlaylistM3U(playlistId, targetPath);
    return { ok: true };
  });

  ipcMain.handle('playlist:previewExport', (_event, playlistId: number) => {
    return getPlaylistExportPreview(playlistId);
  });

  startDeviceWatcher(window);
};

app.whenReady().then(() => {
  initDb();
  const window = createWindow();
  registerIpc(window);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  closeDb();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
