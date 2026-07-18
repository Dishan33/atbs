# IGNOU MAPC Study Library

A static, browser-based study library for IGNOU MAPC courses MPC-001 through MPC-006.

## Run locally

There is no build step. Serve the repository root with any static file server, for example:

```sh
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765/`.

## Project structure

- `index.html` is the course library and local profile entry point.
- The six `MPC 00X - …` folders contain the active course dashboards.
- `course-nav.js` supplies the shared course switcher.
- `app-profile.js` and `study-progress.js` store the profile, revision status, and notes in browser `localStorage` under `mapc-study-profile-v1`.
- Older source-material folders remain in place so existing URLs keep working. Their PDFs and printable sheets are surfaced from the active MPC-001, MPC-002, and MPC-006 dashboards.

## Deployment and analytics

The repository is deployable directly as a static Vercel project. Web Analytics is loaded on `index.html` and the six top-level course dashboards only. Embedded flashcards, notes, and PDFs do not load a second tracker, which prevents iframe page views from inflating traffic counts.

Enable Web Analytics in the Vercel project dashboard before deploying. Vercel provides the `/_vercel/insights/script.js` route after Analytics is enabled and the project is redeployed. See the [Vercel Web Analytics quickstart](https://vercel.com/docs/analytics/quickstart).

## Data behavior

Profiles and study progress are private to the current browser and device. Removing the local profile clears that browser's saved revision data. There is no remote account or cross-device synchronization.
