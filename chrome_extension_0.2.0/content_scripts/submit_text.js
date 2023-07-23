const svgFill = "#FFFFFF";
const svgFillSuccess = "#28a745";
const svgFillFail = "#dc3545";
const buttonBackgroundColor = "#3c4043";
const svgSideLength = 24;

const spinnerBorderWidth = svgSideLength / 6;
const spinnerLoaderProperties = {
    retationPeriod: 0.5, // in seconds
    borderWidth: spinnerBorderWidth, // in px
    backgroundCircleColor: "#484d50",
    sideLength: svgSideLength - 2 * spinnerBorderWidth
};

const svgCheck = (width = 507.506, height = 507.506) => `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px"
    y="0px" viewBox="0 0 507.506 507.506" style="enable-background:new 0 0 507.506 507.506;" xml:space="preserve"
    width="${width}" height="${height}">
    <g>
        <path
            fill="${svgFillSuccess}"
            d="M163.865,436.934c-14.406,0.006-28.222-5.72-38.4-15.915L9.369,304.966c-12.492-12.496-12.492-32.752,0-45.248l0,0   
            c12.496-12.492,32.752-12.492,45.248,0l109.248,109.248L452.889,79.942c12.496-12.492,32.752-12.492,45.248,0l0,0   
            c12.492,12.496,12.492,32.752,0,45.248L202.265,421.019C192.087,431.214,178.271,436.94,163.865,436.934z" />
    </g>
</svg>
`;

const svgCross = (width = 512.021, height = 512.021) => svgPlus(width, height, 45, svgFillFail);

const svgPlus = (width = 512, height = 512, rotation = 0, customFill = svgFill) => `
<svg style="transform: rotate(${rotation}deg);" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px"
    y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" 
    width="${width}" height="${height}">
    <g>
        <path
            fill="${customFill}"
            d="M480,224H288V32c0-17.673-14.327-32-32-32s-32,14.327-32,32v192H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h192v192   
            c0,17.673,14.327,32,32,32s32-14.327,32-32V288h192c17.673,0,32-14.327,32-32S497.673,224,480,224z" />
    </g>
</svg>
`;

const divSpinner = "<div id=\"dexDivSpinningLoader\"></div>"

const template = (svg) => `<button id="dexSubmitTextButton">${svg}</button>`;

const styled = ({ display = "none", left = 0, top = 0 }) => `
    #dexSubmitTextButton {
        align-items: center;
        background-color: ${buttonBackgroundColor};
        border-radius: ${svgSideLength / 4.8}px;
        border: none;
        cursor: pointer;
        display: ${display};
        justify-content: center;
        left: ${left}px;
        padding: ${svgSideLength / 4.8}px ${svgSideLength / 4.8}px;
        position: fixed;
        top: ${top - svgSideLength / 4}px;
        width: ${svgSideLength * (5 / 3)}px;
        z-index: 9999;
    }

    #dexDivSpinningLoader {
        border: ${spinnerLoaderProperties.borderWidth}px solid ${spinnerLoaderProperties.backgroundCircleColor};
        border-radius: 50%;
        border-top: ${spinnerLoaderProperties.borderWidth}px solid ${svgFill};
        width: ${spinnerLoaderProperties.sideLength}px;
        height: ${spinnerLoaderProperties.sideLength}px;
        -webkit-animation: spin ${spinnerLoaderProperties.retationPeriod}s linear infinite; /* Safari */
        animation: spin ${spinnerLoaderProperties.retationPeriod}s linear infinite;
    }

    /* Safari */
    @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

class SubmitText extends HTMLElement {
    constructor() {
        console.log("Call to SubmitText.constructor()"); // debug

        super();
        this.render();
    }

    get markerPosition() {
        console.log("Call to SubmitText.markerPosition()"); // debug

        return JSON.parse(this.getAttribute("markerPosition") || "{}");
    }

    get styleElement() {
        console.log("Call to SubmitText.styleElement()"); // debug

        return this.shadowRoot.querySelector("style");
    }

    static get observedAttributes() {
        console.log("Call to SubmitText.observedAttributes()"); // debug

        return ["markerPosition", "ensureButtonActive"];
    }

    render() {
        console.log("Call to SubmitText.render()"); // debug

        this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        style.textContent = styled({});
        this.shadowRoot.appendChild(style);
        this.shadowRoot.innerHTML += template(svgPlus(svgSideLength, svgSideLength));
        this.shadowRoot
            .getElementById("dexSubmitTextButton")
            .addEventListener("click", () => {
                console.log("Event triggered: 'click' @ submit_text.js"); // debug

                // first deactivate button
                this.updateButtonActive(false);
                // update button 
                this.updateButtonAppearance(divSpinner);
                // dispatch highlighted text
                this.getHighlightedText();
            });
    }

    /**
     * Set button behaviour and cursor appearance to active/disabled
     * 
     * @param {Boolean} active if set to false button appearance and behaviour will be disabled. 
     * Default: true
     */
    updateButtonActive(active = true) {
        console.log("Call to SubmitText.updateButtonActive()"); // debug

        var button = this.shadowRoot.getElementById("dexSubmitTextButton");
        button.disabled = !active;
        if (active) {
            button.style.cursor = "pointer";
        } else {
            button.style.cursor = "default";
        }
    }

    /**
     * @param {String} content String with a valid html element
     */
    updateButtonAppearance(content) {
        console.log("Call to SubmitText.updateButtonAppearance()"); // debug

        var button = this.shadowRoot.getElementById("dexSubmitTextButton");
        button.innerHTML = content;
    }

    /**
     * Called when attributes are added, removed, or changed. Here, I'm interested in the 
     * setMarkerPosition() that is run on "click" and "selectionchange" events from content.js
     * script. If the funtion is called with the name argument set to "markerPosition" it
     * shall alter the position of the marker. However when the "selectionchange" event
     * is triggered, the attributeChangedCallback() will be called with name argument set
     * to "ensureButtonActive" which will execute updateButtonActive() function that ensures
     * the button is and appears as active.
     * 
     * @param {String} name attribute of interest
     */
    attributeChangedCallback(name, oldValue, newValue) {
        console.log("Call to SubmitText.sttributeChangedCallback()"); // debug

        if (name === "markerPosition") {
            this.styleElement.textContent = styled(this.markerPosition);
        } else if (name === "ensureButtonActive") {
            this.updateButtonActive(true);
            this.updateButtonAppearance(svgPlus(svgSideLength, svgSideLength));
        }
    }

    getHighlightedText() {
        console.log("Call to SubmitText.getHighlightedText()"); // debug

        var highlightedText = window.getSelection().toString();

        // Check if any text is selected
        if (highlightedText.length > 0) {

            const message = {
                mid: "highlighted-text",
                request: {
                    text: highlightedText,
                    timestamp: Date.now(), // unix time
                    url: window.location.href
                }
            };

            // Send it tot the service-worker
            (async () => {
                console.log("Sending message:"); // debug
                console.log(message); // debug
                const response = await chrome.runtime.sendMessage(message);
                console.log("Got response:"); // debug
                console.log(response); // debug

                if (response.success) {
                    // Change the appearance of the "+" button from loading to success
                    this.updateButtonAppearance(svgCheck(svgSideLength, svgSideLength));
                } else {
                    // Change the appearance of the "+" button from loading to warning
                    this.updateButtonAppearance(svgCross(svgSideLength, svgSideLength));
                }
            })();

        }
    }
}

window.customElements.define("submit-text", SubmitText);