import path from 'node:path';

export const supportedFormats = ['.mp3', '.wav', '.aiff', '.aac', '.ogg', '.flac'];

export const isSupportedAudio = (filePath: string) => {
  const ext = path.extname(filePath).toLowerCase();
  return supportedFormats.includes(ext);
};

export type NormalizedMetadata = {
  title: string;
  artist: string;
  album: string;
  duration: number;
};

export const normalizeMetadata = (metadata: Partial<NormalizedMetadata>) => {
  return {
    title: metadata.title ?? 'Unknown Title',
    artist: metadata.artist ?? 'Unknown Artist',
    album: metadata.album ?? 'Unknown Album',
    duration: metadata.duration ?? 0
  };
};
