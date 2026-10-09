# Golden gap metrics and parity loop

Measures how far `new/` is from passing the shared golden test suite, and supports an agent-driven parity loop.

**Gap** = `total` − `passing_new` (lower is better). Gap is a measurement, not a CI quality gate.

## Capture a snapshot

```bash
node scripts/golden-gap/capture.mjs
```

This will:

1. Build `legacy/` and `new/`
2. Prepare golden fixtures for **both** `legacy/dist/` and `new/build/`
3. Run `playwright test --project=new` with CI retries
4. Append to `reports/golden-gap/snapshots.jsonl`
5. Overwrite `reports/golden-gap/last-failures.json` (current failures only)
6. Update `reports/golden-gap/loop-state.json` when present

Exits `0` even when tests fail.

## Start a parity loop

From the branch you want as the base (do **not** search for existing parity branches):

```bash
node scripts/golden-gap/init-loop.mjs
```

This creates `parity/agent-YYYY-MM-DD` from the current HEAD, checks it out, and writes `loop-state.json`.

Then follow `.cursor/skills/parity-loop/SKILL.md`.

## Loop state commands

```bash
node scripts/golden-gap/loop-state.mjs show
node scripts/golden-gap/loop-state.mjs review-decline
node scripts/golden-gap/loop-state.mjs review-accept
node scripts/golden-gap/loop-state.mjs after-commit
node scripts/golden-gap/loop-state.mjs stop [reason]
```

## Plot snapshots

```bash
pip install -r scripts/golden-gap/requirements.txt
python scripts/golden-gap/plot.py --show-total --mark-total-increases
```

## Gitignored output (`reports/golden-gap/`)

| File | Purpose |
|------|---------|
| `snapshots.jsonl` | Gap time series |
| `last-run.json` | Raw Playwright JSON |
| `last-failures.json` | Current failing tests |
| `loop-state.json` | Parity loop metadata and stop counters |
| `chart.png` | Generated chart |

## Snapshot schema

```json
{"timestamp":"...","git_sha":"...","total":111,"passing_new":12,"gap":99}
```

## Loop state schema

```json
{
  "branch": "parity/agent-2026-06-05",
  "started_at": "...",
  "iteration": 1,
  "last_total": 111,
  "last_gap": 99,
  "gap_unchanged_streak": 0,
  "review_decline_streak": 0,
  "status": "running",
  "stop_reason": null
}
```

Stop conditions (automatic):

- `gap === 0` → `status: completed`
- `total` increased vs previous measure → `stopped`
- `gap` unchanged for 10 measure steps → `stopped`
- 10 consecutive review declines on same uncommitted batch → `stopped`

Human stop: `node scripts/golden-gap/loop-state.mjs stop`
