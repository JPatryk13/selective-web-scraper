import { NoteMap } from "@tools/definitions/types/Note";
import { NoteDefinition, InternalMessageDefinition } from "@tools/definitions/Models";
import { InvalidTypeError } from "@tools/definitions/Errors";
import { areAllDefined } from "@tools/domain/BaseUtils";
import { Payload } from "@tools/definitions/types/Payload";
import { InternalMessageMap } from "@tools/definitions/types/InternalMessage";


/**
 * @author Patryk Jesionka
 * @see NoteDefinition
 */
class Note extends NoteDefinition {

    public title: NoteMap.Type["title"];
    public body?: NoteMap.Type["body"];
    public src?: NoteMap.Type["src"];
    protected uuid?: NoteMap.Type["uuid"];
    protected createdAt?: NoteMap.Type["createdAt"];
    protected lastUpdatedAt?: NoteMap.Type["lastUpdatedAt"];

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
    constructor(body?: NoteMap.Type["body"], src?: NoteMap.Type["src"], title?: NoteMap.Type["title"]) {
        super();

        this.body = body ?? undefined;
        this.src = src ?? undefined;
        this.title = title ?? null;
    }

    /**
     * Check if 'body', 'src' and 'title' (default = null) are specified (not undefined)
     */
    protected areAllPublicDataSet(obj?: NoteMap.Type): boolean {
        return areAllDefined(
            obj?.title ?? this.title,
            obj?.body ?? this.body,
            obj?.src ?? this.src
        );
    }

    /**
     * Check if 'uuid', 'createdAt' and 'lastUpdatedAt' are specified (not undefined)
     */
    protected areAllProtectedDataSet(obj?: NoteMap.Type): boolean {
        return areAllDefined(
            obj?.uuid ?? this.uuid,
            obj?.createdAt ?? this.createdAt,
            obj?.lastUpdatedAt ?? this.lastUpdatedAt
        );
    }

    /**
     * Take in an existing note dictionary (map) and extract values into the Note object.
     * 
     * @param note NoteMap dictionary type with body, src, title, etc.
     */
    public fromExistingNote(note: NoteMap.Type): void {
        this.title = note.title;
        this.body = note.body;
        this.src = note.src;
        this.uuid = note.uuid;
        this.createdAt = note.createdAt;
        this.lastUpdatedAt = note.lastUpdatedAt;
    }

    /**
     * Set all protected variables' values.
     * 
     * @param uuid note's ID
     * @param createdAt datetime the note was created at
     * @param lastUpdatedAt datetime the note was most recently updated at
     */
    public setProtectedValues(
        uuid: NoteMap.Type["uuid"],
        createdAt: NoteMap.Type["createdAt"],
        lastUpdatedAt: NoteMap.Type["lastUpdatedAt"]
    ): void {
        this.uuid = uuid;
        this.createdAt = createdAt;
        this.lastUpdatedAt = lastUpdatedAt;
    }

    /**
     * Get (defined within the class) public values as a dictionary. Works only if the title, body and src are not undefined.
     * 
     * @returns dictionary of the form: { title: ..., body: ..., src: ... }
     */
    public getCreateNoteRequestPayload(): Payload.Request.CreateNote.Type | null {
        if (this.areAllPublicDataSet()) {
            return Payload.Request.CreateNote.constraint.getValid({
                title: this.title as Payload.Request.CreateNote.Type["title"],
                body: this.body as Payload.Request.CreateNote.Type["body"],
                src: this.src as Payload.Request.CreateNote.Type["src"]
            });
        } else {
            return null;
        }
    }

    /**
     * Get (defined within the class) protected values as a dictionary. Works only if the uuid, createdAt and lastUpdatedAt are not undefined.
     * 
     * @returns dictionary of the form: { uuid: ..., createdAt: ..., lastUpdatedAt: ... }
     */
    public getCreateNoteResponsePayload(): Payload.Response.CreateNote.Type | null {
        if (this.areAllProtectedDataSet()) {
            return Payload.Response.CreateNote.constraint.getValid({
                uuid: this.uuid as Payload.Response.CreateNote.Type["uuid"],
                createdAt: this.createdAt as Payload.Response.CreateNote.Type["createdAt"],
                lastUpdatedAt: this.lastUpdatedAt as Payload.Response.CreateNote.Type["lastUpdatedAt"]
            });
        } else {
            return null;
        }
    }

    /**
     * Get all values as a dictionary. Works only if all (title, body, src, uuid, createdAt, lastUpdatedAt) are not undefined.
     * 
     * @returns dictionary of the form: { title: ..., body: ..., src: ..., uuid: ..., createdAt: ..., lastUpdatedAt: ... }
     */
    public getAsMap(): NoteMap.Type | null {
        if (this.areAllPublicDataSet() && this.areAllProtectedDataSet()) {
            return NoteMap.constraint.getValid({
                title: this.title as NoteMap.Type["title"],
                body: this.body as NoteMap.Type["body"],
                src: this.src as NoteMap.Type["src"],
                uuid: this.uuid as NoteMap.Type["uuid"],
                createdAt: this.createdAt as NoteMap.Type["createdAt"],
                lastUpdatedAt: this.lastUpdatedAt as NoteMap.Type["lastUpdatedAt"]
            });
        } else {
            return null;
        }
    }
}


/**
 * @author Patryk Jesionka
 * @see InternalMessageDefinition
 */
class InternalMessage extends InternalMessageDefinition {
    public mid?: InternalMessageMap.Type["mid"];
    public payload?: InternalMessageMap.Type["payload"];

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
    constructor(mid?: InternalMessageMap.Type["mid"], payload?: InternalMessageMap.Type["payload"]) {
        super();

        if (mid !== undefined && payload !== undefined) {
            if (this.isPayloadValid(payload)) {
                this.mid = mid;
                this.payload = payload;
            } else {
                throw new InvalidTypeError;
            }
        }
    }

    /**
     * Check if 'mid' and 'payload' are specified (not undefined)
     */
    protected areAllDataSet(): boolean {
        return areAllDefined(this.mid, this.payload);
    }

    /**
     * Check if payload complies with the given mid
     * 
     * @param payload content sent with the message
     * @see MID broader description of mid and payload
     */
    protected isPayloadValid(payload: InternalMessageMap.Type["payload"]): boolean {
        return InternalMessageMap.constraint.isValid(payload);
    }

    /**
     * Take in an existing message dictionary (map) and extract values into the InternalMessage object.
     * 
     * @param message InternalMessageMap type dictionary
     */
    public fromExistingMessage(message: InternalMessageMap.Type): void {
        this.mid = message.mid;
        this.payload = message.payload;
    }

    /**
     * Get message as a dictionary. Works only if all properties are not undefined.
     * 
     * @returns dictionary of the form: { mid: ..., payload: ... }
     */
    public getAsMap(): InternalMessageMap.Type | null {
        if (this.areAllDataSet()) {
            return InternalMessageMap.constraint.getValid({
                mid: this.mid as InternalMessageMap.Type["mid"],
                payload: this.payload as InternalMessageMap.Type["payload"]
            });
        } else {
            return null;
        }
    }
}

export { Note, InternalMessage }