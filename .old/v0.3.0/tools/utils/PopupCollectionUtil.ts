import { NoteMap } from "@tools/definitions/types/Note";
import { Payload } from "@tools/definitions/types/Payload";

export function updateCollection(
    payload: Payload.Response.GetManyNotes.Type,
    cardHTML: (sourceDomain: string, sourceURL: string, body: string, createdAt: string) => string
) {

    // Extract notes from the given message payload
    const collection: NoteMap.Type[] = payload.notes;

    // Get popup container object
    const popupContainer: HTMLElement | null = document.getElementById("popupContainer");

    // We will be appending HTML to it
    let cards = "";

    for (let i = 0; i < collection.length; i++) {

        const sourceDomain: string = (new URL(collection[i].src)).hostname;
        const sourceURL: string = collection[i].src;
        const body: string = collection[i].body;
        const createdAt: string = timestampToDatetime(collection[i].createdAt);

        cards += cardHTML(sourceDomain, sourceURL, body, createdAt);
    }

    // Write HTML to the popup container or throw an error if such is not defined
    if (popupContainer !== null) {
        popupContainer.innerHTML = cards;
    } else {
        throw new Error;
    }
}

export function timestampToDatetime(timestamp: number): string {
    let datetime = new Date(timestamp)
    return datetime.toLocaleDateString("default") + " " + datetime.toLocaleTimeString("default");
}