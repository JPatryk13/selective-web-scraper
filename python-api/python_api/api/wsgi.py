from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal

from python_api.api.models import WebContentInputForm, WebContentResource
from python_api.adapters.repositories import WebContentRepository
from python_api.domain.models import WebContent
from python_api.domain.types import Sorting, NumberOfItems
from python_api.app.services import save_text, retrieve_text, retrieve_many

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"]
)


@app.post("/web_content/")
def save_item(web_content_save_form: WebContentInputForm) -> WebContentResource:
    repository = WebContentRepository()

    web_content: WebContent = save_text(
        text=web_content_save_form.text,
        timestamp=web_content_save_form.timestamp,
        url=web_content_save_form.url,
        web_contect_repository=repository
    )
    return WebContentResource.from_web_content(web_content)


@app.get("/web_content/{uuid}")
def get_item(uuid: str) -> WebContentResource:
    repository = WebContentRepository()
    web_content: WebContent = retrieve_text(uuid, repository)

    if web_content is None:
        return "Not found", 404
    else:
        return WebContentResource.from_web_content(web_content)
    

@app.get("/web_content/")
def get_items(sorting: Sorting, no_of_items: NumberOfItems) -> list[WebContentResource]:
    repository = WebContentRepository()

    web_content: list[WebContent] = retrieve_many(sorting, no_of_items, repository)

    if web_content is None:
        return [("Not found", 404)]
    else:
        return list(map(WebContentResource.from_web_content, web_content))
    