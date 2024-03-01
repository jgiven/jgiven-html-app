export function addRuntimeInSeconds(durationInNanos: number ): string {
    return addRuntime(durationInNanos, 1e7, 1e9, "s");
}

export function addRuntimeInMiliseconds(durationInNanos: number): string {
    return addRuntime(durationInNanos, 1e4, 1e6,  "ms");
}

function addRuntime(durationInNanos: number, treshhold: number, divisor: number, unitOfMeasure: string): string {
    return durationInNanos > treshhold ? `(${(durationInNanos / divisor).toFixed(3)}${unitOfMeasure})` : "";
}

