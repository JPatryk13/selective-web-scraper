import pymongo

from python_api.domain.models import WebContent, IWebContentRepository


class WebContentRepository:
    def __init__(self):
        myclient = pymongo.MongoClient("mongodb://localhost:27017")
        mydb = myclient["dexonix"]
        self._web_content_collection = mydb["web_content"]

    def save(self, web_content):
        self._web_content_collection.insert_one(web_content.__dict__)

    def get(self, uuid) -> WebContent:
        web_content = self._web_content_collection.find_one({"uuid": uuid})
        return WebContent(uuid=web_content["uuid"], text=web_content["text"])

