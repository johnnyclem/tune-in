# Tune-In Jira Project Setup

## Proposed Jira Project
- Name: Tune-In
- Key: TUNE
- Type: Software
- Template: Company-managed Kanban
- Default Version: v1.0

## Scope Artifact
- Backlog import file: `/Users/johnnyclem/Desktop/OpenCode_Repos/tune-in/docs/jira/tune-in-jira-import.csv`
- Coverage: 9 epics and 73 total issues (epics + stories + tasks + bugs)
- Status baseline from current codebase review (as of 2026-02-14):
  - Done: 17
  - To Do: 56

## Parallel Dispatch Design (Gastown)
Use label-based workstreams so teams can execute independently:
- `lane-core`
- `lane-library`
- `lane-playlist`
- `lane-playback`
- `lane-device`
- `lane-export`
- `lane-security`
- `lane-qa`
- `lane-pm`

Recommended WIP limits per lane:
- Core/Security/QA: 2 each
- Library/Playlist/Playback/Device/Export: 3 each
- PM/Docs: 2

## CSV Field Mapping (Jira Import)
Map these columns during CSV import:
- `Issue Type` -> Issue Type
- `Summary` -> Summary
- `Description` -> Description
- `Priority` -> Priority
- `Status` -> Status
- `Labels` -> Labels
- `Epic Name` -> Epic Name
- `Epic Link` -> Epic Link
- `Story Points` -> Story point estimate

Optional fields for planning-only context (can be mapped to custom fields or ignored):
- `Parallel Stream`
- `Dependency Hint`

## Post-Import Board Setup
- Create quick filters:
  - `labels = lane-core`
  - `labels = lane-library`
  - `labels = lane-playlist`
  - `labels = lane-playback`
  - `labels = lane-device`
  - `labels = lane-export`
  - `labels = lane-security`
  - `labels = lane-qa`
  - `labels = lane-pm`
- Create saved filter for v1 scope:
  - `labels = v1-0 ORDER BY priority DESC, created ASC`
- Create saved filter for unblock-ready work:
  - `labels = v1-0 AND status = "To Do" AND labels not in (lane-core, lane-security)`

## Notes
- Status values were pre-filled per issue based on implemented functionality already present in this repository and open defects/gaps remaining to reach a functional v1.0.
- P0 stability/security issues are represented as `Bug` items with `Highest` priority for immediate dispatch.
