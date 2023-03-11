export function addRuntime(input: any): string{
    return input > 1e7 ? `(${Math.round(input/1e6)}ms)` : "";
}