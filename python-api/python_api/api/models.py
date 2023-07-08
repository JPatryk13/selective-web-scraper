from pydantic import BaseModel
from python_api.domain.models import WebContent

class WebContentInputForm(BaseModel):
    text: str
    timestamp: int
    url: str


class WebContentResource(BaseModel):
    uuid: str
    text: str
    timestamp: int | None
    url: str | None

    @classmethod
    def from_web_content(cls, web_content: WebContent) -> "WebContentResource":
        return cls(
            uuid=web_content.uuid,
            text=web_content.text,
            timestamp=web_content.timestamp,
            url=web_content.url
        )