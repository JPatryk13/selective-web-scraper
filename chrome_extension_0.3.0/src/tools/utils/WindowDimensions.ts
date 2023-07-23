import { logDispatcher } from "./Logging";
const WindowDimensionsLogger = logDispatcher.getLogger('tools.utils.WindowDimensions');

export class WindowDimensions {

    static getWidth(window: Window & typeof globalThis): number {
        const innerWidth = window.innerWidth;
        WindowDimensionsLogger.setSubmodule('getWidth').debug(`Returning innerWidth: ${innerWidth}`);
        return innerWidth;
    }

    static setWidth(element: HTMLBodyElement, width: number): void {
        element.style.width = `${width}px`;
        WindowDimensionsLogger.setSubmodule('setWidth').debug(`Setting element.style.width to: ${width}px`, { args: [element] });
    }

    static setWidthBasedOn(element: HTMLBodyElement, targetWidths: number[], minWidthBreakpoints: number[], currentWidth: number): void {
        if (targetWidths.length !== minWidthBreakpoints.length) {
            throw new Error(`'targetWidth' and 'minWidthBreakpoints' must be the same length. Got ${targetWidths.length} and ${minWidthBreakpoints.length} respectively.`);
        }
        WindowDimensionsLogger.setSubmodule('setWidthBasedOn').debug(`Running setWidthBasedOn().`, { args: [element, targetWidths, minWidthBreakpoints, currentWidth] });
        for (let i = 0; i < targetWidths.length; i++) {
            if (currentWidth >= minWidthBreakpoints[i]) {
                WindowDimensions.setWidth(element, targetWidths[i]);
            }
        }
    }
}