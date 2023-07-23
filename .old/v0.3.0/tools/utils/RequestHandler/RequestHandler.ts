import { NotImplementedError } from '@tools/definitions/Errors';
import { Payload } from '@tools/definitions/types/Payload';
import { RequestBody, ResponseBody } from '@tools/utils/RequestHandler/ExternalMessage';

export class RequestHandler {

    static async POST(
        endpoint: string,
        payload: Payload.Request.CreateNote.Type
    ): Promise<Payload.Response.CreateNote.Type> {

        const response = await window.fetch(endpoint, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(payload),
        })

        const { data, errors } = await response.json()

        if (response.ok) {

            const note = data?.note;

            if (note) {
                // All good we received the details (createdAt, lastUpdatedAt, uuid)
                return note
            } else {
                return Promise.reject(new Error(`Couldn't post the note with following details: ${payload}`))
            }

        } else {

            // handle the db errors
            const error = new Error(errors?.map((e: { message: string; }) => e.message).join('\n') ?? 'unknown')
            return Promise.reject(error)
        }

    }

    // const initPOST = {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'accept': 'application/json'
    //     },
    //     body: JSON.stringify(payload)
    // }

    // const response: Response = await fetch(endpoint, initPOST);
    // const { data, errors } = await response.json();

    // if (response.ok!) {

    //     data = {
    //         responsCode: response.status,
    //         responsePayload: ResponseBody.PostNote.constraint.getValid()
    //     }

    // } else {

    //     data = {
    //         responsCode: response.status,
    //         responsePayload: null
    //     }

    // }

    // return data;


    static async GET(
        endpoint: string,
        payload: Payload.Request.GetManyNotes.Type
    ): Promise<Payload.Response.GetManyNotes.Type> {

        const sortBy: string = payload.sortBy == Payload.Request.GetManyNotes.SortBy.addedNewest ? 'desc' : 'asc';

        const urlEnding = `/?sorting=${sortBy}&no_of_items=${payload.count}`;

        const response = await fetch(endpoint + urlEnding);

        const { data, errors } = await response.json()

        if (response.ok) {

            const notes = data?.notes;

            if (notes) {
                // All good we received the details (createdAt, lastUpdatedAt, uuid)
                return Payload.Response.GetManyNotes.constraint.getValid({ notes: notes });
            } else {
                return Promise.reject(new Error(`Couldn't get notes with following details: ${payload}`));
            }

        } else {

            // handle the db errors
            const error = new Error(errors?.map((e: { message: string; }) => e.message).join('\n') ?? 'unknown');
            return Promise.reject(error);

        }
    }

    static async PATCH(
        endpoint: URL,
        payload: RequestBody.PatchNote.Type
    ): Promise<ResponseBody.PatchNote.Type> {

        // ...

        throw new NotImplementedError();
    }

    static async DELETE(
        endpoint: URL,
        payload: RequestBody.DeleteNote.Type
    ): Promise<ResponseBody.DeleteNote.Type> {

        // ...

        throw new NotImplementedError();
    }
}