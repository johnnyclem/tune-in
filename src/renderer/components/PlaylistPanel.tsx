import React, { useState } from 'react';
import type { Playlist } from '../types';

type Props = {
  playlists: Playlist[];
  onCreate: (name: string) => void;
};

const PlaylistPanel = ({ playlists, onCreate }: Props) => {
  const [name, setName] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }
    onCreate(name.trim());
    setName('');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Playlists</h2>
          <p className="text-xs text-slate-400">Create a playlist and add tracks from the library.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            placeholder="New playlist name"
          />
          <button
            type="submit"
            className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950"
          >
            Create
          </button>
        </form>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="rounded border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-lg font-semibold">{playlist.name}</h3>
            <p className="text-xs text-slate-400">{playlist.trackCount} tracks</p>
          </div>
        ))}
        {playlists.length === 0 && (
          <div className="rounded border border-dashed border-slate-800 p-6 text-sm text-slate-400">
            No playlists yet. Create your first one above.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPanel;
