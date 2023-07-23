import { Note, Payload } from "@tools/Types";
import { logDispatcher } from "./Logging";

const PopupCollectionUtilLogger = logDispatcher.getLogger('tools.utils.PopupCollectionUtil');

export function updateCollection(
    collection: Note[],
    cardHTML: (sourceURL: string, body: string, createdAt: string) => string
) {

    const UpdateCollectionLogger = PopupCollectionUtilLogger.setSubmodule('updateCollection');

    // Get popup container object
    const popupContainer: HTMLElement | null = document.getElementById("popupContainer");

    if (popupContainer) {
        UpdateCollectionLogger.debug("Got popup container element.");
    } else {
        UpdateCollectionLogger.warn("popupContainer undefined.");
    }

    // We will be appending HTML to it
    let cards = "";

    for (let i = 0; i < collection.length; i++) {

        const sourceURL: string = collection[i].src;
        const body: string = collection[i].body;
        const createdAt: string = timestampToDatetime(collection[i].createdAt);

        [sourceURL, body, createdAt].forEach((elem, j) => {
            if (!elem) {
                let elemName = "!undefinedElemName!";
                switch (j) {
                    case (0): { elemName = "sourceURL"; break; }
                    case (1): { elemName = "body"; break; }
                    case (2): { elemName = "createdAt"; break; }
                }
                UpdateCollectionLogger.warn(`'${elemName}' is undefined.`);
            }
        })
        UpdateCollectionLogger.debug(`Running #${i} iteration with 'sourceDomain', 'sourceURL', 'body' and 'createdAt'.`, { args: [sourceURL, body, createdAt] });

        cards += cardHTML(sourceURL, body, createdAt);
    }

    // Write HTML to the popup container or throw an error if such is not defined
    if (popupContainer !== null) {
        popupContainer.innerHTML = cards;
    } else {
        throw new Error;
    }
}

export function timestampToDatetime(timestamp: number): string {
    const datetime = new Date(timestamp);
    const formattedDatetime = datetime.toLocaleDateString("default") + " " + datetime.toLocaleTimeString("default");

    PopupCollectionUtilLogger.setSubmodule('timestampToDatetime').debug(`Converted ${timestamp} to ${formattedDatetime}.`);

    return formattedDatetime;
}