/**
 * @param {String} sourceDomain 
 * @param {String} sourceURL 
 * @param {String} text 
 * @param {String} howLongAgo 
 */
const cardHTML = (sourceDomain, sourceURL, text, datetime) => `
<div class="card text-center">
    <div class="card-header">
        <p><a href="${sourceURL}" class="link-secondary">${sourceDomain}</a></p>
    </div>
    <div class="card-body">
        <p class="card-text">
            <span class="d-inline-block text-truncate" style="max-width: calc(${popupContainer.style.width} * 0.8);">
                ${text}
            </span>
        </p>
        <a href="#" class="card-link">Card link</a>
    </div>
    <div class="card-footer text-body-secondary">
        ${datetime}
    </div>
</div>
`;

function updateCollection(collection) {

    let cards = "";

    for (let i = 0; i < collection.length; i++) {

        sourceDomain = (new URL(collection[i].url)).hostname;
        sourceURL = collection[i].url;
        text = collection[i].text;
        datetime = timestampToDatetime(collection[i].timestamp);

        console.log("sourceDomain: " + sourceDomain); // debug
        console.log("sourceURL: " + sourceURL); // debug
        console.log("text: " + text); // debug
        console.log("datetime: " + datetime); // debug

        cards += cardHTML(sourceDomain, sourceURL, text, datetime);
    }

    console.log(document);
    document.getElementById("popupContainer").innerHTML = cards;
}

/**
 * @param {int} timestamp 
 * @returns {String}
 */
function timestampToDatetime(timestamp) {
    let datetime = new Date(timestamp)
    return datetime.toLocaleDateString("default") + " " + datetime.toLocaleTimeString("default");
}

window.addEventListener('DOMContentLoaded',
    (async () => {
        const message = {
            mid: "update-collection",
            ready: true
        };

        console.log("Sending message:"); // debug
        console.log(message); // debug

        const response = await chrome.runtime.sendMessage(message);

        console.log("Got response:"); // debug
        console.log(response); // debug

        if (response.success) {
            // update collection
            updateCollection(response.content);
        } else {
            // display error
        }
    })()
)
