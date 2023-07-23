# Codename: selective_web_scraper
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
