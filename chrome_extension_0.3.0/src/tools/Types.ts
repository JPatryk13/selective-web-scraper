import { IncorrectTypeWarning, NotInSchemaWarning, NotMemberWarning, UndefinedWithinObjectWarning } from "./Errors";

export interface Constructable<T> {
    new(...args: any[]): T;
}

export interface Constrainable {
    isValid: (obj: { [key: string]: any }, keys?: string[], getWarnings?: boolean) => boolean | string[];
    eval: () => string | { [key: string]: any };
}

export enum MID {
    /* POST */
    RequestCreateNote = "RequestCreateNote", // payload: { title: ..., body: ..., src: ... }
    ResponseCreateNote = "ResponseCreateNote", // payload: { uuid: ..., createdAt: ..., lastUpdatedAt: ... }
    /* PATCH */
    RequestUpdateNote = "RequestUpdateNote", // payload: { uuid: ...,  [title | body | src]: ..., [title | body | src]: ..., ... }
    ResponseUpdateNote = "ResponseUpdateNote", // payload: { lastUpdatedAt: ... }
    /* DELETE */
    RequestDeleteNote = "RequestDeleteNote", // payload: { uuid: ... }
    ResponseDeleteNote = "ResponseDeleteNote", // payload: { success: true | false }
    /* GET */
    RequestGetSingleNote = "RequestGetNote", // payload: { uuid: ... }
    ResponseGetSingleNote = "ResponseGetNote", // payload: BaseNoteMap
    /* GET */
    RequestGetManyNotes = "RequestGetManyNotes", // payload: { count: ..., sortBy: 'Added: Newest' | 'Added: Oldest' | 'Most relevant (require search phrase)', searchPhrase?: { [title | body | src]: ... } } 
    ResponseGetManyNotes = "ResponseGetManyNotes", // payload: { notes: BaseNoteMap[] }

    RequestGetScreenWidth = "RequestGetScreenWidth", // payload: null
    ResponseGetScreenWidth = "ResponseGetScreenWidth", // payload: { screenWidth: ... }

    UserRedirect = "RequestUserRedirect", // payload: { url: ... }

    Log = "Log", // payload: { runner: { worker: <service-worker/content-scripts/popup>, class: <class>, function: <function> }, logMessage: ..., kwargs: ... }

}

export interface ResponseStatus {
    success: boolean;
    statusCode: number;
}

export const ResponseStatus: Constrainable = {
    isValid: (obj, _keys, getWarnings) => {
        let warnings: string[] = [];

        if (!obj.statusCode) { warnings.push(UndefinedWithinObjectWarning('statusCode', ['success', 'statusCode'], obj)); }
        if (!obj.success) { warnings.push(UndefinedWithinObjectWarning('success', ['success', 'statusCode'], obj)); }
        if (typeof obj.statusCode !== 'number') { warnings.push(IncorrectTypeWarning(obj.statusCode, 'statusCode', ['number'])); }
        if (typeof obj.success !== 'boolean') { warnings.push(IncorrectTypeWarning(obj.success, 'success', ['boolean'])); }

        return getWarnings ? warnings : warnings.length === 0;
    },
    eval: () => {
        return {
            success: 'boolean', statusCode: 'number'
        };
    }
}

export interface Message {
    mid: MID,
    payload: any,
    externalResponseStatus?: ResponseStatus,
    _sender: string,
    _recipient: string
}

