import endpoints
from protorpc import message_types

from api import pmm_api
from api.controllers import BaseApiController
from api.helpers import VariableApiHelper

from api.messages import VariableRequest
from api.messages import VariableResponse
from api.messages import VariableListResponse

from core.models import Variable


@pmm_api.api_class(resource_name='variables', path='variables')
class VariableEndpoint(BaseApiController):

    @endpoints.method(message_types.VoidMessage, VariableListResponse,
                      path='/variables', http_method='GET', name='get_all')
    def get_variables(self, request):
        variables = Variable.get_all()
        return VariableListResponse(
            variable=[VariableApiHelper().to_message(variable) for variable in variables if variables])

    def create_variable(self, request):
        if not(request.title and request.tipo):
            raise endpoints.BadRequestException('Title and type are required')
        variable = Variable.create(
            request.title,
            request.tipo,
            request.keywords,
            request.description,
            request.definitions
            )
        if not variable:
            raise endpoints.BadRequestException('Something went wrong')
        return VariableResponse()
