export type MarkerPosition = {
    left?: number;
    top?: number;
    display: string;
};

export class UIManager {
    static setMarkerPosition(markerPosition: MarkerPosition, element: HTMLElement): void {
        element.setAttribute(
            "markerPosition",
            JSON.stringify(markerPosition)
        );
    }

    static ensureButtonActive(element: HTMLElement): void {
        element.setAttribute(
            "ensureButtonActive",
            ""
        );
    }

    static getSelectedText(window: Window & typeof globalThis): string | undefined {
        return window.getSelection()?.toString();
    }

    static getMarkerPosition(window: Window & typeof globalThis): MarkerPosition | undefined {

        const rangeBounds: DOMRect | undefined = window.getSelection()?.getRangeAt(0).getBoundingClientRect();

        if (rangeBounds) {
            return {
                // Subtract width of marker button -> 40px / 2 = 20
                left: rangeBounds.left + rangeBounds.width / 2 - 20,
                top: rangeBounds.top - 30,
                display: "flex",
            };
        }
    }
}