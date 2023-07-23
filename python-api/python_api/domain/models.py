from dataclasses import dataclass
from uuid import uuid4
from abc import ABC, abstractmethod
from python_api.domain.types import NumberOfItems, Sorting
from datetime import datetime


@dataclass
class WebContent:
    uuid: str
    title: str | None
    body: str
    createdAt: int
    lastUpdatedAt: int
    src: str

    @classmethod
    def new(Cls, title: str, body: str, src: str) -> 'WebContent':
        timestamp: int = int(datetime.timestamp(datetime.now())*1000)
        return Cls(uuid=str(uuid4()), title=title, body=body, createdAt=timestamp, lastUpdatedAt=timestamp, src=src)
    

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