export const Message: Constrainable = {
    isValid: (obj, keys, getWarnings) => {

        // if no keys given iterate over the key-val pairs from the obj
        const definedKeys: string[] = keys ? keys : Object.keys(obj);
        let warnings: string[] = [];

        for (const key of definedKeys) {

            // when given key doesn't exist on the object and probably should
            if (!(key in obj)) {
                warnings.push(UndefinedWithinObjectWarning(definedKeys[0], definedKeys, obj));
            }

            switch (key) {
                case ('mid'): {
                    if (!Object.values(MID).includes(obj.mid)) {
                        warnings.push(NotMemberWarning('mid', obj.mid, 'MID'));
                    }
                    break;
                }
                case ('payload'): { break; }
                case ('externalResponseStatus'): {
                    if (obj.mid.toLowerCase().includes('response') && obj.mid !== MID.ResponseGetScreenWidth) {
                        // it is response-like message
                        if (obj.externalResponseStatus) {
                            // it has externalResponseStatus
                            warnings.push(...(ResponseStatus.isValid(obj.externalResponseStatus, undefined, true) as string[]));
                        } else {
                            warnings.push("Found response-like 'mid' but 'externalResponseStatus' is missing.");
                        }
                    } else {
                        // it is not response-like
                        if (obj.externalResponseStatus) {
                            // but it has externalResponseStatus
                            warnings.push("Found 'externalResponseStatus' but the message is not response-like or doesn't come from an external source.");
                        }
                    }
                    break;
                }
                case ('_sender'): {
                    if (typeof obj._sender !== 'string') {
                        warnings.push(IncorrectTypeWarning(obj._sender, '_sender', ['string']));
                    }
                    break;
                }
                case ('_recipient'): {
                    if (typeof obj._recipient !== 'string') {
                        warnings.push(IncorrectTypeWarning(obj._recipient, '_recipient', ['string']));
                    }
                    break;
                }
                default: { warnings.push(NotInSchemaWarning(key)); } // when given key doesn't exist within the obj and it should not exist
            }
        }

        return getWarnings ? warnings : warnings.length === 0;

        // if (definedKeys.length === 1) { // eval to false if no keys and if more than one key given


        // } else {

        //     let warnings: string[] = [];

        //     for (const k of definedKeys) {
        //         if (getWarnings) {
        //             warnings.push(...(Message.isValid(obj, [k], true) as string[]));
        //         }

        //         if (!Message.isValid(obj, [k])) { return getWarnings ? warnings : false; }
        //     }

        //     return true;
        // }

    },

    eval: () => {
        return {
            mid: 'MID', payload: 'any', 'externalResponseStatus?': 'ResponseStatus', _sender: 'string', _recipient: 'string'
        };
    }
}

export interface Note {
    title: string | null,
    body: string,
    src: string,
    uuid: string,
    createdAt: number,
    lastUpdatedAt: number
}

export const Note: Constrainable = {
    isValid: (obj, keys, getWarnings) => {

        // if no keys given iterate over the key-val pairs from the obj
        const definedKeys: string[] = keys ? keys : Object.keys(obj);
        let warnings: string[] = [];

        // console.log(keys);
        // console.log(definedKeys);
        // console.log(definedKeys[0]);
        // console.log(definedKeys.length === 1);

        for (const key of definedKeys) {
            // when given key doesn't exist on the object and probably should
            if (!(key in obj)) {
                warnings.push(UndefinedWithinObjectWarning(key, definedKeys, obj));
            }

            switch (key) {
                case ('title'): {
                    if (!(typeof obj.title === 'string' || obj.title === null)) {
                        warnings.push(IncorrectTypeWarning(obj.title, 'title', ['string', 'null']));
                    }
                    break;
                }
                case ('body'): {
                    if (typeof obj.body !== 'string') {
                        warnings.push(IncorrectTypeWarning(obj.body, 'body', ['string']));
                    }
                    break;
                }
                case ('src'): {
                    if (typeof obj.src !== 'string') {
                        warnings.push(IncorrectTypeWarning(obj.src, 'src', ['string']));
                    }
                    break;
                }
                case ('uuid'): {
                    if (typeof obj.uuid !== 'string') {
                        warnings.push(IncorrectTypeWarning(obj.uuid, 'uuid', ['string']));
                    }
                    break;
                }
                case ('createdAt'): {
                    if (typeof obj.createdAt !== 'number') {
                        warnings.push(IncorrectTypeWarning(obj.createdAt, 'createdAt', ['number']));
                    }
                    break;
                }
                case ('lastUpdatedAt'): {
                    if (typeof obj.lastUpdatedAt !== 'number') {
                        warnings.push(IncorrectTypeWarning(obj.lastUpdatedAt, 'lastUpdatedAt', ['number']));
                    }
                    break;
                }
                default: { warnings.push(NotInSchemaWarning(key)); }
            }
        }

        return getWarnings ? warnings : (warnings.length === 0);

        // if (definedKeys.length === 1) {  // eval to false if no keys and if more than one key given

        //     // when given key doesn't exist on the object and probably should
        //     if (!(definedKeys[0] in obj)) {
        //         return getWarnings ? [`${definedKeys[0]} is undefined. Given keys: ${definedKeys}, while the object has ${Object.keys(obj)}.`] : false;
        //     }

        //     switch (definedKeys) {
        //         case (['title']): { return isCorrectType(obj.title, 'title', ['string', 'null'], Boolean(getWarnings)) }
        //         case (['body']): { return isCorrectType(obj.body, 'body', ['string'], Boolean(getWarnings)); }
        //         case (['src']): { return isCorrectType(obj.src, 'src', ['string'], Boolean(getWarnings)); }
        //         case (['uuid']): { return isCorrectType(obj.uuid, 'uuid', ['string'], Boolean(getWarnings)); }
        //         case (['createdAt']): { return isCorrectType(obj.createdAt, 'createdAt', ['number'], Boolean(getWarnings)); }
        //         case (['lastUpdatedAt']): { return isCorrectType(obj.lastUpdatedAt, 'lastUpdatedAt', ['number'], Boolean(getWarnings)); }
        //         default: { return getWarnings ? [`Present additional field that is not in the schema: ${keys ? keys[0] : keys}.`] : false; }
        //     }
        // } else {

        //     let warnings: string[] = [];

        //     for (const k of definedKeys) {

        //         if (getWarnings) {
        //             warnings.push(...(Message.isValid(obj, [k], true) as string[]));
        //         }

        //         if (!Note.isValid(obj, [k])) { return getWarnings ? warnings : false; }
        //     }

        //     return true;
        // }
    },

    eval: () => {
        return {
            title: 'string | null', body: 'string', src: 'string', uuid: 'string', createdAt: 'number', lastUpdatedAt: 'number'
        };
    }
}

