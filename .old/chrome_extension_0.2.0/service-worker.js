chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.mid === "highlighted-text") {
            // Submit Highlighted Text

            // 2a. Receive highlighted text
            console.log("Received a message:"); // debug
            console.log(request); // debug

            delete request.mid;

            // 3. Send POST request with the text
            POST("http://127.0.0.1:8000/web_content", request.request).then(response => {
                console.log("Got response:"); // debug
                console.log(response); // debug

                // 4. Happy/unhappy path: Receive response
                // 5. Happy/unhappy path: Inform submit_text.js whether the post request was successful or not
                console.log("Sending message to submit_text.js:"); // debug
                console.log({ success: response.ok }); // debug

                sendResponse({ success: response.ok });

                if (!response.ok) {
                    // 4. Unhappy path - failed POST request: Receive 4xx/5xx
                    // 5. Unhappy path - failed POST request: Inform submit_text.js that there was an error when posting
                    console.log("Logging bad response: (not implemented)"); // debug

                    logBadResponse(request.request, response, "POST");
                }
            });

        } else if (request.mid === "update-collection") {
            // Update Popup Collection
            // 1. Receive message from popup

            // 2. Send GET request for the top 10 items from the user's collection
            GET("http://127.0.0.1:8000/web_content/?sorting=desc&no_of_items=10")
                .then(response => {
                    if (!response.ok) {
                        console.log("Logging bad response: (not implemented)"); // debug

                        logBadResponse(request, response, "GET");
                        return [];
                    }

                    return response.json();
                })
                .then(data => {

                    console.log("Data  (service-worker.js):"); // debug
                    console.log(data); // debug

                    // 4. Happy/unhappy path: Receive response
                    // 5. Happy/unhappy path: Inform load_collection.js whether the get request was successful or not, attach the payload

                    const message = {
                        success: !(data.length === 0),
                        content: data
                    }
                    sendResponse(message);
                });
        }

        return true;
    }
);

async function POST(url, payload) {
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

    const response = await fetch(url, initPOST);

    return response;
}

async function GET(url) {
    console.log("Sending a post request to: " + url);

    const response = await fetch(url);

    return response;
}

function logBadResponse(request, response, method) {
    const response_log = {
        status_code: response.status,
        status_text: response.statusText,
        endpoint: response.url,
        payload: request,
        method: method
    }
    // TODO: Logging unsuccessful requests
}