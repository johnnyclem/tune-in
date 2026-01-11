import React, { useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import type { Playlist, Track } from '../types';

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
};

type Props = {
  tracks: Track[];
  playlists: Playlist[];
  onPlay: (track: Track) => void;
  onAddToPlaylist: (playlistId: number, trackId: number) => void;
};

const TrackList = ({ tracks, onPlay, playlists, onAddToPlaylist }: Props) => {
  const sortedTracks = useMemo(() => tracks, [tracks]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-800 px-6 py-4">
        <h2 className="text-xl font-semibold">Library</h2>
        <p className="text-xs text-slate-400">{sortedTracks.length} tracks</p>
      </div>
      <div className="flex-1">
        <FixedSizeList
          height={560}
          itemCount={sortedTracks.length}
          itemSize={64}
          width="100%"
        >
          {({ index, style }) => {
            const track = sortedTracks[index];
            return (
              <div
                style={style}
                className="flex items-center justify-between border-b border-slate-900 px-6 py-3 hover:bg-slate-900"
              >
                <button className="text-left" onClick={() => onPlay(track)}>
                  <p className="text-sm font-medium text-slate-100">{track.title}</p>
                  <p className="text-xs text-slate-400">{track.artist} · {track.album}</p>
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400">{formatDuration(track.duration)}</span>
                  <select
                    className="rounded bg-slate-800 px-2 py-1 text-xs"
                    onChange={(event) => {
                      const playlistId = Number(event.target.value);
                      if (playlistId) {
                        onAddToPlaylist(playlistId, track.id);
                      }
                    }}
                  >
                    <option value="">Add to playlist</option>
                    {playlists.map((playlist) => (
                      <option key={playlist.id} value={playlist.id}>
                        {playlist.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          }}
        </FixedSizeList>
      </div>
    </div>
  );
};

export default TrackList;
