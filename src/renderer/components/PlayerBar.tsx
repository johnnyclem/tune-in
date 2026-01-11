import React from 'react';
import type { Track } from '../types';

type Props = {
  track: Track | null;
  isPlaying: boolean;
  onToggle: () => void;
  onNext: () => void;
};

const PlayerBar = ({ track, isPlaying, onToggle, onNext }: Props) => {
  return (
    <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900 px-6 py-4">
      <div>
        <p className="text-sm font-semibold">{track ? track.title : 'Select a track'}</p>
        <p className="text-xs text-slate-400">{track ? track.artist : 'No track playing'}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={onNext}
          className="rounded border border-slate-700 px-4 py-2 text-sm text-slate-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PlayerBar;
