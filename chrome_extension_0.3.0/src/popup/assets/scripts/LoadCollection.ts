import { Payload, Message, MID, Note } from "@tools/Types";
import { logDispatcher } from "@tools/utils/Logging";
import { updateCollection } from "@tools/utils/PopupCollectionUtil";

// Set up logger
const LoadCollectionLogger = logDispatcher.getLogger('popup.LoadCollection');

function getNotes(): Promise<Note[]> {
    const payload: Payload.RequestGetManyNotes = {
        count: 10,
        sortBy: Payload.SortBy.addedNewest
    }

    const message: Message = {
        mid: MID.RequestGetManyNotes,
        payload: payload,
        _sender: 'popup.LoadCollection',
        _recipient: 'service-worker'
    };

    LoadCollectionLogger.debug("Sending a message.", { args: [message] });

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (response) {

                LoadCollectionLogger.debug("Got response.", { args: [response] });

                if (!Message.isValid(response)) { LoadCollectionLogger.warn("Response doesn't have a valid format.", { args: [Message.isValid(response, undefined, true)] }); reject(); }

                if (response.externalResponseStatus.success && response.payload) { resolve(response.payload.notes); }
                else { LoadCollectionLogger.warn("Response indicates unsuccessful request.", { args: [response.externalResponseStatus.success, response.payload] }); reject(); }

            } else { LoadCollectionLogger.warn("Undefined response."); reject(); }
        });
    });
}

// Get the reference to the popup container element
const popupContainer: HTMLBodyElement = document.getElementsByTagName('body')[0];

const cardHTML = (sourceURL: string, body: string, createdAt: string) => `
<div class="card text-center">
    <div class="card-header">
        <p><a href="${sourceURL}" class="link-secondary">${sourceURL.substring(0, 24) + (sourceURL.length > 24 ? '...' : '')}</a></p>
    </div>
    <div class="card-body">
        <p class="card-text">
            <span class="d-inline-block text-truncate" style="max-width: calc(${popupContainer.style.width} * 0.8);">
                ${body}
            </span>
        </p>
        <a href="#" class="card-link">Card link</a>
    </div>
    <div class="card-footer text-body-secondary">
        ${createdAt}
    </div>
</div>
`;

window.addEventListener('DOMContentLoaded', () => {
    LoadCollectionLogger.debug("'DOMContentLoaded' event triggered.")

    getNotes().then((notes: Note[]) => {
        LoadCollectionLogger.debug("Updating collection.", { args: [notes] });
        updateCollection(notes, cardHTML);
    });
});
