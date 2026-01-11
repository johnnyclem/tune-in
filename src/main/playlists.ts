import fs from 'fs-extra';
import path from 'node:path';
import { getDb, PlaylistRecord, TrackRecord } from './db.js';

export type PlaylistSummary = {
  id: number;
  name: string;
  trackCount: number;
};

export const createPlaylist = (name: string) => {
  const result = getDb().prepare('INSERT INTO playlists (name) VALUES (?)').run(name);
  return result.lastInsertRowid as number;
};

export const getPlaylists = (): PlaylistSummary[] => {
  const rows = getDb()
    .prepare(
      `SELECT playlists.id, playlists.name, COUNT(playlist_tracks.track_id) as trackCount
       FROM playlists
       LEFT JOIN playlist_tracks ON playlists.id = playlist_tracks.playlist_id
       GROUP BY playlists.id
       ORDER BY playlists.name`
    )
    .all() as { id: number; name: string; trackCount: number }[];

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    trackCount: row.trackCount
  }));
};

export const addTrackToPlaylist = (playlistId: number, trackId: number) => {
  const position = getDb()
    .prepare('SELECT COUNT(*) as count FROM playlist_tracks WHERE playlist_id = ?')
    .get(playlistId) as { count: number };

  getDb()
    .prepare(
      'INSERT OR IGNORE INTO playlist_tracks (playlist_id, track_id, position) VALUES (?, ?, ?)'
    )
    .run(playlistId, trackId, position.count + 1);
};

export const getPlaylistTracks = (playlistId: number): TrackRecord[] => {
  return getDb()
    .prepare(
      `SELECT tracks.* FROM tracks
       INNER JOIN playlist_tracks ON tracks.id = playlist_tracks.track_id
       WHERE playlist_tracks.playlist_id = ?
       ORDER BY playlist_tracks.position`
    )
    .all(playlistId) as TrackRecord[];
};

export const exportPlaylistM3U = async (playlistId: number, targetPath: string) => {
  const tracks = getPlaylistTracks(playlistId);
  const content = ['#EXTM3U', ...tracks.map((track) => track.path)].join('\n');
  await fs.outputFile(targetPath, content);
};

export const getPlaylistExportPreview = (playlistId: number) => {
  const tracks = getPlaylistTracks(playlistId);
  return tracks.map((track) => track.path).join('\n');
};
