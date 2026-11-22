# Unical · Timetable → Calendar

A static, browser-only tool that turns a saved university timetable page into an
`.ics` file for Outlook, Google Calendar or Apple Calendar. It is the revived core
feature of [Unical](../README.md), a 2024 student group project.

Live: https://zhiyunxu20.github.io/projects/unical/

- **Schools:** University of Liverpool ("Semester view" page) and XJTLU (e-Bridge
  student timetable).
- **Private by design:** the file is read in the browser with `DOMParser`; nothing is
  uploaded and there is no server or AI at runtime.
- **Correct dates:** Liverpool week numbers are mapped to dates with the official
  term dates, skipping the Christmas/Easter breaks and exam weeks. XJTLU users enter
  the Monday of week 1.
- **Correct times:** slot times are read from the table header (evening classes
  work), and events carry a `TZID` with a `VTIMEZONE` (`Europe/London` or
  `Asia/Shanghai`), so daylight-saving changes are handled.

## Develop

```sh
cd ics-tool
npm install
npm run dev      # local dev server
npm test         # parser, term-date, schedule and ICS tests
npm run build    # static files in dist/
```

Tests and the "Try the sample" button use synthetic timetables in
`public/samples/` (made-up modules, staff and rooms) that mirror the real page
structure. **Never commit real timetables**: they contain names and student IDs.
`private/` and `*.real.html` are git-ignored for local testing.

## Code map

| File | What it does |
| --- | --- |
| `src/core/liverpool.js` | Parses `#tblSemesterView` (days as rows, 30-min columns). |
| `src/core/xjtlu.js` | Parses `table.maintable` (days as columns). Handles e-Bridge repeating every cell in each row it covers. |
| `src/core/weeks.js` | Week strings: `S2 01-S2 08, S2 09-S2 12`, `Week:2-7, 9-14`. |
| `src/core/schedule.js` | Weekly classes → dated sessions. |
| `src/core/ics.js` | RFC 5545 writer (time zones, escaping, line folding, alarms, stable UIDs). |
| `src/core/termdates.js` | Parses https://www.liverpool.ac.uk/term-dates/. |
| `src/data/liverpool-terms.json` | Teaching weeks per academic year. |
| `scripts/update-liverpool-terms.mjs` | Refreshes the JSON from the term-dates page. |

### Liverpool term dates

The university page only lists the current and future years. Only rows reading
"N weeks teaching" count; "weeks break" and "weeks teaching and assessment"
(exams) have no classes. Semester 1 is the autumn block; Semester 2 counts from
early February and continues after Easter. Years before 2026/27 come from the
original project's table, with its errors fixed. CI runs the updater before every
build and keeps the bundled data if the page cannot be fetched or parsed.

## Deploy

`.github/workflows/deploy-ics-tool.yml` runs on every push to the `demo` branch
that touches `ics-tool/`. It tests, builds and copies `dist/` into
`projects/unical/` of the personal site repo `ZhiyunXu20/zhiyunxu20.github.io`.

One-time setup:

1. Create a key pair (no passphrase):
   `ssh-keygen -t ed25519 -C unical-deploy -f unical_deploy -N ""`
2. In the personal site repo: **Settings → Deploy keys → Add deploy key**, paste
   `unical_deploy.pub`, tick **Allow write access**.
3. In this repo: **Settings → Secrets and variables → Actions → New repository
   secret**, name `SITE_DEPLOY_KEY`, paste the contents of `unical_deploy`.
4. Delete both key files from your computer, then open the latest
   "Deploy timetable tool" run in the Actions tab and click **Re-run jobs** (or push to `demo`).

If the site is built by a framework rather than served as plain files, change
`SITE_PATH` in the workflow to its static folder (for example
`public/projects/unical`).
