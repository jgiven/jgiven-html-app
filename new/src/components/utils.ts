export function addRuntime(input: { durationInNanos: number }): string {
    return input.durationInNanos > 1e7 ? `(${(input.durationInNanos / 1e9).toFixed(3)}s)` : "";
}
