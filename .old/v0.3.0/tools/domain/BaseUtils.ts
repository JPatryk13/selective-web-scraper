export function areAllDefined(...args: any[]): boolean {
    return args.every(arg => arg !== undefined);
}

export function areAnyDefined(...args: any[]): boolean {
    return args.some(arg => arg !== undefined);
}