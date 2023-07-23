import { Payload, Message, MID } from "@tools/Types";
import { divSpinner, styled, svgCheck, svgCross, svgPlus, svgSideLength, template } from "@tools/utils/SubmitTextStatics";
import { logDispatcher } from "@tools/utils/Logging";


class SubmitText extends HTMLElement {
    // Set up logger
    readonly SubmitTextLogger = logDispatcher.getLogger('content-scripts.SubmitText');

    readonly shadow: ShadowRoot;
    submitButton: HTMLButtonElement;

    constructor() {
        super();

        const SubmitTextConstructorLogger = this.SubmitTextLogger.setSubmodule('constructor');

        // Create a shadow root
        this.shadow = this.attachShadow({ mode: "open" });

        SubmitTextConstructorLogger.debug("Created shadow root with { mode: 'open' }");
        SubmitTextConstructorLogger.debug("Generating button appearance and its logic; appending it to shadow root.");

        // Generate button appearance and its logic and append it to the shadow root
        this.render();
        // Get the button HTML element
        this.submitButton = this.shadow.getElementById("dexSubmitTextButton") as HTMLButtonElement;

        SubmitTextConstructorLogger.debug("Got 'submitButton'.", { args: [this.submitButton] });
    }

    get markerPosition(): any {
        const markerPosition: any = JSON.parse(this.getAttribute("markerPosition") || "{}");

        this.SubmitTextLogger.setSubmodule('markerPosition').debug("Got 'markerPosition'.", { args: [markerPosition] });

        return markerPosition;
    }

    get styleElement(): HTMLStyleElement | null {
        const styleElement: HTMLStyleElement | null = this.shadow.querySelector("style");

        this.SubmitTextLogger.setSubmodule('styleElement').debug("Got 'styleElement'.", { args: [styleElement] })

        return styleElement;
    }

    static get observedAttributes(): string[] {
        // Cannot log that cause it's static
        return ["markerPosition", "ensureButtonActive"];
    }

    render(): void {

        // Create an instance of the style element (button)
        const style: HTMLStyleElement = document.createElement("style");

        const SubmitTextRenderLogger = this.SubmitTextLogger.setSubmodule('render');
        SubmitTextRenderLogger.debug("Created style element of the button.", { args: [style] });

        // Define style of the button
        style.textContent = styled({});

        SubmitTextRenderLogger.debug("Defined style of the button; 'style.textContent'.");
        SubmitTextRenderLogger.debug("Appending style element to the shadow root.");

        // Append style element to the shadow root
        this.shadow.appendChild(style);

        // Append button's HTML to the shadow root
        this.shadow.innerHTML += template(svgPlus(svgSideLength, svgSideLength));

        SubmitTextRenderLogger.debug("Append button's HTML to the shadow root");
        SubmitTextRenderLogger.debug("Added an event listener. Awaiting an event 'click' on 'dexSubmitTextButton'.");

        // Add logic to the button
        this.shadow
            .getElementById("dexSubmitTextButton")
            ?.addEventListener("click", () => {

                SubmitTextRenderLogger.debug("Got event 'click' on 'dexSubmitTextButton'.");
                SubmitTextRenderLogger.debug("Deactivating button.");

                // first deactivate button
                this.updateButtonActive(false);

                SubmitTextRenderLogger.debug("Updating button appearabce to 'divSpinner'.");

                // update button 
                this.updateButtonAppearance(divSpinner);

                SubmitTextRenderLogger.debug("Dispatching highlighted text.");

                // dispatch highlighted text
                this.getHighlightedText();

            });

    }

    /**
     * Set button behaviour and cursor appearance to active/disabled
     * 
     * @param {boolean} active if set to false button appearance and behaviour will be disabled. 
     * Default: true
     */
    updateButtonActive(active = true): void {

        const SubmitTextUpdateButtonActiveLogger = this.SubmitTextLogger.setSubmodule('updateButtonActive');
        SubmitTextUpdateButtonActiveLogger.debug("Setting 'submitButton.disabled'.", { args: [active] });

        this.submitButton.disabled = !active;

        if (active) {
            SubmitTextUpdateButtonActiveLogger.debug("Setting 'submitButton.style.cursor' to 'pointer'.");

            this.submitButton.style.cursor = "pointer";
        } else {
            SubmitTextUpdateButtonActiveLogger.debug("Setting 'submitButton.style.cursor' to 'default'.");


            this.submitButton.style.cursor = "default";
        }
    }

