# new/

Greenfield JGiven HTML report viewer (React + Vite + TypeScript).

Currently a **minimal build shell** only: it produces `new/build/index.html` with `<div id="root">` so golden tests can inject fixture scripts via `tests/golden/scripts/prepare-fixture.mjs`. Application UI and domain code will be added per [.cursor/planning/greenfield.md](../.cursor/planning/greenfield.md).

```bash
npm install
npm start    # http://localhost:3000
npm run build
npm test
```

## Dev setup

-   copy `new/.env.example` to `new/.env` and adjust as needed
