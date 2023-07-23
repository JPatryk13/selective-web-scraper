export class WindowDimensions {
    static getWidth(window: Window & typeof globalThis): number {
        return window.innerWidth;
    }

    static setWidth(element: HTMLBodyElement, width: number): void {
        element.style.width = `${width}px`;
    }

    static setWidthBasedOn(element: HTMLBodyElement, targetWidths: number[], minWidthBreakpoints: number[], currentWidth: number): void {
        if (targetWidths.length !== minWidthBreakpoints.length) {
            throw new Error(`'targetWidth' and 'minWidthBreakpoints' must be the same length. Got ${targetWidths.length} and ${minWidthBreakpoints.length} respectively.`);
        }
        for (let i = 0; i < targetWidths.length; i++) {
            if (currentWidth >= minWidthBreakpoints[i]) {
                WindowDimensions.setWidth(element, targetWidths[i]);
            }
        }
    }
}