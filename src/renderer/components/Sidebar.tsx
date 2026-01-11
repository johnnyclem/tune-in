import React from 'react';

type Props = {
  activeView: 'library' | 'playlists' | 'devices';
  onChangeView: (view: 'library' | 'playlists' | 'devices') => void;
  onImport: () => void;
  deviceCount: number;
};

const Sidebar = ({ activeView, onChangeView, onImport, deviceCount }: Props) => {
  const navItems: { key: Props['activeView']; label: string; badge?: string }[] = [
    { key: 'library', label: 'Library' },
    { key: 'playlists', label: 'Playlists' },
    { key: 'devices', label: 'Devices', badge: deviceCount ? String(deviceCount) : undefined }
  ];

  return (
    <aside className="flex w-64 flex-col border-r border-slate-800 bg-slate-900">
      <div className="px-6 py-5">
        <h1 className="text-lg font-semibold">MusicJuke</h1>
        <p className="text-xs text-slate-400">V1 Demo</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onChangeView(item.key)}
            className={`flex w-full items-center justify-between rounded px-4 py-2 text-left text-sm font-medium transition ${
              activeView === item.key
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            {item.label}
            {item.badge && (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-200">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4">
        <button
          onClick={onImport}
          className="w-full rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
        >
          Import Folder
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
