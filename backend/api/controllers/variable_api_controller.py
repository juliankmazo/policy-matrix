import endpoints
from protorpc import message_types

from api import pmm_api
from api.controllers import BaseApiController
from api.helpers import VariableApiHelper

from api.messages import VariableRequest
from api.messages import VariableResponse
from api.messages import VariableListResponse
from api.messages import variable_resource

from core.models import Variable


@pmm_api.api_class(resource_name='variables', path='variables')
class VariableEndpoint(BaseApiController):

    @endpoints.method(message_types.VoidMessage, VariableListResponse,
                      path='/variables', http_method='GET', name='get_all')
    def get_variables(self, request):
        variables = Variable.get_all()
        return VariableListResponse(
            variables=[VariableApiHelper().to_message(variable) for variable in variables if variables])

    @endpoints.method(variable_resource, VariableListResponse,
                      path='{id}', http_method='GET', name='get_one')
    def get_variable(self, request):
        variable = Variable.get_by_id(request.id)
        if not variable:
            raise endpoints.NotFoundException(
              "The variable ID: " + str(request.id) + " doesn't exist")
        return VariableListResponse(
            variables=[VariableApiHelper().to_message(variable)])

    @endpoints.method(VariableRequest, VariableListResponse,
                      path='/variables', http_method='POST', name='create')
    def create_variable(self, request):
        if not(request.name and request.tipo):
            raise endpoints.BadRequestException('name and type are required')
        variable = Variable.create(
            request.name,
            request.tipo,
            request.keywords,
            request.description,
            request.definitions
            )
        if not variable:
            raise endpoints.InternalServerErrorException('Something went wrong')
        return VariableListResponse(
            variables=[VariableApiHelper().to_message(variable)])

    @endpoints.method(variable_resource, VariableListResponse,
                      path='{id}', http_method='PUT', name='update')
    def update_variable(self, request):
        variable = Variable.get_by_id(request.id)
        if not variable:
            raise endpoints.NotFoundException(
              "The variable ID: " + str(request.id) + " doesn't exist")
        updated_variable = Variable.update(
            variable,
            request.name,
            request.tipo,
            request.keywords,
            request.description,
            request.definitions
            )
        if not updated_variable:
            raise endpoints.BadRequestException('Something went wrong')
        return VariableListResponse(
            variables=[VariableApiHelper().to_message(variable)])

    @endpoints.method(variable_resource, message_types.VoidMessage,
                      path='{id}', http_method='DELETE', name='delete')
    def delete_variable(self, request):
        variable = Variable.get_by_id(request.id)
        if not variable:
            raise endpoints.NotFoundException(
              "The variable ID: " + str(request.id) + " doesn't exist")
        variable.key.delete()
        return message_types.VoidMessage()
