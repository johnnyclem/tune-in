# MusicJuke V1 Demo

MusicJuke is a cross-platform desktop jukebox manager built with Electron, React, and SQLite. This V1 demo focuses on device integration, library management, playlist creation, and basic playback.

## Features

- Import local music folders and store metadata in SQLite.
- Track library with optimized virtualized list rendering.
- Playlist creation and track assignment.
- Basic playback with Howler.js.
- Device mount detection (via chokidar).
- Basic FFmpeg conversion helper (for future format conversion flow).

## Tech Stack

- **Electron + Node.js** for desktop shell and backend logic.
- **React (hooks)** for the renderer UI.
- **SQLite (better-sqlite3)** for storage.
- **Howler.js** for playback.
- **Tailwind CSS** for styling.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- (Optional) FFmpeg installed locally for conversion support

### Install Dependencies

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Build for Distribution

```bash
npm run package
```

## Tests

```bash
npm test
```

## Project Structure

```
/src/main        Electron main process + backend modules
/src/renderer    React UI
/db              SQLite schema snapshot
/tests           Jest unit tests
```

## Notes / Blockers

- Hardware mount detection uses OS mount roots; Windows drive letters are checked in a default list.
- The FFmpeg conversion helper expects FFmpeg to be installed and on PATH.

## Backlog (V2)

- Smart playlists and advanced filters
- Better device synchronization UI
- Track analytics and play history
- Artwork fetching and caching

## Demo Video / Repo

- Repo: (add your GitHub URL here)
- Demo video: (add your demo link here)
