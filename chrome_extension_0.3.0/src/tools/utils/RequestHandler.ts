import { Note } from '../domain/Models';
import { NotImplementedError } from '../definitions/Errors';

class RequestHandler {
    static async POST(endpoint: URL, payload: Note): Promise<Response> {
        const initPOST = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(payload)
        }

        const response = await fetch(endpoint, initPOST);

        throw new NotImplementedError();
    }

    static async GET(endpoint: URL): Promise<[Response, Note]> {
        // ...
        throw new NotImplementedError();
    }

    static async PATCH(endpoint: URL, payload: Note) {
        // ...
        throw new NotImplementedError();
    }

    static async DELETE(endpoint: URL, payload: Note) {
        // ...
        throw new NotImplementedError();
    }
}