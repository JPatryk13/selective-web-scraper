import { Payload, Message, MID } from "@tools/Types";
import { logDispatcher } from "@tools/utils/Logging";
import { WindowDimensions } from "@tools/utils/WindowDimensions";

// Set up logger
const SetPopupWidthLogger = logDispatcher.getLogger('popup.SetPopupWidth');

// Get the reference to the popup container element
const popupContainer: HTMLBodyElement = document.getElementsByTagName('body')[0];

if (popupContainer) { SetPopupWidthLogger.debug("Got popup container body.", { args: [popupContainer] }); }
else { SetPopupWidthLogger.warn("popupContainer undefined.", { args: [popupContainer] }); }

// Define the desired dimensions based on breakpoints
const minWidthBreakpoints: number[] = [1400, 1200, 992, 768, 576, 0];
const targetPopupWidths: number[] = [450, 450, 350, 350, 300, 300];

(async () => {
    const [tab]: chrome.tabs.Tab[] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    if (tab) { SetPopupWidthLogger.debug("Got tab object.", { args: [tab] }); }
    else { SetPopupWidthLogger.warn("Tab object undefined.", { args: [tab] }); }

    const message: Message = {
        _sender: 'popup.SetPopupWidth',
        _recipient: 'popup.GetWindowWidth',
        mid: MID.RequestGetScreenWidth,
        payload: null as Payload.RequestGetScreenWidth
    };

    SetPopupWidthLogger.debug(`Sending a message to ${message._recipient}.`, { args: [message] });

    const response: Message = await chrome.tabs.sendMessage(tab.id as number, message);

    if (response) { SetPopupWidthLogger.debug(`Got response from ${response._sender}.`, { args: [response] }); }
    else { SetPopupWidthLogger.warn("Got no response to the message.", { args: [message, response] }); }


    WindowDimensions.setWidthBasedOn(popupContainer, targetPopupWidths, minWidthBreakpoints, response.payload.screenWidth);
})();