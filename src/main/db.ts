import Database from 'better-sqlite3';
import path from 'node:path';
import { app } from 'electron';

export type TrackRecord = {
  id: number;
  path: string;
  title: string | null;
  artist: string | null;
  album: string | null;
  duration: number | null;
  metadata: string | null;
};

export type PlaylistRecord = {
  id: number;
  name: string;
};

export type DeviceRecord = {
  id: number;
  mountPath: string;
  name: string | null;
};

let db: Database.Database;

export const getDbPath = () => {
  if (process.env.MUSICJUKE_DB_PATH) {
    return process.env.MUSICJUKE_DB_PATH;
  }
  if (app.isReady()) {
    const userData = app.getPath('userData');
    return path.join(userData, 'musicjuke.sqlite');
  }
  return path.join(process.cwd(), 'musicjuke.sqlite');
};

export const initDb = (dbPath = getDbPath()) => {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT UNIQUE NOT NULL,
      title TEXT,
      artist TEXT,
      album TEXT,
      duration REAL,
      metadata TEXT
    );
    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS playlist_tracks (
      playlist_id INTEGER NOT NULL,
      track_id INTEGER NOT NULL,
      position INTEGER NOT NULL,
      PRIMARY KEY (playlist_id, track_id),
      FOREIGN KEY (playlist_id) REFERENCES playlists(id),
      FOREIGN KEY (track_id) REFERENCES tracks(id)
    );
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mountPath TEXT UNIQUE NOT NULL,
      name TEXT
    );
  `);
};

export const getDb = () => db;

export const closeDb = () => {
  if (db) {
    db.close();
  }
};
