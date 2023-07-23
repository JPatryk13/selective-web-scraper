from python_api.domain.models import WebContent, IWebContentRepository
from python_api.domain.types import Sorting, NumberOfItems


def save_text(title: str, body: str, src: str, web_contect_repository: IWebContentRepository) -> WebContent:
    web_content = WebContent.new(title=title, body=body, src=src)
    web_contect_repository.save(web_content)
    return web_content

def retrieve_text(uuid: str, web_content_repository: IWebContentRepository) -> WebContent:
    web_content = web_content_repository.get(uuid)
    return web_content

def retrieve_many(
    sorting: Sorting,
    no_of_items: NumberOfItems,
    web_content_repository: IWebContentRepository
) -> list[WebContent]:
    web_content = web_content_repository.get_many(no_of_items, sorting)
    return web_content