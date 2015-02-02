from api.helpers import BaseApiHelper
from api.messages import VariableResponse

from core.models import Variable


class VariableApiHelper(BaseApiHelper):

    _model = Variable

    def to_message(self, entity):
        return VariableResponse(
            id=entity.key.id(),
            title=entity.title,
            tipo=entity.tipo,
            keywords=entity.keywords,
            description=entity.description,
            definitions=entity.definitions
            )
