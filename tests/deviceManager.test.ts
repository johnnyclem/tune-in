import { getDefaultMountRoots } from '../src/main/deviceManager.js';

test('getDefaultMountRoots returns at least one path', () => {
  const roots = getDefaultMountRoots();
  expect(Array.isArray(roots)).toBe(true);
  expect(roots.length).toBeGreaterThan(0);
});
