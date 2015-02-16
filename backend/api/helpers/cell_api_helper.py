from api.helpers import BaseApiHelper
from api.messages import CellResponse

from core.models import Cell


class CellApiHelper(BaseApiHelper):

    _model = Cell

    def to_message(self, entity):
        return CellResponse(
            id=entity.key.id(),
            score=entity.score,
            scoreIndex=entity.scoreIndex,
            study=entity.study,
            variable=entity.variable,
            output=entity.output
            )
