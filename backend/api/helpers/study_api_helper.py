from api.helpers import BaseApiHelper
from api.messages import StudyResponse

from core.models import Study


class StudyApiHelper(BaseApiHelper):

    _model = Study

    def to_message(self, entity):
        return StudyResponse(
            id=entity.key.id(),
            title=entity.title,
            country=entity.country
            )
