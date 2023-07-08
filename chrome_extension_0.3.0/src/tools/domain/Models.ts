import { NoteDefinition, InternalMessageDefinition } from "../definitions/Models";
import { InternalMessageMap, MID, NoteMap } from "../definitions/Types";
import { NotImplementedError } from "../definitions/Errors";


/**
 * @author Patryk Jesionka
 * @see NoteDefinition
 */
class Note extends NoteDefinition {
    public title: NoteMap["title"];
    public body: NoteMap["body"];
    public src: NoteMap["src"];
    protected uuid?: NoteMap["uuid"];
    protected createdAt?: NoteMap["createdAt"];
    protected lastUpdatedAt?: NoteMap["lastUpdatedAt"];

    /**
     * Create an empty Note object. Recommended to use fromExistingNote() function in combination
     * with it.
     */
    constructor();
    /**
     * Create a Note object with given values.
     * 
     * @param body text content of the note
     * @param src where the note was captured from
     * @param title optional title of the note
     */
    constructor(body?: NoteMap["body"], src?: NoteMap["src"], title?: NoteMap["title"]) {
        super();

        this.body = body ?? undefined;
        this.src = src ?? undefined;
        this.title = title ?? null;
    }

    /**
     * Check if 'body', 'src' and 'title' (default = null) are specified (not undefined)
     */
    protected isPublicDataSet(): boolean {
        throw new NotImplementedError;
    }

    /**
     * Check if 'uuid', 'createdAt' and 'lastUpdatedAt' are specified (not undefined)
     */
    protected isProtectedDataSet(): boolean {
        throw new NotImplementedError;
    }

    /**
     * Take in an existing note dictionary (map) and check if it has specified at least public 
     * (body, src, title) values, and extract values into the Note object. If the given map has
     * all public values and some (defined here as) protected throw an error. Accept only all or none.
     * 
     * @param note NoteMap dictionary type with body, src and title or all six variables.
     */
    public fromExistingNote(note: NoteMap): void {
        throw new NotImplementedError;
    }

    /**
     * Set all protected variables' values.
     * 
     * @param uuid note's ID
     * @param createdAt datetime the note was created at
     * @param lastUpdatedAt datetime the note was most recently updated at
     */
    public setProtectedValues(
        uuid: NoteMap["uuid"],
        createdAt: NoteMap["createdAt"],
        lastUpdatedAt: NoteMap["lastUpdatedAt"]
    ): void {
        throw new NotImplementedError;
    }

    /**
     * Get (defined within the class) public values as a dictionary. Works only if the title, body and src are not undefined.
     * 
     * @returns dictionary of the form: { title: ..., body: ..., src: ... }
     */
    public getPublicValuesAsMap(): NoteMap {
        throw new NotImplementedError;
    }

    /**
     * Get all values as a dictionary. Works only if all (title, body, src, uuid, createdAt, lastUpdatedAt) are not undefined.
     * 
     * @returns dictionary of the form: { title: ..., body: ..., src: ..., uuid: ..., createdAt: ..., lastUpdatedAt: ... }
     */
    public getAsMap(): NoteMap {
        throw new NotImplementedError;
    }
}

/**
 * @author Patryk Jesionka
 * @see InternalMessageDefinition
 */
class InternalMessage extends InternalMessageDefinition {
    public mid?: InternalMessageMap["mid"];
    public payload?: InternalMessageMap["payload"];

    /**
     * Create an empty InternalMessage object. Recommended to use fromExistingMessage() function in combination
     * with it.
     */
    constructor();
    /**
     * Create an InternalMessage object with given values.
     * 
     * @param mid Message ID - describes purpose of the message
     * @param payload content sent with the message
     * @see MID broader description of mid and payload
     */
    constructor(mid?: InternalMessageMap["mid"], payload?: InternalMessageMap["payload"]) {
        super();

        this.mid = mid ?? undefined;
        this.payload = payload ?? null;
    }

    /**
     * Check if 'mid' and 'payload' are specified (not undefined)
     */
    protected isDataSet(): boolean {
        throw new NotImplementedError;
    }

    /**
     * Check if payload complies with the given mid
     * 
     * @param payload content sent with the message
     * @see MID broader description of mid and payload
     */
    protected verifyPayload(payload: InternalMessageMap["payload"]): boolean {
        throw new NotImplementedError;
    }

    /**
     * Take in an existing message dictionary (map) and extract values into the InternalMessage object.
     * 
     * @param message InternalMessageMap type dictionary
     */
    public fromExistingMessage(message: InternalMessageMap): void {
        throw new NotImplementedError;
    }

    /**
     * Get message as a dictionary. Works only if all properties are not undefined.
     * 
     * @returns dictionary of the form: { mid: ..., payload: ... }
     */
    public getAsMap(): InternalMessageMap {
        throw new NotImplementedError;
    }
}

export { Note, InternalMessage }