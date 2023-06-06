from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from python_api.api.models import WebContentInputForm, WebContentResource
from python_api.adapters.repositories import WebContentRepository
from python_api.domain.models import WebContent
from python_api.app.services import save_text, retrieve_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"]
)


@app.post("/web_content/")
def save_item(web_content_save_form: WebContentInputForm) -> WebContentResource:
    repository = WebContentRepository()
    web_content: WebContent = save_text(web_content_save_form.text, repository)
    return WebContentResource.from_web_content(web_content)


@app.get("/web_content/{uuid}")
def get_item(uuid: str) -> WebContentResource:
    repository = WebContentRepository()
    web_content: WebContent = retrieve_text(uuid, repository)

    if web_content is None:
        return "Not found", 404
    else:
        return WebContentResource.from_web_content(web_content)
    