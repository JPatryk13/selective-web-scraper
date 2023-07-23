// Get the reference to the popup container element
const popupContainer = document.getElementsByTagName('body')[0];

// Define the desired dimensions based on your breakpoints
const minScreenWidths = {
    xxl: 1400,
    xl: 1200,
    lg: 992,
    md: 768,
    sm: 576,
    xs: 0,
};
const popupWidths = {
    xxl: 450,
    xl: 450,
    lg: 350,
    md: 350,
    sm: 300,
    xs: 300,
}

// Function to set the dimensions based on the screen width
function setPopupDimensions(screenWidth) {
    console.log("Setting popup window width based on screen width (" + screenWidth + ")."); // debug

    let popupWidth;

    // Determine the width based on the screen width
    for (let breakPointKey in minScreenWidths) {
        if (screenWidth >= minScreenWidths[breakPointKey]) {

            console.log("Screen width >= " + breakPointKey + "(" + minScreenWidths[breakPointKey] + ").") // debug

            popupWidth = popupWidths[breakPointKey];
            break;
        }
    }

    // Set the calculated width to the popup container element
    console.log("Setting popup window width to " + popupWidth + "px"); // debug

    popupContainer.style.width = `${popupWidth}px`;
}

(async () => {
    console.log("Awaiting active tab object."); // debug

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    console.log("Got tab object:"); // debug
    console.log(tab); // debug

    const message = {
        mid: "resize-popup",
        ready: true
    };

    console.log("Sending message:"); // debug
    console.log(message); // debua#g
    console.log("Awaiting response."); // debug

    const response = await chrome.tabs.sendMessage(tab.id, message);

    console.log("Got response:"); // debug
    console.log(response); // debug

    setPopupDimensions(response.width);

    console.log("<body> got computed style:"); // debug
    console.log(window.getComputedStyle(popupContainer)); // debug
})();