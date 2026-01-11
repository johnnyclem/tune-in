import React, { useEffect, useMemo, useState } from 'react';
import { Howl } from 'howler';
import Sidebar from './Sidebar';
import TrackList from './TrackList';
import PlayerBar from './PlayerBar';
import PlaylistPanel from './PlaylistPanel';
import type { Playlist, Track } from '../types';

const App = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeView, setActiveView] = useState<'library' | 'playlists' | 'devices'>('library');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [devices, setDevices] = useState<{ mountPath: string; name: string }[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const player = useMemo(() => {
    if (!currentTrack) {
      return null;
    }

    const sound = new Howl({
      src: [currentTrack.path],
      html5: true,
      onend: () => {
        setIsPlaying(false);
      }
    });

    return sound;
  }, [currentTrack]);

  useEffect(() => {
    window.musicJuke.getTracks().then(setTracks).catch((error) => {
      setToast(`Failed to load library: ${String(error)}`);
    });
    window.musicJuke.listPlaylists().then(setPlaylists).catch(() => undefined);
    window.musicJuke.onDeviceMounted((device) => {
      setDevices((prev) => [device, ...prev]);
      setToast(`Device detected: ${device.name}`);
    });
  }, []);

  const handleImport = async () => {
    try {
      const result = await window.musicJuke.importFolder();
      if (result.tracks.length > 0) {
        setTracks((prev) => {
          const merged = [...prev, ...result.tracks];
          return merged.sort((a, b) => a.artist.localeCompare(b.artist));
        });
      }
    } catch (error) {
      setToast(`Import failed: ${String(error)}`);
    }
  };

  const handlePlay = (track: Track) => {
    if (player) {
      player.stop();
    }
    setCurrentTrack(track);
    setQueue(tracks);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (player && isPlaying) {
      player.play();
    }
    if (player && !isPlaying) {
      player.pause();
    }
  }, [player, isPlaying]);

  const handleToggle = () => {
    if (!currentTrack) {
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    if (!currentTrack) {
      return;
    }
    const index = queue.findIndex((track) => track.id === currentTrack.id);
    const next = queue[index + 1];
    if (next) {
      handlePlay(next);
    }
  };

  const handleCreatePlaylist = async (name: string) => {
    const response = await window.musicJuke.createPlaylist(name);
    setPlaylists((prev) => [...prev, { id: response.id, name, trackCount: 0 }]);
  };

  const handleAddToPlaylist = async (playlistId: number, trackId: number) => {
    await window.musicJuke.addTrackToPlaylist(playlistId, trackId);
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, trackCount: playlist.trackCount + 1 }
          : playlist
      )
    );
    setToast('Track added to playlist.');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar
        activeView={activeView}
        onChangeView={setActiveView}
        onImport={handleImport}
        deviceCount={devices.length}
      />
      <main className="flex flex-1 flex-col">
        <div className="flex-1 overflow-hidden">
          {activeView === 'library' && (
            <TrackList
              tracks={tracks}
              onPlay={handlePlay}
              playlists={playlists}
              onAddToPlaylist={handleAddToPlaylist}
            />
          )}
          {activeView === 'playlists' && (
            <PlaylistPanel playlists={playlists} onCreate={handleCreatePlaylist} />
          )}
          {activeView === 'devices' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold">Connected Devices</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {devices.length === 0 && <li>No devices detected yet.</li>}
                {devices.map((device) => (
                  <li key={device.mountPath} className="rounded bg-slate-800 p-3">
                    <p className="font-medium text-slate-100">{device.name}</p>
                    <p className="text-xs text-slate-400">{device.mountPath}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <PlayerBar
          track={currentTrack}
          isPlaying={isPlaying}
          onToggle={handleToggle}
          onNext={handleNext}
        />
      </main>
      {toast && (
        <div className="absolute right-6 top-6 rounded bg-slate-800 px-4 py-3 text-sm shadow-lg">
          {toast}
          <button
            className="ml-4 text-slate-400 hover:text-slate-200"
            onClick={() => setToast(null)}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
