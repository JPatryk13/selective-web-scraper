import { MarkerPosition, UIManager } from "@tools/utils/UIManager";
import { logDispatcher } from '@tools/utils/Logging';

const EventManagerLogger = logDispatcher.getLogger('content-scripts.EventManager');

// submit-text is a wrapper for the button
const submitText = document.createElement("submit-text");
document.body.appendChild(submitText);

EventManagerLogger.debug("Adding 'click' and 'selectionchange' event listeners.");

document.addEventListener("click", () => {

    EventManagerLogger.debug("Got event: 'click'.");

    const selectedText: string | undefined = UIManager.getSelectedText(window);
    const markerPosition: MarkerPosition | undefined = UIManager.getMarkerPosition(window);

    EventManagerLogger.debug("Got 'selectedText' and 'markerPosition'.", { args: [selectedText, markerPosition] });

    if (selectedText && markerPosition) {
        if (selectedText.length > 0) {

            EventManagerLogger.debug("Setting position of 'submitText' to 'markerPosition'.", { args: [submitText, markerPosition] });

            UIManager.setMarkerPosition(markerPosition, submitText);
        }
    }

});

document.addEventListener("selectionchange", () => {

    EventManagerLogger.debug("Got event: 'selectionchange'.");

    const selectedText: string | undefined = UIManager.getSelectedText(window);

    EventManagerLogger.debug("Got 'selectedText'.", { args: [selectedText] });

    if (selectedText ? selectedText.length === 0 : false) {

        EventManagerLogger.debug("Setting position of 'submitText' with { display: 'none' }.", { args: [submitText] });

        UIManager.setMarkerPosition({ display: "none" }, submitText);

        EventManagerLogger.debug("Running 'ensureButtonActive(submitText)' with 'submitText'.", { args: [submitText] });

        UIManager.ensureButtonActive(submitText);
    }

});