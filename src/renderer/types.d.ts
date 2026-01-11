import type { Playlist, Track } from './types';

declare global {
  interface Window {
    musicJuke: {
      getTracks: () => Promise<Track[]>;
      importFolder: () => Promise<{ tracks: Track[] }>;
      createPlaylist: (name: string) => Promise<{ id: number }>;
      listPlaylists: () => Promise<Playlist[]>;
      addTrackToPlaylist: (playlistId: number, trackId: number) => Promise<{ ok: boolean }>;
      exportPlaylist: (playlistId: number, targetPath: string) => Promise<{ ok: boolean }>;
      previewPlaylistExport: (playlistId: number) => Promise<string>;
      onDeviceMounted: (callback: (device: { mountPath: string; name: string }) => void) => void;
    };
  }
}

export {};
