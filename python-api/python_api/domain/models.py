from dataclasses import dataclass
from uuid import uuid4
from abc import ABC, abstractmethod
from python_api.domain.types import NumberOfItems, Sorting


@dataclass
class WebContent:
    uuid: str
    text: str
    timestamp: int
    url: str | None

    @classmethod
    def new(Cls, text: str, timestamp: int, url: str = None) -> 'WebContent':
        return Cls(uuid=str(uuid4()), text=text, timestamp=timestamp, url=url)
    

class IWebContentRepository(ABC):
    @abstractmethod
    def save(self, web_content: WebContent) -> None:
        raise NotImplementedError
    
    @abstractmethod
    def get(self, uuid: str) -> WebContent:
        raise NotImplementedError
    
    @abstractmethod
    def get_many(self, no_of_items: NumberOfItems, sorting: Sorting = None) -> list[WebContent]:
        raise NotImplementedError