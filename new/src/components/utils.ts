export function addRuntime(input: {durationInNanos:number}): string{
    return input.durationInNanos > 1e7 ? `(${Math.round(input.durationInNanos/1e6)}ms)` : "";
}