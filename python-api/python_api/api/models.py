from pydantic import BaseModel
from python_api.domain.models import WebContent

class WebContentInputForm(BaseModel):
    text: str


class WebContentResource(BaseModel):
    uuid: str
    text: str

    @classmethod
    def from_web_content(cls, web_content: WebContent) -> "WebContentResource":
        return cls(uuid=web_content.uuid, name=web_content.name)