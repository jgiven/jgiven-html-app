export function renderSymbols(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    // Define the positions and sizes of the symbols
    const symbolSize = 12;
    const symbolPadding = 4;
    const symbolTopPadding = 8;

    const symbolPositions: number[] = [
        canvas.width - symbolSize - symbolPadding,
        canvas.width - 2 * symbolSize - 2 * symbolPadding,
        canvas.width - 3 * symbolSize - 3 * symbolPadding,
        canvas.width - 4 * symbolSize - 4 * symbolPadding,
    ];

    // Define the paths for the symbols
    const minusPath: Path2D = new Path2D();
    minusPath.rect(symbolPositions[0], symbolTopPadding, symbolSize, 2);

    const plusPath: Path2D = new Path2D();
    plusPath.rect(symbolPositions[1], symbolTopPadding, symbolSize, 2);
    plusPath.rect(symbolPositions[1] + symbolSize / 2, symbolTopPadding - symbolSize / 2, 2, symbolSize);

    const timesPath: Path2D = new Path2D();
    timesPath.moveTo(symbolPositions[2] + 1, symbolTopPadding);
    timesPath.lineTo(symbolPositions[2] + symbolSize - 1, symbolTopPadding + symbolSize);
    timesPath.moveTo(symbolPositions[2] + 1, symbolTopPadding + symbolSize);
    timesPath.lineTo(symbolPositions[2] + symbolSize - 1, symbolTopPadding);

    const divisionPath: Path2D = new Path2D();
    divisionPath.moveTo(symbolPositions[3] + 1, symbolTopPadding);
    divisionPath.lineTo(symbolPositions[3] + symbolSize - 1, symbolTopPadding);
    divisionPath.lineTo(symbolPositions[3], symbolTopPadding);

    // Add paths to context and stroke them
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.fill(plusPath);
    ctx.fill(minusPath);
    ctx.fill(timesPath);
    ctx.fill(divisionPath);

    ctx.stroke(plusPath);
    ctx.stroke(minusPath);
    ctx.stroke(timesPath);
    ctx.stroke(divisionPath);
}
