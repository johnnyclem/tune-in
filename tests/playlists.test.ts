import { initDb, getDb } from '../src/main/db.js';
import { addTrackToPlaylist, createPlaylist, getPlaylistExportPreview } from '../src/main/playlists.js';

test('playlist export preview returns track paths', () => {
  process.env.MUSICJUKE_DB_PATH = ':memory:';
  initDb(':memory:');
  const insertTrack = getDb().prepare(
    'INSERT INTO tracks (path, title, artist, album, duration, metadata) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const info = insertTrack.run('/music/demo.mp3', 'Demo', 'Artist', 'Album', 120, '{}');
  const trackId = Number(info.lastInsertRowid);
  const playlistId = createPlaylist('Favorites');
  addTrackToPlaylist(playlistId, trackId);
  const preview = getPlaylistExportPreview(playlistId);
  expect(preview).toContain('/music/demo.mp3');
});
