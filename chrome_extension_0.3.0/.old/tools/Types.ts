export interface Constructable<T> {
    new(...args: any[]): T;
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

    GetScreenWidth = "RequestGetScreenWidth", // payload: null
    RequestGetScreenWidth = "ResponseGetScreenWidth", // payload: { screenWidth: ... }

    UserRedirect = "RequestUserRedirect", // payload: { url: ... }

    Log = "Log", // payload: { runner: { worker: <service-worker/content-scripts/popup>, class: <class>, function: <function> }, logMessage: ..., kwargs: ... }

}

export interface Message {
    mid: MID,
    payload: any
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

    export interface RequestUserRedirect {
        url: string;
    };

    export interface RequestLog {
        logMessage: string
    }

    export interface ResponseCreateNote {
        uuid: Note['uuid'],
        createdAt: Note['createdAt'],
        lastUpdatedAt: Note['lastUpdatedAt']
    };

    export interface ResponseUpdateNote {
        lastUpdatedAt: Note['lastUpdatedAt']
    };

    export interface ResponseDeleteNote {
        success: boolean
    };

    export type ResponseGetSingleNote = Note;


    export interface ResponseGetManyNotes {
        notes: Note[]
    };

    export interface ResponseGetScreenWidth {
        screenWidth: number;
    };

}

