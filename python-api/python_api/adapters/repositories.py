import pymongo

from python_api.domain.models import WebContent
from python_api.domain.types import NumberOfItems, Sorting


class WebContentRepository:
    def __init__(self):
        myclient = pymongo.MongoClient("mongodb://localhost:27017")
        mydb = myclient["dexonix"]
        self._web_content_collection = mydb["web_content"]

    def save(self, web_content):
        self._web_content_collection.insert_one(web_content.__dict__)

    def get(self, uuid) -> WebContent:
        web_content = self._web_content_collection.find_one({"uuid": uuid})
        return WebContent(
            uuid=web_content["uuid"],
            text=web_content["text"],
            timestamp=web_content.get("timestamp", None),
            url=web_content.get("url", None)
        )
    
    def get_many(self, no_of_items: NumberOfItems, sorting: Sorting) -> list[WebContent]:
        item_list: list = []
        sorting_val: int = 1 # default

        if sorting == "desc":
            sorting_val = -1

        for web_content in self._web_content_collection.find().sort("timestamp", sorting_val):
            item_list.append(WebContent(
                uuid=web_content["uuid"],
                text=web_content["text"],
                timestamp=web_content.get("timestamp", None),
                url=web_content.get("url", None)
            ))

            if no_of_items != "all":
                if len(item_list) == no_of_items:
                    break

        return item_list
        
        
