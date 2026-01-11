import { isSupportedAudio, normalizeMetadata, supportedFormats } from '../src/main/utils.js';

test('supportedFormats includes mp3', () => {
  expect(supportedFormats).toContain('.mp3');
});

test('isSupportedAudio validates extensions', () => {
  expect(isSupportedAudio('/music/track.mp3')).toBe(true);
  expect(isSupportedAudio('/music/track.txt')).toBe(false);
});

test('normalizeMetadata fills defaults', () => {
  const result = normalizeMetadata({ title: 'Song' });
  expect(result.artist).toBe('Unknown Artist');
  expect(result.album).toBe('Unknown Album');
  expect(result.duration).toBe(0);
});
