from dataclasses import dataclass
from uuid import uuid4
from abc import ABC, abstractmethod


@dataclass
class WebContent:
    uuid: str
    text: str

    @classmethod
    def new(Cls, text: str) -> 'WebContent':
        return Cls(uuid=str(uuid4()), text=text)
    

class IWebContentRepository(ABC):
    @abstractmethod
    def save(self, web_content: WebContent) -> None:
        raise NotImplementedError
    
    @abstractmethod
    def get(self, uuid: str) -> WebContent:
        raise NotImplementedError