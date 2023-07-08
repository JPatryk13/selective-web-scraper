import { InternalMessageMap, NoteMap } from "./Types";


/**
 * Note must store information that can be altered by the user thus title, body and src are public. 
 * It serves rather a symbolic function here, however it is preffered to propagate the public/private 
 * (protected) distinction throughout the project. The user should not be concerned with values such 
 * uui, createdAt (datetime), lastUpdatedAt (datetime). These shall only be set/modified based on 
 * the response from the API. For increased flexibility of the class it is acceptable to create a
 * constructor that allows for creating a blank note. It can be used to fill it in with existing data
 * in NeteMap dictionary. The neccessary restriction to the flexibility is that writing to and reading
 * from a Note object must be done with concern about the status (public/protected) of the property;
 * e.g. one can read [title, body, src], or write [uuid, createdAt, lastUpdatedAt] (assuming that 
 * [title, body, src] were specified prior) but cannot read [title, body, uuid, createdAt] or write 
 * [uuid] before specifying [title, body, src].
 * 
 * @author Patryk Jesionka
 */
abstract class NoteDefinition {
    public abstract title?: NoteMap["title"];
    public abstract body?: NoteMap["body"];
    public abstract src?: NoteMap["src"];
    protected abstract uuid?: NoteMap["uuid"];
    protected abstract createdAt?: NoteMap["createdAt"];
    protected abstract lastUpdatedAt?: NoteMap["lastUpdatedAt"];

    protected abstract isPublicDataSet(): boolean;
    protected abstract isProtectedDataSet(): boolean;

    public abstract fromExistingNote(note: NoteMap): void;
    public abstract setProtectedValues(uuid: NoteMap["uuid"], createdAt: NoteMap["createdAt"], lastUpdatedAt: NoteMap["lastUpdatedAt"]): void;
    public abstract getPublicValuesAsMap(): NoteMap;
    public abstract getAsMap(): NoteMap;
}


/**
 * Internal message restricts to how the communication between content-script, service-worker and popup
 * can happen. The main tool it implements is MID (Message ID) which has a form of a single-phrase description
 * of the content/purpose of the message therefore allowing components to identify what (if anything)
 * needs to be done with the message. Such approach shall eliminate the need for receiver to be aware of
 * the identity of the sender and vice versa. It is clear, the payload value is dependent on the mid. It
 * shall be implemented within the class methods itself to verify compliance. As of now (08/07/2023) the
 * definition of the payload-mid dependecy is not defined. Further development in that regard will not
 * be documented here. Example of such dependency: let us have a message sent from content-script to
 * service-worker with the aim to publish a newly highlighted text. The mid might look like: newNote,
 * where the payload could look like: {title: null, body: "Here goes the highlighted text", src:
 * "http(s)://url.to/the/website"}
 * 
 * @author Patryk Jesionka
 */
abstract class InternalMessageDefinition {
    public abstract mid?: InternalMessageMap["mid"];
    public abstract payload?: InternalMessageMap["payload"];

    protected abstract isDataSet(): boolean;
    protected abstract verifyPayload(payload: InternalMessageMap["payload"]): boolean;

    public abstract fromExistingMessage(message: InternalMessageMap): void;
    public abstract getAsMap(): InternalMessageMap;
}

export { NoteDefinition, InternalMessageDefinition };