export namespace Payload {

    export interface RequestCreateNote {
        title: Note["title"],
        body: Note["body"],
        src: Note["src"]
    }

    export const RequestCreateNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => Note.isValid(obj, ['title', 'body', 'src'], getWarnings),
        eval: () => {
            return {
                title: 'Note["title"]', body: 'Note["body"]', src: 'Note["src"]'
            };
        }
    }

    export interface RequestUpdateNote {
        uuid: Note["uuid"],
        title?: Note["title"],
        body?: Note["body"],
        src?: Note["src"]
    }

    export const RequestUpdateNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            const isValid: boolean = (Note.isValid(obj, ['uuid', 'title']) || Note.isValid(obj, ['uuid', 'body']) || Note.isValid(obj, ['uuid', 'src'])) as boolean;
            if (getWarnings && !isValid) {
                return [
                    ...(Note.isValid(obj, ['uuid', 'title'], true) as string[]),
                    ...(Note.isValid(obj, ['uuid', 'body'], true) as string[]),
                    ...(Note.isValid(obj, ['uuid', 'src'], true) as string[])
                ]
            } else {
                return getWarnings ? [] : isValid;
            }
        },
        eval: () => {
            return {
                uuid: 'Note["uuid"]', 'title?': '?Note["title"]', 'body?': '?Note["body"]', 'src?': '?Note["src"]'
            };
        }
    }

    export interface RequestDeleteNote {
        uuid: Note["uuid"]
    }

    export const RequestDeleteNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => Note.isValid(obj, ['uuid'], getWarnings),
        eval: () => { return { uuid: 'Note["uuid"]' }; }
    }

    export interface RequestGetSingleNote {
        uuid: Note["uuid"]
    }

    export const RequestGetSingleNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => Note.isValid(obj, ['uuid'], getWarnings),
        eval: () => { return { uuid: 'Note["uuid"]' }; }
    }

    export enum SortBy {
        addedNewest = 'Added: Newest',
        addedOldest = 'Added: Oldest',
        mostRelevant = 'Most relevant'
    }

    export interface RequestGetManyNotes {
        count: number,
        sortBy: SortBy,
        searchPhrase?: { title: Note["title"] } | { body: Note["body"] } | { src: Note["src"] } | undefined
    }

    export const RequestGetManyNotes: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            let countValid, sortByValid, searchPhraseValid: boolean;
            let warnings: string[] = [];

            // Check the obj.count value
            if (typeof obj.count === "number") {
                countValid = obj.count > 0 && Number.isInteger(obj.count); // expecting positive integer
            } else {
                countValid = false;
                warnings.push("'count' is not a positive integer.");
            }

            // Check the obj.sortBy and obj.searchPhrase values
            if (Object.values(SortBy).includes(obj.sortBy)) { // expecting a member of SortBy

                sortByValid = true;

                if (obj.sortBy === SortBy.mostRelevant) {
                    // expecting searchPhrase to be set
                    if (obj.searchPhrase) {
                        searchPhraseValid = obj.searchPhrase.len() && (Note.isValid(obj.searchPhrase, ['title']) || Note.isValid(obj.searchPhrase, ['body']) || Note.isValid(obj.searchPhrase, ['src']));
                        if (!searchPhraseValid) { warnings.push("'searchPhrase' has invalid format."); }
                    } else {
                        searchPhraseValid = false;
                        warnings.push("'searchPhrase' is not defined while 'sortBy' is set to 'SortBy.mostRelevant'.");
                    }
                } else {
                    searchPhraseValid = true;
                }
            } else {
                sortByValid = false;
                searchPhraseValid = true;
                warnings.push("'sortBy' is not a member of 'SortBy'.");
            }

            return getWarnings ? warnings : countValid && sortByValid && searchPhraseValid;
        },

        eval: () => {
            return {
                count: 'number',
                sortBy: 'SortBy',
                'searchPhrase?': { 'title|body|src': 'Note["title|body|src"]' }
            };
        }
    }


    export type RequestGetScreenWidth = null;

    export const RequestGetScreenWidth: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            if (obj === null) {
                return getWarnings ? [] : true;
            } else {
                return getWarnings ? [IncorrectTypeWarning(obj, 'payload', ['null'])] : false;
            }
        },
        eval: () => 'null'
    }

    export interface RequestUserRedirect {
        url: string
    }

    export const RequestUserRedirect: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            let warnings: string[] = [];
            if (obj.url) {
                if (typeof obj.url !== 'string') {
                    warnings.push(IncorrectTypeWarning(obj.url, 'url', ['string']));
                }
            } else {
                warnings.push(UndefinedWithinObjectWarning('url', ['url'], obj));
            }

            return getWarnings ? warnings : warnings.length === 0;

        },
        eval: () => {
            return {
                url: 'string'
            };
        }
    }

    export type ResponseCreateNote = Note

    export const ResponseCreateNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => Note.isValid(obj, undefined, getWarnings),
        eval: () => Note.eval()
    }

    export interface ResponseUpdateNote {
        lastUpdatedAt: Note['lastUpdatedAt']
    }

    export const ResponseUpdateNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => Note.isValid(obj, ['lastUpdatedAt'], getWarnings),
        eval: () => {
            return {
                lastUpdatedAt: 'Note["lastUpdatedAt"]'
            };
        }
    }

    export interface ResponseDeleteNote {
        success: boolean
    }

    export const ResponseDeleteNote: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            let warnings: string[] = [];
            if (obj.success) {
                if (typeof obj.success !== 'boolean') {
                    warnings.push(IncorrectTypeWarning(obj.success, 'success', ['boolean']));
                }
            } else {
                warnings.push(UndefinedWithinObjectWarning('success', ['success'], obj));
            }

            return getWarnings ? warnings : warnings.length === 0;

        },
        eval: () => {
            return {
                success: 'boolean'
            };
        }
    }

    export type ResponseGetSingleNote = Note;

    export const ResponseGetSingleNote: Constrainable = {
        isValid: (obj) => Note.isValid(obj),
        eval: () => Note.eval()
    }

    export interface ResponseGetManyNotes {
        notes: Note[]
    }

    export const ResponseGetManyNotes: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {

            if (obj.notes) {
                if (Array.isArray(obj.notes)) {
                    for (const note of obj.notes) {
                        if (!Note.isValid(note)) {
                            return Note.isValid(note, _keys, getWarnings);
                        }
                    }
                    return getWarnings ? [] : true;
                } else {
                    return getWarnings ? ["'notes' is not an array"] : false;
                }
            } else {
                return getWarnings ? ["'notes' is not defined."] : false;
            }
        },

        eval: () => {
            return {
                notes: 'Note[]'
            };
        }
    }

    export interface ResponseGetScreenWidth {
        screenWidth: number
    }

    export const ResponseGetScreenWidth: Constrainable = {
        isValid: (obj, _keys, getWarnings) => {
            let warnings: string[] = [];
            if (obj.screenWidth) {
                if (typeof obj.screenWidth !== 'number') {
                    warnings.push(IncorrectTypeWarning(obj.screenWidth, 'screenWidth', ['number']));
                } else if (!(obj.screenWidth > 0)) {
                    warnings.push(`'screenWidth' is not a positive number. Got ${obj.screenWidth}`);
                }
            } else {
                warnings.push(UndefinedWithinObjectWarning('screenWidth', ['screenWidth'], obj));
            }

            return getWarnings ? warnings : warnings.length === 0;

        },

        eval: () => {
            return {
                screenWidth: 'number'
            };
        }
    }

}