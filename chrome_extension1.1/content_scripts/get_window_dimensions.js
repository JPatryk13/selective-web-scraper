{
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.mid == "resize-popup") {
                const message = {
                    mid: "resize-popup",
                    width: window.innerWidth
                };
                if (request.ready === true) {
                    console.log("Got: ready = true; sending message:"); // debug
                    console.log(message); // debug
                    sendResponse(message);
                }
            }
        }
    );
}