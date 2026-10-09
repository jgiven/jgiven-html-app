#!/usr/bin/env python3
"""Plot golden-gap snapshots over time."""

from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path

import matplotlib.dates as mdates
import matplotlib.pyplot as plt

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
DEFAULT_SNAPSHOTS = REPO_ROOT / "reports" / "golden-gap" / "snapshots.jsonl"
DEFAULT_OUTPUT = REPO_ROOT / "reports" / "golden-gap" / "chart.png"


def load_snapshots(path: Path) -> list[dict]:
    if not path.exists():
        raise FileNotFoundError(f"Snapshots file not found: {path}")

    snapshots: list[dict] = []
    for line_no, line in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), start=1):
        line = line.strip()
        if not line:
            continue
        try:
            snapshots.append(json.loads(line))
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON on line {line_no} of {path}") from exc

    if not snapshots:
        raise ValueError(f"No snapshots found in {path}")

    snapshots.sort(key=lambda row: row["timestamp"])
    return snapshots


def parse_timestamp(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def total_increase_indices(totals: list[int]) -> list[int]:
    indices: list[int] = []
    for index in range(1, len(totals)):
        if totals[index] > totals[index - 1]:
            indices.append(index)
    return indices


def plot_snapshots(
    snapshots: list[dict],
    *,
    show_total: bool,
    mark_total_increases: bool,
    output: Path,
) -> None:
    timestamps = [parse_timestamp(row["timestamp"]) for row in snapshots]
    gaps = [row["gap"] for row in snapshots]
    totals = [row["total"] for row in snapshots]

    fig, ax = plt.subplots(figsize=(10, 5))
    ax.plot(timestamps, gaps, marker="o", linewidth=2, label="gap")

    if show_total:
        ax.plot(timestamps, totals, marker="s", linewidth=1.5, linestyle="--", label="total")

    if mark_total_increases:
        for index in total_increase_indices(totals):
            ax.axvline(timestamps[index], color="tab:orange", linestyle=":", alpha=0.7)

    ax.set_title("Golden test gap over time")
    ax.set_xlabel("Timestamp")
    ax.set_ylabel("Count")
    ax.grid(True, alpha=0.3)
    ax.legend()
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m-%d\n%H:%M"))

    fig.autofmt_xdate()
    output.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(output, dpi=150)
    plt.close(fig)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Plot golden-gap snapshots over time.")
    parser.add_argument(
        "--snapshots",
        type=Path,
        default=DEFAULT_SNAPSHOTS,
        help=f"Path to snapshots JSONL (default: {DEFAULT_SNAPSHOTS})",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Output chart PNG (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--show-total",
        action="store_true",
        help="Also plot total test count on the same chart.",
    )
    parser.add_argument(
        "--mark-total-increases",
        action="store_true",
        help="Mark timestamps where total increased with vertical lines.",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()
    snapshots = load_snapshots(args.snapshots)
    plot_snapshots(
        snapshots,
        show_total=args.show_total,
        mark_total_increases=args.mark_total_increases,
        output=args.output,
    )
    print(f"Chart written to {args.output}")


if __name__ == "__main__":
    main()
