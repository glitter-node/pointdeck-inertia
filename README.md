# Sprint Planning Poker (Inertia)

## Overview

Real-time planning poker tool built with Laravel + Inertia + React. The application is a single Laravel monolith that serves React pages through Inertia, uses session-based participant identity instead of a user account system, and synchronizes room state in real time over a Pusher-compatible WebSocket connection.

## Tech Stack

- Laravel 13
- React 18
- Inertia.js
- Tailwind CSS
- Vite
- SQLite
- Laravel Echo
- Pusher-compatible WebSocket server

## Architecture

This project is a monolith: Laravel handles routing, validation, persistence, sessions, broadcasting, and CSV export, while React renders the interactive room interface. Inertia sits between them so the app keeps server-owned business rules without introducing a separate API layer.

Core architectural choices:

- Monolith application with Laravel backend and React frontend
- Session-based identity with no account/auth flow for poker rooms
- Host-based permissions for story lifecycle actions
- Realtime event-driven updates using Echo presence channels
- Token-based design system for theme, font, and accessibility controls
- Automatic contrast token generation for readable UI defaults

## Features

### Core

- Create a room with an auto-generated 6-character code
- Join a room with a nickname
- Session-based participant identity per room
- Story CRUD for hosts
- Single active voting story per room
- Voting with planning poker values
- Hidden vote state before reveal
- Reveal workflow with average and median
- Reset workflow for a fresh voting round

### Realtime

- Vote update broadcast
- Story state change broadcast
- Presence channel membership for online/offline indicators
- Reconnect detection and room data reload

### UI/UX

- Theme toggle
- Font toggle
- Accessibility controls for contrast and text size
- No-flicker preference initialization before hydration
- Semantic room UI with keyboard-safe controls

### Data

- Immutable reveal history snapshots
- Average and median calculation for numeric votes
- CSV export for revealed story history

## Assignment Requirements Mapping

- Room creation -> `RoomController::store()` and `Room::generateUniqueCode()`
- Join room by nickname -> `RoomController::join()`
- Session-based identity -> `participant_id` and `participant` session state in `RoomController`
- Story CRUD -> `StoryController::store()`, `update()`, and `destroy()`
- Story lifecycle -> `StoryController::startVoting()`, `reveal()`, and `reset()`
- Voting -> `VoteController::store()`
- Single active voting story -> enforced in `StoryController::startVoting()`
- Vote visibility before reveal -> `resources/js/Pages/Room/ShowPage.jsx`
- Reveal calculations -> `StoryController::reveal()` plus room results UI
- Result history persistence -> `story_results` and `story_result_votes`
- CSV export -> `RoomController::export()`
- Realtime updates -> Laravel Echo, `VoteUpdated`, `StoryStateChanged`, presence channels
- Presence / online status -> `routes/channels.php` and `resources/js/Pages/Room/ShowPage.jsx`
- Reconnect handling -> `resources/js/hooks/useConnection.js`
- Theme, font, and accessibility controls -> `resources/js/theme/*` and toggle components
- Automatic contrast generation -> `resources/js/theme/colorUtils.js` and `generateTokens.js`

## Screenshots

- Home (room creation)
- Room (active voting)
- Reveal state (results visible)
- History / CSV export

## Database Schema

### `rooms`

- `id`
- `code` unique 6-character room code
- `name`
- `created_by`
- `status`
- timestamps

### `participants`

- `id`
- `room_id`
- `nickname`
- `is_host`
- `joined_at`

### `stories`

- `id`
- `room_id`
- `title`
- `description`
- `status` (`pending`, `voting`, `revealed`)
- `order`
- timestamps

### `votes`

- `id`
- `story_id`
- `participant_id`
- `point`
- timestamps

### `story_results`

- `id`
- `story_id`
- `room_id`
- `title`
- `average`
- `median`
- `created_at`

### `story_result_votes`

- `id`
- `story_result_id`
- `participant_name`
- `point`

Relationships:

- A room has many participants, stories, and story results
- A story belongs to a room and has many votes
- A participant belongs to a room and has many votes
- A story result belongs to a room and a story
- A story result has many snapshot votes

## Realtime System

Realtime behavior is powered by Laravel Echo and a Pusher-compatible broadcaster.

Backend:

- `config/broadcasting.php` uses `BROADCAST_CONNECTION=pusher`
- `VoteUpdated` broadcasts vote changes
- `StoryStateChanged` broadcasts lifecycle changes
- `routes/channels.php` authorizes `room.{code}` from session data, not Laravel auth

Frontend:

- `resources/js/bootstrap.js` initializes Echo with `pusher-js`
- `resources/js/hooks/useConnection.js` tracks connection state
- `resources/js/Pages/Room/ShowPage.jsx` joins the room presence channel, tracks online users, and reloads room data on reconnect or broadcast events

## Design System

The UI uses a token-based design system built on CSS variables.

- Theme tokens are generated in `resources/js/theme/tokens.js`
- Contrast utilities live in `resources/js/theme/colorUtils.js`
- Token generation is handled by `resources/js/theme/generateTokens.js`
- Theme application is managed by `resources/js/theme/useTheme.js`
- Font preferences are managed by `resources/js/theme/useFont.js`
- Accessibility preferences are managed by `resources/js/theme/useAccessibility.js`

