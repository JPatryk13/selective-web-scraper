from python_api.domain.models import WebContent, IWebContentRepository


def save_text(text: str, web_contect_repository: IWebContentRepository) -> WebContent:
    web_content = WebContent.new(text)
    web_contect_repository.save(web_content)
    return web_content

def retrieve_text(uuid: str, web_content_repository: IWebContentRepository) -> WebContent:
    web_content = web_content_repository.get(uuid)
    return web_content