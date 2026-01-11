import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('musicJuke', {
  getTracks: () => ipcRenderer.invoke('library:getTracks'),
  importFolder: () => ipcRenderer.invoke('library:importFolder'),
  createPlaylist: (name: string) => ipcRenderer.invoke('playlist:create', name),
  listPlaylists: () => ipcRenderer.invoke('playlist:list'),
  addTrackToPlaylist: (playlistId: number, trackId: number) =>
    ipcRenderer.invoke('playlist:addTrack', playlistId, trackId),
  exportPlaylist: (playlistId: number, targetPath: string) =>
    ipcRenderer.invoke('playlist:export', playlistId, targetPath),
  previewPlaylistExport: (playlistId: number) => ipcRenderer.invoke('playlist:previewExport', playlistId),
  onDeviceMounted: (callback: (device: { mountPath: string; name: string }) => void) => {
    ipcRenderer.on('device:mounted', (_event, payload) => callback(payload));
  }
});
