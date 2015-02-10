import endpoints
from protorpc import message_types

from api import pmm_api
from api.controllers import BaseApiController
from api.helpers import OutputApiHelper

from api.messages import OutputListResponse
from api.messages import OutputRequest
from api.messages import Output_resource

from core.models import Output
from core.models import Component
# from core.models import outputHelper


@pmm_api.api_class(resource_name='outputs', path='outputs')
class OutputEndpoint(BaseApiController):

    @endpoints.method(message_types.VoidMessage, OutputListResponse,
                      path='/outputs', http_method='GET', name='get_all')
    def get_outputs(self, request):
        outputs = Output.get_all()
        return OutputListResponse(
            outputs=[OutputApiHelper().to_message(output) for output in outputs if outputs])

    @endpoints.method(Output_resource, OutputListResponse,
                      path='{id}', http_method='GET', name='get_one')
    def get_output(self, request):
        output = Output.get_by_id(request.id)
        if not output:
            raise endpoints.NotFoundException(
                "The output ID: " + str(request.id) + " doesn't exist")
        return OutputListResponse(
            outputs=[OutputApiHelper().to_message(output)])

    @endpoints.method(OutputRequest, OutputListResponse,
                      path='/outputs', http_method='POST', name='create')
    def create_output(self, request):
        if not (request.title and request.component):
            raise endpoints.BadRequestException('title is required')
        output = Output.create(request)
        if not output:
            raise endpoints.InternalServerErrorException('Something went wrong')
        Component.add_output(request, output)
        return OutputListResponse(
            outputs=[OutputApiHelper().to_message(output)])

    @endpoints.method(Output_resource, OutputListResponse,
                      path='{id}', http_method='PUT', name='update')
    def update_output(self, request):
        output = Output.get_by_id(request.id)
        if not output:
            raise endpoints.NotFoundException(
                "The output ID: " + str(request.id) + " doesn't exist")
        updated_output = output.update(output, request)
        if not updated_output:
            raise endpoints.InternalServerErrorException('Something went wrong')
        return OutputListResponse(
            outputs=[OutputApiHelper().to_message(output)])

    @endpoints.method(Output_resource, message_types.VoidMessage,
                      path='{id}', http_method='DELETE', name='delete')
    def delete_output(self, request):
        output = Output.get_by_id(request.id)
        if not output:
            raise endpoints.NotFoundException(
                "The output ID: " + str(request.id) + " doesn't exist")
        output.key.delete()
        return message_types.VoidMessage()
