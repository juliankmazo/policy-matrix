from api.helpers import BaseApiHelper
from api.messages import StudyResponse

from core.models import Study


class StudyApiHelper(BaseApiHelper):

    _model = Study

    def to_message(self, entity):
        return StudyResponse(
            id=entity.key.id(),
            title=entity.title,
            variables=[variable_key.id() for variable_key in entity.variables],
            pyps=[pyp_key.id() for pyp_key in entity.pyps],
            cells=entity.cells
            )
