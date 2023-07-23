from pydantic import BaseModel
from python_api.domain.models import WebContent


class WebContentInputForm(BaseModel):
    title: str | None
    body: str
    src: str


class WebContentResource(BaseModel):
    uuid: str
    title: str | None
    body: str
    createdAt: int
    lastUpdatedAt: int
    src: str

    @classmethod
    def from_web_content(cls, web_content: WebContent) -> "WebContentResource":
        return cls(
            uuid=web_content.uuid,
            title=web_content.title,
            body=web_content.body,
            createdAt=web_content.createdAt,
            lastUpdatedAt=web_content.lastUpdatedAt,
            src=web_content.src
        )