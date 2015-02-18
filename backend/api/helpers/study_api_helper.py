from api.helpers import BaseApiHelper
from api.helpers import CellApiHelper
from api.messages import StudyResponse

from core.models import Study
from core.models import Cell


class StudyApiHelper(BaseApiHelper):

    _model = Study

    def to_message(self, entity):
        return StudyResponse(
            id=entity.key.id(),
            title=entity.title,
            variables=[variable_key.id() for variable_key in entity.variables],
            pyps=[pyp_key.id() for pyp_key in entity.pyps],
            cells=[CellApiHelper().to_message(Cell.get_by_id(cell)) for cell in entity.cells if Cell.get_by_id(cell)]
            )
