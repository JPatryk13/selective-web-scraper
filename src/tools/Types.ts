export interface Constructable<T> {
    new(...args: any[]): T;
}

export interface Constrainable {
    isValid: (obj: { [key: string]: any }, keys?: string[], getWarnings?: boolean) => boolean | string[],
    eval: () => { [key: string]: any } | string
}

export interface FutureConstrainable<T> {
    /**
     * Stores warning/error messages that may rise during validation.
     */
    warnings: string[];
    /**
     * Verify if the given `object` meets part of the schema specified by `keys`. Doesn't return boolean on it's own.
     * Stores warning/error messages if any arise in the 
     * 
     * @param obj an object which schema is derived ("is subset") from the type that the constraint is assigned to
     * @param keys key values that describe which part of the schema the object is supposed to match
     * @returns 
     */
    isPartiallyValid: (obj: { [key: string]: any }, keys: string[]) => T;
    /**
     * Verify if the given object fully matches the schema.
     * 
     * @param obj object that is required to match the schema
     * @returns 
     */
    isValid: (obj: { [key: string]: any }) => T;
    /**
     * @returns string representation of the type the constraint is assigned to
     */
    getSchema: () => string | { [key: string]: any };
    /**
     * 
     * @param obj object that is supposed to fully or partially match the schema
     * @param keys if defined, describe which part of the schema the object needs to match
     * @returns an object that allows for specifying expected behaviour 
     */
    onFail: (action: 'doNothing' | 'getWarnings' | 'logWarnings' | 'throwError') => boolean | string[] | void;
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

export interface Message {
    mid: MID,
    payload: any,
    externalResponseStatus?: ResponseStatus,
    _sender: string,
    _recipient: string
}


export interface Note {
    title: string | null,
    body: string,
    src: string,
    uuid: string,
    createdAt: number,
    lastUpdatedAt: number
}

export namespace Payload {

    export interface RequestCreateNote {
        title: Note["title"],
        body: Note["body"],
        src: Note["src"]
    }

    export interface RequestUpdateNote {
        uuid: Note["uuid"],
        title?: Note["title"],
        body?: Note["body"],
        src?: Note["src"]
    }

    export interface RequestDeleteNote {
        uuid: Note["uuid"]
    }

    export interface RequestGetSingleNote {
        uuid: Note["uuid"]
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

    export type RequestGetScreenWidth = null;

    export interface UserRedirect {
        url: string
    }

    export type ResponseCreateNote = Note

    export interface ResponseUpdateNote {
        lastUpdatedAt: Note['lastUpdatedAt']
    }

    export interface ResponseDeleteNote {
        success: boolean
    }

    export type ResponseGetSingleNote = Note;

    export interface ResponseGetManyNotes {
        notes: Note[]
    }

    export interface ResponseGetScreenWidth {
        screenWidth: number
    }
}