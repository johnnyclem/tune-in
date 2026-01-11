import chokidar from 'chokidar';
import os from 'node:os';
import path from 'node:path';
import { BrowserWindow } from 'electron';

export const getDefaultMountRoots = () => {
  const platform = os.platform();
  if (platform === 'win32') {
    return ['C:/', 'D:/', 'E:/'];
  }
  if (platform === 'darwin') {
    return ['/Volumes'];
  }
  return ['/media', '/run/media', '/mnt'];
};

export const startDeviceWatcher = (window: BrowserWindow) => {
  const roots = getDefaultMountRoots();
  const watcher = chokidar.watch(roots, {
    depth: 1,
    ignoreInitial: true
  });

  watcher.on('addDir', (mountPath) => {
    const name = path.basename(mountPath);
    window.webContents.send('device:mounted', { mountPath, name });
  });

  return watcher;
};
