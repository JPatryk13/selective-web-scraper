# Work title: Selective Web Scraper

Google extension written in TypeScript (and API mock is written in Python) for collecting highlighted text from websites. Was supposed to be a part of the project I participated in, however the project came to an end. The extension can be added to Google Chrome browser. Some functionalities are to available at the moment.

## v0.1.0
- Scraping highlighted text with content scripts and `customElements`
- Sending text to python API with `XMLHttpRequest`. `POST` request payload:
    ```json
    {
        "text": string
    }
    ```
## v0.2.0
- Added simple, responsive popup displaying top 10 most recent messages
- Service worker acts as a message bus communicationg popup scripts, content scripts and external python API
- Sending `POST` and `GET` request via service worker using fetch API. `POST` request payload:
    ```json
    {
        "text": string,
        "timestamp": number,
        "url": string
    }
    ```
## v0.3.0
- Switched to TypeScript + Webpack configuration
- Separated dev and prod dependencies (work in progress)
