from api.helpers import BaseApiHelper
from api.messages import VariableResponse
from api.messages import KeywordMessage

from core.models import Variable
from core.models import Keyword


class VariableApiHelper(BaseApiHelper):

    _model = Variable

    def to_message(self, entity):
        return VariableResponse(
            id=entity.key.id(),
            name=entity.name,
            tipo=entity.tipo,
            keywords=[KeywordApiHelper().to_message(keyword) for keyword in entity.keywords],
            description=entity.description,
            definitions=entity.definitions
            )


class KeywordApiHelper(BaseApiHelper):

    _model = Keyword

    def to_message(self, key):
        entity = key.get()
        return KeywordMessage(
            id=key.id(),
            name=entity.name,
            definition=entity.definition
            )
