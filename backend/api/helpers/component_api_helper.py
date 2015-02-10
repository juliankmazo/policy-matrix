from api.helpers import BaseApiHelper
from api.messages import ComponentResponse

from core.models import Component


class ComponentApiHelper(BaseApiHelper):

    _model = Component

    def to_message(self, entity):
        return ComponentResponse(
            id=entity.key.id(),
            title=entity.title,
            objective=entity.objective,
            definition=entity.definition,
            outputs=entity.outputs
            )
