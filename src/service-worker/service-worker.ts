import { Payload, Message, MID, ResponseStatus } from "@tools/Types";
import { LogManager, Listener } from "@tools/utils/Logging";
import { RequestHandler } from "@tools/utils/RequestHandler";

const endpoint = "http://127.0.0.1:8000/web_content/";

const ServiceWorkerLogger = new LogManager().configure().registerLogger(Listener.consoleLogListener).getLogger('service-worker');

chrome.runtime.onMessage.addListener(
    (message: Message, _sender, sendResponse) => {

        message.mid !== MID.Log ? ServiceWorkerLogger.debug(`Received a message from ${message._sender}.`, { args: [message] }) : null;

        switch (message.mid) {
            case (MID.RequestCreateNote): {

                ServiceWorkerLogger.debug(`Attempting to send a POST request to: ${endpoint}`);

                // Get response from the API
                RequestHandler.POST(endpoint, message.payload as Payload.RequestCreateNote).then(
                    (response) => RequestHandler.handleResponsePromise(response)
                ).then(
                    (responseData) => RequestHandler.handleResponseData<Payload.ResponseCreateNote>(
                        responseData,
                        sendResponse,
                        Payload.ResponseCreateNote,
                        MID.ResponseCreateNote
                    )
                );

                break;
            }
            case (MID.RequestGetManyNotes): {

                ServiceWorkerLogger.debug(`Attempting to send a GET request to: ${endpoint}`);

                RequestHandler.GET(endpoint, message.payload as Payload.RequestGetManyNotes).then(
                    (response) => RequestHandler.handleResponsePromise(response)
                ).then(
                    (responseData) => RequestHandler.handleResponseData<Payload.ResponseGetManyNotes>(
                        responseData,
                        sendResponse,
                        Payload.ResponseGetManyNotes,
                        MID.ResponseGetManyNotes
                    )
                );

                break;
            }
            case (MID.Log): {
                ServiceWorkerLogger.logExplicit(message.payload);
                sendResponse();
                break;
            }
            default: {
                sendResponse();
                break;
            }
        } // switch

        return true;
    } // anonymous function (message: Message, _sender, sendResponse)
) // chrome.runtime.onMessage.addListener