    /**
     * @param {string} content String with a valid html element
     */
    updateButtonAppearance(content: string): void {
        this.submitButton.innerHTML = content;
    }

    /**
     * Called when attributes are added, removed, or changed. Here, I'm interested in the 
     * setMarkerPosition() that is run on "click" and "selectionchange" events from content.js
     * script. If the funtion is called with the name argument set to "markerPosition" it
     * shall alter the position of the marker. However when the "selectionchange" event
     * is triggered, the attributeChangedCallback() will be called with name argument set
     * to "ensureButtonActive" which will execute updateButtonActive() function that ensures
     * the button is and appears as active.
     * 
     * @param {string} name attribute of interest
     */
    attributeChangedCallback(name: string, oldValue: any, newValue: any) {

        this.SubmitTextLogger.setSubmodule('attributeChangedCallback').debug("Calling 'attributeChangedCallback()' with 'name'.", { args: [name] });

        if (name === "markerPosition" && this.styleElement !== null) {

            // called with the name argument set to "markerPosition" - alter the position of the marker
            this.styleElement.textContent = styled(this.markerPosition);

        } else if (name === "ensureButtonActive") {

            // called with name argument set to "ensureButtonActive" - ensure that the button appears and acts as active
            this.updateButtonActive(true);
            this.updateButtonAppearance(svgPlus(svgSideLength, svgSideLength));

        }
    }

    getHighlightedText() {

        let highlightedText: string | undefined = window.getSelection()?.toString();

        const SubmitTextGetHighlightedTextLogger = this.SubmitTextLogger.setSubmodule('getHighlightedText');
        SubmitTextGetHighlightedTextLogger.debug("Got highlighted text.", { args: [highlightedText] });

        // Check if any text is selected
        if (highlightedText === undefined ? false : highlightedText.length > 0) {

            const payload: Payload.RequestCreateNote = {
                title: null,
                body: highlightedText as string,
                src: window.location.href
            }

            const message: Message = {
                mid: MID.RequestCreateNote,
                payload: payload,
                _sender: 'content-scripts.SubmitText',
                _recipient: 'service-worker'
            };

            SubmitTextGetHighlightedTextLogger.debug("Composed a message that is to be send to service-worker.", { args: [message] });

            // Send it to the service-worker
            (async () => {

                const response = await chrome.runtime.sendMessage(message);

                if (response) {
                    SubmitTextGetHighlightedTextLogger.debug("Got response from the service worker.", { args: [response] });
                    if (!Message.isValid(response)) { SubmitTextGetHighlightedTextLogger.warn("Response has incorrect format.", { args: [response, ...(Message.isValid(response, undefined, true) as string[])] }) }
                }
                else { SubmitTextGetHighlightedTextLogger.debug("Undefined response."); }

                if (response.externalResponseStatus.success) {
                    SubmitTextGetHighlightedTextLogger.debug(`'response.externalResponseStatus.success': ${response.externalResponseStatus.success}. Running 'updateButtonAppearance()' with 'svgCheck()'.`);

                    // Change the appearance of the "+" button from loading to success
                    this.updateButtonAppearance(svgCheck(svgSideLength, svgSideLength));
                } else {
                    SubmitTextGetHighlightedTextLogger.warn(`'response.success': ${response.externalResponseStatus.success}. Running 'updateButtonAppearance()' with 'svgCross()'.`);

                    // Change the appearance of the "+" button from loading to warning
                    this.updateButtonAppearance(svgCross(svgSideLength, svgSideLength));
                }

            })();

        }
    }
}

window.customElements.define("submit-text", SubmitText);