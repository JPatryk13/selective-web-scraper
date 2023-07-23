import pymongo

from python_api.domain.models import WebContent
from python_api.domain.types import NumberOfItems, Sorting


class WebContentRepository:
    def __init__(self):
        myclient = pymongo.MongoClient("mongodb://localhost:27017")
        mydb = myclient["dexonix"]
        self._web_content_collection = mydb["notes"]

    def save(self, web_content):
        self._web_content_collection.insert_one(web_content.__dict__)

    def get(self, uuid) -> WebContent:
        web_content = self._web_content_collection.find_one({"uuid": uuid})
        return WebContent(
            uuid=web_content["uuid"],
            title=web_content["title"],
            body=web_content["body"],
            createdAt=web_content["createdAt"],
            lastUpdatedAt=web_content["lastUpdatedAt"],
            src=web_content["src"]
        )
    
    def get_many(self, no_of_items: NumberOfItems, sorting: Sorting) -> list[WebContent]:
        item_list: list = []
        sorting_val: int = 1 # default

        if sorting == "desc":
            sorting_val = -1

        for web_content in self._web_content_collection.find().sort([("timestamp", sorting_val), ("createdAt", sorting_val)]):
            item_list.append(WebContent(
                uuid=web_content["uuid"],
                title=web_content["title"],
                body=web_content["body"],
                createdAt=web_content["createdAt"],
                lastUpdatedAt=web_content["lastUpdatedAt"],
                src=web_content["src"]
            ))

            if no_of_items != "all":
                if len(item_list) == no_of_items:
                    break

        return item_list
        
        
