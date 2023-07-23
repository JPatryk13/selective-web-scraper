import { Payload, Message, MID } from "@tools/Types";
import { logDispatcher } from "@tools/utils/Logging";
import { WindowDimensions } from "@tools/utils/WindowDimensions";

const GetWidnowWidthLogger = logDispatcher.getLogger('content-scripts.GetWindowWidth');

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        GetWidnowWidthLogger.debug("Got message from 'sender'.", { args: [sender, request] });

        if (request.mid == MID.RequestGetScreenWidth) {

            GetWidnowWidthLogger.debug("Getting window width.")

            const payload: Payload.ResponseGetScreenWidth = {
                screenWidth: WindowDimensions.getWidth(window)
            }

            const message: Message = {
                mid: MID.ResponseGetScreenWidth,
                payload: payload,
                _sender: 'content-scripts.GetWindowWidth',
                _recipient: 'popup.SetPopupWidth'
            };

            GetWidnowWidthLogger.debug("Sending response to the 'sender'.", { args: [sender, message] });

            sendResponse(message);
        }
    }
);