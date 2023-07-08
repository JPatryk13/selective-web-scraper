// submit-text is a wrapper for the button
const submitText = document.createElement("submit-text");
document.body.appendChild(submitText);

const setMarkerPosition = (markerPosition) => {
    console.log("Call to setMarkerPosition() @ content.js"); // debug

    submitText.setAttribute(
        "markerPosition",
        JSON.stringify(markerPosition)
    );
}

const ensureButtonActive = () => {
    console.log("Call to ensureButtonActive() @ content.js"); // debug

    submitText.setAttribute(
        "ensureButtonActive"
    );
}

const getSelectedText = () => window.getSelection().toString();

document.addEventListener("click", () => {
    console.log("Event triggered: 'click' @ content.js"); // debug

    if (getSelectedText().length > 0) {
        setMarkerPosition(getMarkerPosition());
    }
});

document.addEventListener("selectionchange", () => {
    console.log("Event triggered: 'selectionchange' @ content.js"); // debug

    if (getSelectedText().length === 0) {
        setMarkerPosition({ display: "none" });
        ensureButtonActive();
    }
});

function getMarkerPosition() {
    console.log("Call to getMarkerPosition() @ content.js"); // debug

    const rangeBounds = window
        .getSelection()
        .getRangeAt(0)
        .getBoundingClientRect();
    return {
        // Subtract width of marker button -> 40px / 2 = 20
        left: rangeBounds.left + rangeBounds.width / 2 - 20,
        top: rangeBounds.top - 30,
        display: "flex",
    };
}