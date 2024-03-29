const submitText = document.createElement("submit-text");
document.body.appendChild(submitText);

const setMarkerPosition = (markerPosition) =>
    submitText.setAttribute(
        "markerPosition",
        JSON.stringify(markerPosition)
    );

const getSelectedText = () => window.getSelection().toString();

document.addEventListener("click", () => {
    if (getSelectedText().length > 0) {
        setMarkerPosition(getMarkerPosition());
    }
});

document.addEventListener("selectionchange", () => {
    if (getSelectedText().length === 0) {
        setMarkerPosition({ display: "none" });
    }
});

function getMarkerPosition() {
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