Resultium GreenPath UI
======================

An Electron + React desktop console for monitoring and operating a controlled-environment greenhouse. The app runs in kiosk mode on a 1024×600 panel, shows live climate / irrigation telemetry, and exposes automation controls and settings through a tailored UI.

![Main dashboard preview](app/assets/era-preview.png)

---

At a Glance
-----------
- **Real-time dashboard** for air, water, and TEC stack parameters, plus plant-lighting status.
- **Alerting pipeline** that surfaces warnings, announcements, and connection state for the worker and RS-485 bus.
- **Settings workspace** backed by JSON persistence, with sections for General, Climate, Irrigation, and System connectivity.
- **Debug tooling** to toggle views, inject mock announcements, and validate warning behavior while telemetry is under development.
- **Type-safe IPC layer (Conveyor)** that connects React components to Electron handlers using Zod-validated contracts.

Getting Started
---------------

### Prerequisites
- Node.js 20+ (matches the Electron/Vite toolchain).
- npm (bundled with Node) or an alternative package manager.
- macOS, Windows, or Linux host with GUI access.

### Installation
```bash
npm install
```

### Development Workflow
```bash
npm run dev
```
This launches both the Vite renderer and Electron main process with hot reload. The window opens in kiosk mode; press <kbd>F12</kbd> for devtools or <kbd>Ctrl/Cmd + R</kbd> to reload during development.

### Production Builds
```bash
# Generate packed installers
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux

# Or produce unpacked output in dist/
npm run build:unpack
```

Architecture Overview
---------------------

```
app/
  components/…          # React dashboard, modals, and context providers
  styles/               # Tailwind-driven styling and custom CSS
lib/
  main/                 # Electron main process (BrowserWindow, worker client, settings)
  preload/              # Safe bridge exposing IPC helpers to the renderer
  conveyor/             # Type-safe IPC schema, API clients, and handlers
resources/              # Application icon, static assets
```

- **Electron main (`lib/main/app.ts`)** creates the kiosk window and registers Conveyor IPC handlers.
- **Worker bridge (`lib/main/worker/WorkerHandler.ts`)** maintains a UNIX socket connection to the external greenhouse worker, broadcasting status updates into the renderer.
- **Renderer contexts (`app/components/hooks/`)** centralize app state (data, warnings, announcements, dispatch, view management).
- **Conveyor IPC** offers type-safe wrappers (`lib/conveyor/api/*.ts`) and Zod-validated schemas (`lib/conveyor/schemas/*.ts`) for settings, window controls, and app metadata.

Telemetry & Worker Integration
------------------------------

The app expects to connect to a background “worker” process over a UNIX socket:
- **Socket path:** `/tmp/greenhouse.sock` (see `lib/main/app.ts`).
- **Protocol:** newline-delimited JSON messages. Each message must include an `event` field (e.g. `status_update`, `sensor_update`, `actuator_state`) and a `data` payload.
- **Status handling:** `status_update` payloads update RS-485 connectivity and general worker health within `DispatchContext`. Additional events (telemetry, actuator feedback) should be normalized and dispatched into `DataContext` as the worker implementation matures.

While backend telemetry is under development, the debug menu (`Open Menu` button on the right side in dev builds) lets you:
- Toggle greenhouse status codes.
- Inject mock warnings and announcements.
- Switch between dashboard layouts (cooling vs. system views, water flow diagram, etc.).

Settings Persistence
--------------------
- **Default values:** defined in `lib/main/settings.ts#createDefaultSettings`.
- **Storage location:** `${app.getPath('userData')}/settings.json`.
- **Renderer access:** through the Conveyor settings API (`useConveyor('settings')` in React).
- **Update flow:** the settings modal computes diffs against the last-loaded snapshot and only sends changed keys over IPC.

Customization Notes
-------------------
- Target display resolution is currently hard-coded to 1024×600 in `lib/main/app.ts`. Update the `targetDisplay` logic if you need different hardware.
- Colors, icons, and gauge behavior live in `app/components/layout/components/*.tsx` and can be themed via Tailwind utility classes or component props.
- The warning severities and status color map are centralized in `DataContext.tsx` and `WarningsContext.tsx`; adjust them as your alert taxonomy evolves.

Quality of Life Scripts
-----------------------
- `npm run lint` – ESLint with the Electron Toolkit config.
- `npm run format` – Prettier formatting across the repo.

Roadmap & Open Tasks
--------------------
- Finalize the worker telemetry contract and feed live data into `DataContext`.
- Implement the `dispatch` method in `DispatchContext` to send actuator commands back to the worker.
- Expand the README once the worker protocol is stable (message schema, example payloads, troubleshooting).

License
-------

This project is based on the [Electron React App](https://github.com/guasam/electron-react-app) template (MIT). Retain existing license notices when distributing builds.
