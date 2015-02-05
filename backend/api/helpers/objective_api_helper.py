from api.helpers import BaseApiHelper
from api.messages import ObjectiveResponse

from core.models import Objective


class ObjectiveApiHelper(BaseApiHelper):

    _model = Objective

    def to_message(self, entity):
        return ObjectiveResponse(
            id=entity.key.id(),
            title=entity.title,
            subObj=entity.subobj,
            pyp=entity.pyp
            )
