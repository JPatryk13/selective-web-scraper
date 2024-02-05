export function logWarnings(warnings: string[]): void {
    for (const warn of warnings) {
        console.warn(warn);
    }
}