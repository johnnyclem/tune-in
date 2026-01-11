import fs from 'fs-extra';
import path from 'node:path';
import { parseFile } from 'music-metadata';
import { getDb, TrackRecord } from './db.js';
import { isSupportedAudio, normalizeMetadata } from './utils.js';

export type LibraryTrack = {
  id: number;
  path: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
};

export const scanDirectory = async (directory: string) => {
  const entries = await fs.readdir(directory);
  const tracks: LibraryTrack[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const nested = await scanDirectory(fullPath);
      tracks.push(...nested);
      continue;
    }

    if (!isSupportedAudio(fullPath)) {
      continue;
    }

    const metadata = await parseFile(fullPath, { duration: true });
    const normalized = normalizeMetadata({
      title: metadata.common.title ?? undefined,
      artist: metadata.common.artist ?? undefined,
      album: metadata.common.album ?? undefined,
      duration: metadata.format.duration ?? undefined
    });

    const insert = getDb().prepare(
      `INSERT OR IGNORE INTO tracks (path, title, artist, album, duration, metadata)
       VALUES (@path, @title, @artist, @album, @duration, @metadata)`
    );

    insert.run({
      path: fullPath,
      title: normalized.title,
      artist: normalized.artist,
      album: normalized.album,
      duration: normalized.duration,
      metadata: JSON.stringify(metadata.common)
    });

    const record = getDb()
      .prepare('SELECT * FROM tracks WHERE path = ?')
      .get(fullPath) as TrackRecord;

    tracks.push({
      id: record.id,
      path: record.path,
      title: record.title ?? normalized.title,
      artist: record.artist ?? normalized.artist,
      album: record.album ?? normalized.album,
      duration: record.duration ?? normalized.duration
    });
  }

  return tracks;
};

export const getAllTracks = (): LibraryTrack[] => {
  const rows = getDb().prepare('SELECT * FROM tracks ORDER BY artist, album, title').all() as TrackRecord[];
  return rows.map((row) => ({
    id: row.id,
    path: row.path,
    title: row.title ?? 'Unknown Title',
    artist: row.artist ?? 'Unknown Artist',
    album: row.album ?? 'Unknown Album',
    duration: row.duration ?? 0
  }));
};