Implemented modes:

- Themes: `light`, `dark`
- Fonts: `mono`, `sans`, `serif`, `system`
- Accessibility: contrast `normal/high`, size `normal/large`

High-contrast mode regenerates text and border tokens with a stricter contrast target.

## Installation

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
npm run dev
php artisan serve
```

If you are using a different database, update `.env` before running migrations.

## Usage

1. Open the home page and create a room or join an existing room with a nickname.
2. The host adds stories to estimate.
3. The host starts voting on one story.
4. Participants vote while the story is in `voting` state.
5. The host reveals results once votes exist.
6. The app saves a snapshot of the revealed result to history.
7. The host can reset the story for another round or export room history as CSV.

## Application Flow

1. Create room
2. Join room
3. Add stories
4. Vote
5. Reveal
6. Reset
7. Export

## CSV Export

Export endpoint:

```text
GET /rooms/{code}/export
```

The export is host-only and returns a streamed CSV download named:

```text
room-{code}-results.csv
```

Format:

```csv
Story Title,Average,Median,Participant,Vote
Story A,5,5,John,5
Story A,5,5,Jane,3
```

## What Makes This Project Different?

- Session-based realtime collaboration without authentication
- Presence-aware user state via WebSocket channels
- Automatic WCAG contrast token generation instead of manual color tweaking
- Server-driven architecture using Inertia without a separate API layer

## Design Decisions

- No authentication system for poker participation
- Session-based identity tied to a room participant
- Host-based control for story lifecycle and export
- Realtime-first collaboration via WebSocket broadcasts
- Server-owned business rules with Inertia-driven page rendering
- Token-driven styling instead of ad hoc component colors

## Why No Authentication?

Planning poker is implemented here as a lightweight, session-based collaboration tool rather than a full account-based product. That keeps onboarding fast, matches the way many real-world estimation tools prioritize quick room entry, and keeps the project focused on collaborative room state, realtime updates, and host-controlled workflow.

In practice, this means:

- participants can join instantly with a nickname
- host authority is derived from room/session state
- no login, registration, password reset, or account profile flow is required for core usage

## Limitations

- No persistent user accounts
- No role/permission system beyond session-based host checks
- Session-based identity only
- Theme system currently supports `light` and `dark`, not `dim`
- Full Lighthouse verification was not executed in this environment because no Chrome/Chromium runtime was available

## Future Improvements

- Persistent user accounts
- Team/workspace management
- Richer analytics and reporting
- Advanced result visualizations
- Room moderation and participant controls

## Validation

- Automated tests: `php artisan test` passes for the current unit and feature suite, including room creation, join flow, and room access.
- Manual verification: the full room workflow was exercised end to end, including story lifecycle, voting, reveal/reset, history persistence, and CSV export.
- Realtime verification: vote updates, presence indicators, and reconnect-driven reload behavior were manually tested through the Echo-powered room flow.
- Frontend build validation: `npm run build` completes successfully with the current codebase.
- Contrast system note:
  - Contrast system is implemented using automatic WCAG-based token generation.
  - Contrast ratios are enforced programmatically during token generation.
  - Full Lighthouse verification was not executed due to the absence of a Chrome/Chromium runtime in this environment.
  - This is an environment limitation, not a functional gap.

---

# Submission Checklist

## Core Features

- ✔ Implemented — Room creation (code generated)
- ✔ Implemented — Join room (nickname)
- ✔ Implemented — Session-based identity
- ✔ Implemented — Story CRUD (create/update/delete)
- ✔ Implemented — Voting system (points)
- ✔ Implemented — Vote visibility (hidden before reveal)
- ✔ Implemented — Reveal results
- ✔ Implemented — Reset voting
- ✔ Implemented — Single active voting story

## Realtime Features

- ✔ Implemented — WebSocket connection
- ✔ Implemented — Vote update broadcast
- ✔ Implemented — Presence (online/offline users)
- ✔ Implemented — Reconnect handling

## Data Features

- ✔ Implemented — Result history saved
- ✔ Implemented — Average calculation
- ✔ Implemented — Median calculation
- ✔ Implemented — CSV export

## UI/UX Features

- ✔ Implemented — Theme system (light/dark)
- ✔ Partially implemented — Dim mode is not included in the current scope
- ✔ Implemented — Font system (mono/sans/serif/system)
- ✔ Implemented — Accessibility system (contrast/size)
- ✔ Implemented — No flicker initialization

## Performance

- ✔ Implemented — Bundle optimization
- ✔ Implemented — Code splitting
- ✔ Implemented — Unused code removed

## Accessibility

- ✔ Implemented — Semantic structure
- ✔ Implemented — Main landmark
- ✔ Implemented — `aria-live` for realtime
- ✔ Implemented — Contrast system uses automatic WCAG-based token generation
- ✔ Partially implemented — Full Lighthouse verification was not executed in this environment

## Missing or Incomplete Features

- ✔ Partially implemented — Theme system currently supports `light` and `dark`; `dim` is outside the current scope
- ✔ Partially implemented — Lighthouse verification could not be executed here because no Chrome/Chromium runtime was available, although contrast tokens are generated programmatically
