chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.mid === "highlighted-text") {
            // Submit Highlighted Text

            // 2a. Receive highlighted text
            console.log("Received a message:"); // debug
            console.log(request); // debug

            delete request.mid;

            // 3. Send POST request with the text
            POST("http://127.0.0.1:8000/web_content", request);

            /*
                Happy path:
                    4. Receive 200 OK
                    5. Inform submit_text.js that the text has been posted
            */
            /*
                Unhappy path - failed POST request:
                    4. Receive 4xx/5xx
                    5. Inform submit_text.js that there was an error when posting
            */
        } else if (request.mid === "") {
            // Update Popup Collection
            // 1. Receive message from popup
            // 2. Send GET request for the top 10 items from the user's collection
            /*
                Happy path:
                    3. Receive 200 OK with collection
                    4. Send collection to the popup_collection.js
            */
            /*
                Unhappy path - failed GET request:
                    3. Receive 4xx/5xx
                    4. Inform popup_collection.js that there was an error when retrieving collection
            */
        }
    }
);

function POST(url, payload) {
    console.log("Trying to post:"); // debug
    console.log(payload); // debug
    console.log("To:"); // debug
    console.log(url); // debug

    const initPOST = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    fetch(url, initPOST)
        .then(response => response.json())
        .then(response => {
            console.log("data:"); // debug
            console.log(response); // debug
        })
        .catch(error => {
            // Handle any errors
        });
}

function GET() {
    console.log("GET not implemented");
}