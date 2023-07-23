import { Constrainable, MID, Message, Payload, ResponseStatus } from '@tools/Types';
import { NotImplementedError } from '@tools/Errors';
import { Listener, LogManager } from '@tools/utils/Logging';

export class RequestHandler {

    static readonly RequestHandlerLogger = new LogManager().configure().registerLogger(Listener.consoleLogListener).getLogger('tools.utils.RequestHandler');

    static async POST(
        endpoint: string,
        payload: Payload.RequestCreateNote
    ): Promise<Response> {

        return await fetch(endpoint, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(payload),
        });
    }

    static async GET(
        endpoint: string,
        payload: Payload.RequestGetManyNotes
    ): Promise<Response> {

        const sortBy: string = payload.sortBy === Payload.SortBy.addedNewest ? 'desc' : 'asc';

        const urlEnding = `?sorting=${sortBy}&no_of_items=${payload.count}`;

        return await fetch(endpoint + urlEnding);
    }

    static async PATCH(
        endpoint: URL,
        payload: Payload.RequestUpdateNote
    ): Promise<Payload.ResponseUpdateNote> {

        // ...

        throw new NotImplementedError();
    }

    static async DELETE(
        endpoint: URL,
        payload: Payload.RequestDeleteNote
    ): Promise<Payload.ResponseDeleteNote> {

        // ...

        throw new NotImplementedError();
    }

    static handleResponsePromise(response: Response): Promise<{ data: any, responseStatus: ResponseStatus }> {

        this.RequestHandlerLogger.setSubmodule('handleResponsePromise').debug("Got response from the external.", { args: [response] });

        // Set up responseStatus
        const responseStatus: ResponseStatus = {
            success: response.ok,
            statusCode: response.status
        }

        // return data from the response and response status as a dict
        return response.json().then((responseData) => ({ data: response.ok ? responseData : null, responseStatus }));
    }

    static handleResponseData<responsePayloadType>(
        responseData: { data: any, responseStatus: ResponseStatus },
        sendResponse: (response?: any) => void,
        responsePayloadValidator: Constrainable,
        mid: MID
    ): void {

        this.RequestHandlerLogger.setSubmodule('handleResponseData');

        if (responseData.responseStatus.success) { this.RequestHandlerLogger.debug(`response.status: ${responseData.responseStatus.success}. Retrieved data from the response:`, { args: [responseData.data] }); }
        else { this.RequestHandlerLogger.warn(`response.status: ${responseData.responseStatus.success}. Retrieved data from the response: ${responseData.data}`); }

        let payload: responsePayloadType | null = null;
        let responseMessage: Message;

        // Validate retrieved data
        if (responsePayloadValidator.isValid(responseData.data) || responseData.data === null) {
            payload = responseData.data;
        } else {
            // payload stays null
            this.RequestHandlerLogger.warn(
                "Could not find suitable conversion from 'data' to 'payload'.",
                {
                    args: [
                        responseData.data,
                        responsePayloadValidator.eval(),
                        ...(responsePayloadValidator.isValid(responseData.data, undefined, true) as string[])
                    ]
                }
            );
        }

        // Compose and send the message
        responseMessage = {
            mid,
            payload,
            externalResponseStatus: responseData.responseStatus,
            _sender: 'service-worker',
            _recipient: 'content-scripts.SubmitText'
        }

        this.RequestHandlerLogger.debug(`Sending message to the ${responseMessage._recipient}.`, { args: [responseMessage] });

        sendResponse(responseMessage);
    }
}