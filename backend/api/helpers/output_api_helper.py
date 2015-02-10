from api.helpers import BaseApiHelper
from api.messages import OutputResponse

from core.models import Output


class OutputApiHelper(BaseApiHelper):

    _model = Output

    def to_message(self, entity):
        return OutputResponse(
            id=entity.key.id(),
            title=entity.title,
            component=entity.component,
            )
