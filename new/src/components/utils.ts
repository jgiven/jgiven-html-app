export function addRuntime(input: { durationInNanos: number }): string {
    return input.durationInNanos > 1e9 ? `(${(input.durationInNanos / 1e9).toFixed(3)}s)` : "";
    //`(${Math.round(input.durationInNanos/1e6)}ms)` : "";
}
