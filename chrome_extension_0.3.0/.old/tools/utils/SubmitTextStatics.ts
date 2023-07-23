export type HtmlSvgElement = string;
export type Color = string;
export type HtmlElement = string;

export const svgFill: Color = "#FFFFFF";
export const svgFillSuccess: Color = "#28a745";
export const svgFillFail: Color = "#dc3545";
export const buttonBackgroundColor: Color = "#3c4043";
export const svgSideLength = 24;

export const spinnerBorderWidth: number = svgSideLength / 6;
export const spinnerLoaderProperties = {
    retationPeriod: 0.5, // in seconds
    borderWidth: spinnerBorderWidth, // in px
    backgroundCircleColor: "#484d50",
    sideLength: svgSideLength - 2 * spinnerBorderWidth
};

export const svgCheck = (width = 507.506, height = 507.506): HtmlSvgElement => `
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

export const svgCross = (width = 512.021, height = 512.021): HtmlSvgElement => svgPlus(width, height, 45, svgFillFail);

export const svgPlus = (width = 512, height = 512, rotation = 0, customFill: Color = svgFill): HtmlSvgElement => `
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

export const divSpinner: HtmlElement = "<div id=\"dexDivSpinningLoader\"></div>"

export const template = (svg: HtmlSvgElement): HtmlElement => `<button id="dexSubmitTextButton">${svg}</button>`;

export const styled = ({ display = "none", left = 0, top = 0 }) => `
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