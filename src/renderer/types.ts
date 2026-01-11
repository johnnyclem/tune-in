export type Track = {
  id: number;
  path: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
};

export type Playlist = {
  id: number;
  name: string;
  trackCount: number;
};
